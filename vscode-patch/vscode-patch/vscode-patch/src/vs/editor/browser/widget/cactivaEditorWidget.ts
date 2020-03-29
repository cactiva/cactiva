/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Orientation, Sizing, SplitView } from 'vs/base/browser/ui/splitview/splitview';
import 'vs/css!./media/editor';
import { ICodeEditorService } from 'vs/editor/browser/services/codeEditorService';
import { CactivaCanvasPane } from 'vs/editor/browser/widget/cactivaCanvasPane';
import { CactivaCodePane } from 'vs/editor/browser/widget/cactivaCodePane';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from 'vs/editor/browser/widget/codeEditorWidget';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ITextModel } from 'vs/editor/common/model';
import { IAccessibilityService } from 'vs/platform/accessibility/common/accessibility';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { INotificationService } from 'vs/platform/notification/common/notification';
import { IThemeService } from 'vs/platform/theme/common/themeService';

export class CactivaEditorWidget extends CodeEditorWidget {

	private readonly _domEl: HTMLElement;
	private readonly _splitView: SplitView;
	private readonly _codePane: CactivaCodePane;
	private readonly _canvasPane: CactivaCanvasPane;

	private _canvasPaneSize: number;
	private _canvasPaneSizeStoreKey: string;
	private _paneMode: 'code' | 'vertical' | 'horizontal' | 'canvas';
	public commandService: ICommandService;

	public layout(dimension?: editorCommon.IDimension): void {
		if (dimension) {
			if (this._splitView.length > 1) {
				this._splitView.layout(dimension?.width || 0);
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
	}
	public superLayout(dimension?: editorCommon.IDimension): void {
		if (dimension) {
			const border =
				this._paneMode === 'horizontal'
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
		const codePane = new CactivaCodePane({ title: 'Code' });
		const canvasPane = new CactivaCanvasPane({ title: 'Canvas' });

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

		this._paneMode = 'horizontal';
		this._domEl = domElement;
		this._splitView = this._register(splitview);
		this._codePane = this._register(codePane);
		this._canvasPane = this._register(canvasPane);

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
		window.addEventListener('resize', onResize);
		this._register({
			dispose: () => {
				window.removeEventListener('resize', onResize);
			},
		});

		this._register(
			this._splitView.onDidSashChange(() => {
				this.superLayout({
					width: this._splitView.getViewSize(0),
					height: this._domEl.clientHeight,
				});
				localStorage[`cactiva-sash-${this.getId()}`] = this._splitView.getViewSize(1);
			})
		);

		const onWindowResize = () => {
			console.log('window on resize');
		};
		window.addEventListener('onresize', onWindowResize);
		this._register({
			dispose: () => {
				window.removeEventListener('onresize', onWindowResize);
			},
		});

		splitview.addView(codePane, Sizing.Distribute);
	}


	protected _attachModel(model: ITextModel | null): void {
		super._attachModel(model);
		if (!!model) {
			this._changeLanguageTo(model?.getLanguageIdentifier().language);
			this._modelData?.listenersToRemove.push(
				this.onDidChangeModelLanguage((e) => {
					this._changeLanguageTo(e.newLanguage);
				})
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
		if (languageId.indexOf('react') > 0) {
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
		} else if (this._splitView.length > 1 && languageId.indexOf('react') < 0) {
			this._splitView.setViewVisible(1, false);
			this.layout({
				width: this._domEl.clientWidth,
				height: this._domEl.clientHeight,
			});
		}
	}
}
