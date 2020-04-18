/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  Orientation,
  Sizing,
  SplitView,
} from "vs/base/browser/ui/splitview/splitview";
import "vs/css!./media/editor";
import { ICodeEditorService } from "vs/editor/browser/services/codeEditorService";
import app from "vs/editor/browser/widget/cactiva/cactiva-app";
import { CactivaCanvasPane } from "vs/editor/browser/widget/cactivaCanvasPane";
import { CactivaCodePane } from "vs/editor/browser/widget/cactivaCodePane";
import {
  CodeEditorWidget,
  ICodeEditorWidgetOptions,
} from "vs/editor/browser/widget/codeEditorWidget";
import { IEditorConstructionOptions } from "vs/editor/common/config/editorOptions";
import { Range } from "vs/editor/common/core/range";
import * as editorCommon from "vs/editor/common/editorCommon";
import { ITextModel } from "vs/editor/common/model";
import { IAccessibilityService } from "vs/platform/accessibility/common/accessibility";
import { ICommandService } from "vs/platform/commands/common/commands";
import { IContextKeyService } from "vs/platform/contextkey/common/contextkey";
import { IInstantiationService } from "vs/platform/instantiation/common/instantiation";
import { INotificationService } from "vs/platform/notification/common/notification";
import { IThemeService } from "vs/platform/theme/common/themeService";
import { getWorkerBootstrapUrl } from "vs/base/worker/defaultWorkerFactory";
import { debounce } from "vs/base/common/decorators";

(window as any).requireToUrl = require.toUrl;

export class CactivaEditorWidget extends CodeEditorWidget {
  private readonly _domEl: HTMLElement;
  private readonly _splitView: SplitView;
  private readonly _codePane: CactivaCodePane;
  private readonly _canvasPane: CactivaCanvasPane;

  private _app: any;
  private _canvasPaneSize: number;
  private _canvasPaneSizeStoreKey: string;
  private _paneMode: "code" | "vertical" | "horizontal" | "canvas";
  public commandService: ICommandService;

  public layout(dimension?: editorCommon.IDimension): void {
    if (dimension) {
      if (this._splitView.length > 1) {
        this.superLayout({
          ...dimension,
          width: this._splitView.getViewSize(0),
        });
      } else {
        this.superLayout(dimension);
      }
    } else {
      this.superLayout();
    }
    if (this._splitView.length > 1) {
      this._splitView.layout(dimension?.width || 0);
    }
  }
  public superLayout(dimension?: editorCommon.IDimension): void {
    if (dimension) {
      const border =
        this._paneMode === "horizontal"
          ? this._codePane.element.style.borderRightWidth
          : this._codePane.element.style.borderTopWidth;
      const borderOffset = parseInt(border) || 1;
      super.layout({ ...dimension, width: dimension.width - borderOffset });
    } else {
      super.layout();
    }
  }

  constructor(
    domElement: HTMLElement,
    options: IEditorConstructionOptions,
    codeEditorWidgetOptions: ICodeEditorWidgetOptions,
    @IInstantiationService instantiationService: IInstantiationService,
    @ICodeEditorService codeEditorService: ICodeEditorService,
    @ICommandService commandService: ICommandService,
    @IContextKeyService contextKeyService: IContextKeyService,
    @IThemeService themeService: IThemeService,
    @INotificationService notificationService: INotificationService,
    @IAccessibilityService accessibilityService: IAccessibilityService
  ) {
    const splitview = new SplitView(domElement, {
      orientation: Orientation.HORIZONTAL,
    });
    const codePane = new CactivaCodePane({ title: "Code" });
    const canvasPane = new CactivaCanvasPane({ title: "Canvas" });

    super(
      codePane.element,
      options,
      codeEditorWidgetOptions,
      instantiationService,
      codeEditorService,
      commandService,
      contextKeyService,
      themeService,
      notificationService,
      accessibilityService
    );

    this.commandService = commandService;
    this._canvasPaneSizeStoreKey = `cactiva-sash-${this.getId()}`;
    const _canvasPaneSize = localStorage[this._canvasPaneSizeStoreKey];
    this._canvasPaneSize = _canvasPaneSize ? parseInt(_canvasPaneSize) : 0;

    this._paneMode = "horizontal";
    this._domEl = domElement;
    this._splitView = this._register(splitview);
    this._codePane = this._register(codePane);
    this._canvasPane = this._register(canvasPane);

    (async () => {
      this._app = await app.init();
      const { CactivaWorker } = this._app;
      if (!CactivaWorker.worker) {
        const url = getWorkerBootstrapUrl(
          require.toUrl("./cactiva/cactiva-worker.txt"),
          new Date().getTime().toString()
        );
        CactivaWorker.worker = new Worker(url);
      }
    })();

    const onResize = () => {
      if (this._splitView.length === 1) {
        this.superLayout({
          width: this._domEl.clientWidth,
          height: this._domEl.clientHeight,
        });
      } else {
        this.superLayout({
          width: this._splitView.getViewSize(0),
          height: this._domEl.clientHeight,
        });
      }
    };
    window.addEventListener("resize", onResize);
    this._register({
      dispose: () => {
        window.removeEventListener("resize", onResize);
      },
    });

    this._register(
      this._splitView.onDidSashChange(() => {
        this.superLayout({
          width: this._splitView.getViewSize(0),
          height: this._domEl.clientHeight,
        });
        localStorage[
          `cactiva-sash-${this.getId()}`
        ] = this._splitView.getViewSize(1);
      })
    );

    const onWindowResize = () => {
      console.log("window on resize");
    };
    window.addEventListener("onresize", onWindowResize);
    this._register({
      dispose: () => {
        window.removeEventListener("onresize", onWindowResize);
      },
    });

    splitview.addView(codePane, Sizing.Distribute);
  }

