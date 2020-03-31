import { observable, observe } from "mobx";
import EditorBase from "./EditorBase";
import EditorNode from "./EditorNode";
import EditorSource from "./EditorSource";
import { cactiva } from "./store";
import { Range } from "./vscode/range";
import { Position } from "./vscode/position";

export const enum DefaultEndOfLine {
  LF = 1,
  CRLF = 2
}
export default class EditorCanvas extends EditorBase {
  @observable breadcrumbs: EditorNode[] = [];
  @observable id: string;
  @observable modelData?: any;
  @observable editor?: any;
  @observable editorOptions?: any;
  @observable source: EditorSource;
  @observable selectedNode?: EditorNode;
  @observable selectingFromCanvas?: boolean;
  @observable hoveredNode?: EditorNode;
  @observable isReady: boolean = false;

  private createTextBuffer;
  constructor(id: string, createTextBuffer: any) {
    super();
    this.id = id;
    this.source = new EditorSource("", this);
    this._register({
      dispose: observe(this, "source", async (e: any) => {
        await this.selectRootNode("0");
      })
    });
    this.createTextBuffer = createTextBuffer;
  }

  async selectRootNode(path: string) {
    this.isReady = false;
    this.breadcrumbs = [];
    await this.source.getNodeFromPath(path, (node, npath) => {
      this.breadcrumbs.push(node);
      cactiva.propsEditor.hidden = true;
    });
    this.isReady = true;
  }

  async setSource(sourceText: string) {
    const modelData = this.modelData;
    if (modelData) {
      this.source = new EditorSource(modelData.model.uri.fsPath, this);
      await this.source.load(sourceText);
    }
  }

  async updateContent(content: string, refreshCanvas: boolean = true) {
    const editor = this.editor;
    const model = this.modelData?.model;
    if (editor && model && this.createTextBuffer) {
      const eol = model.getEOL();
      const from = editor.getValue();
      const getPos = (str: string) => {
        const buffer = this.createTextBuffer(
          str,
          eol === "\n" ? DefaultEndOfLine.LF : DefaultEndOfLine.CRLF
        );
        return buffer.getPositionAt(str.length);
      };
      const end = getPos(from);
      editor.pushUndoStop();
      editor.executeEdits(this.id, [
        {
          range: Range.fromPositions(
            new Position(0, 0),
            new Position(end.lineNumber, end.column)
          ),
          text: content
        }
      ]);
      editor.pushUndoStop();
      if (refreshCanvas) {
        await this.source.load(content);
      }
    }
  }

  async selectNode(path: string, from: "canvas" | "code" | "breadcrumb") {
    const breadcrumbs: EditorNode[] = [];
    await this.source.getNodeFromPath(path, n => {
      breadcrumbs.push(n);
    });

    if (breadcrumbs.length === 0) {
      return;
    }

    this.breadcrumbs = breadcrumbs;
    this.selectedNode = this.breadcrumbs[this.breadcrumbs.length - 1];

    if (!this.selectedNode) {
      return;
    }
    if (from === "code") {
      // only show propsEditor when it's not hidden
      if (!cactiva.propsEditor.hidden) {
        cactiva.propsEditor.node = this.selectedNode;
      }

      // always show propsEditor on code select
      // cactiva.propsEditor.hidden = false;
      // cactiva.propsEditor.nodeInfo = this.selectedNode;

      const cnode = this.selectedNode;
      const dom = cnode.domRef;
      if (dom && dom) {
        dom.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center"
        });
      }
    } else if (from === "canvas" || from === "breadcrumb") {
      if (cactiva.propsEditor.mode === "sidebar") {
        cactiva.propsEditor.hidden = false;
      }
      cactiva.propsEditor.node = this.selectedNode;
      const s = this.selectedNode.start;
      const e = this.selectedNode.end;
      this.selectingFromCanvas = true;
      this.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
      this.editor?.revealLineNearTop(s.line);
      this.editor?.focus();
    }
  }
}