  @debounce(300)
  async _cactivaOnDidChangeCursorPosition(e: any) {
    const { cactiva } = this._app;
    const id = this._modelData?.model.id;
    if (id) {
      const canvas = cactiva.canvas[id];
      const source = canvas.source;

      // prevent selecting loop between select from canvas and select from code editor.
      if (canvas.selectingFromCanvas) {
        canvas.selectingFromCanvas = false;
        return;
      }

      if (source) {
        // select source in editor
        const range = new Range(0, 0, e.position.lineNumber, e.position.column);
        let src = this._modelData?.viewModel.getPlainTextToCopy(
          [range],
          false,
          false
        );
        if (src) {
          if (Array.isArray(src)) {
            src = src.join("\n");
          }
          const nodePath = await source.getNodePathAtPos(src.length);
          await canvas.selectNode(nodePath, "code");
        }
      }
    }
  }

  @debounce(300)
  async _cactivaOnDidChangeModelContent(e: any) {
    const { cactiva, EditorSource } = this._app;
    const model = this._modelData?.model;
    if (model) {
      const canvas = cactiva.canvas[model.id];
      if (canvas) {
        if (canvas.source.fileName === model.uri.fsPath) {
          await canvas.source.load(model.getValue());
        } else {
          canvas.source.dispose();
          canvas.source = new EditorSource(model.uri.fsPath, canvas);
          await canvas.source.load(model.getValue());
        }
        canvas.selectedNode = undefined;
        cactiva.selectedNode = undefined;
      }
    }
  }

  protected async _attachModel(model: ITextModel | null): Promise<void> {
    super._attachModel(model);

    if (!this._app) {
      this._app = await app.init();
    }

    const { cactiva } = this._app;
    if (!!model) {
      cactiva.selectedNode = undefined;
      if (this._modelData) {
        this._canvasPane.updateModelData(this._modelData, this, this._app);
      }
      this._changeLanguageTo(model?.getLanguageIdentifier().language);
      this._modelData?.listenersToRemove.push(
        this.onDidChangeModelLanguage((e) => {
          this._changeLanguageTo(e.newLanguage);
        })
      );
      this._modelData?.listenersToRemove.push(
        this.onDidChangeCursorPosition(
          this._cactivaOnDidChangeCursorPosition.bind(this)
        )
      );
      this._modelData?.listenersToRemove.push(
        this.onDidChangeModelContent(
          this._cactivaOnDidChangeModelContent.bind(this)
        )
      );
      if (this._splitView.length === 1) {
        this.superLayout({
          width: this._domEl.clientWidth,
          height: this._domEl.clientHeight,
        });
      } else {
        this.superLayout({
          width: this._splitView.getViewSize(0),
          height: this._domEl.clientHeight,
        });
      }
    }
  }

  private _changeLanguageTo(languageId: string) {
    const { cactiva } = this._app;
    if (languageId.indexOf("react") > 0) {
      if (this._splitView.length <= 1) {
        const domElWidth = this._domEl.clientWidth;
        this._splitView.layout(domElWidth);
        this._splitView.addView(this._canvasPane, this._canvasPaneSize, 1);
      } else {
        this._splitView.setViewVisible(1, true);
      }
      this.superLayout({
        width: this._splitView.getViewSize(0),
        height: this._domEl.clientHeight,
      });
    } else if (this._splitView.length > 1 && languageId.indexOf("react") < 0) {
      cactiva.propsEditor.hidden = true;
      cactiva.selectedNode = undefined;
      this._splitView.setViewVisible(1, false);
      this.layout({
        width: this._domEl.clientWidth,
        height: this._domEl.clientHeight,
      });
    }
  }
}
