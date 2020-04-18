import { observable } from "mobx";
import EditorBase from "./EditorBase";
import EditorSource from "./EditorSource";
import EditorNodeAttr from "./EditorNodeAttr";

export interface IEditorNodePos {
  line: number;
  column: number;
}

interface ITagInfo {
  attributes: {
    [key: string]: string;
  };
}

export default class EditorNode extends EditorBase {
  @observable start: IEditorNodePos = {
    line: 0,
    column: 0,
  };
  @observable end: IEditorNodePos = {
    line: 0,
    column: 0,
  };

  @observable path = "";
  @observable text = "";
  @observable kind = "";
  @observable tag: ITagInfo = {
    attributes: {},
  };
  @observable expression = "";
  @observable children: EditorNode[] = [];
  @observable source: EditorSource;
  @observable domRef: any = undefined;

  constructor(props: {
    source: EditorSource;
    path: string;
    text: string;
    kind: string;
    tag: ITagInfo;
    children: EditorNode[];
    start: IEditorNodePos;
    end: IEditorNodePos;
    expression: string;
  }) {
    super();
    this.source = props.source;
    this.path = props.path;
    this.text = props.text;
    this.kind = props.kind;
    this.start = props.start;
    this.end = props.end;
    this.tag = props.tag;
    this.expression = props.expression;

    if (Array.isArray(props.children)) {
      this.children = props.children.map((e: any) => {
        if (e instanceof EditorNode) {
          return e;
        } else {
          return new EditorNode({ ...e, source: this.source });
        }
      });
    }
  }

  async setCode(code: string, refreshCanvas?: boolean): Promise<void> {
    const result = await this.executeInWorker("node:setCode", {
      fileName: this.source.fileName,
      path: this.path,
      code,
    });
    if (result) {
      await this.source.canvas.updateContent(result, refreshCanvas);
    }
  }

  async getCode(): Promise<{ kind: string; text: string }[]> {
    const result = await this.executeInWorker("node:getCode", {
      fileName: this.source.fileName,
      path: this.path,
    });
    if (result) {
      return result;
    }
    return [];
  }

  async moveFrom(node: EditorNode, pos: "before" | "after") {
    const result = await this.executeInWorker("node:move", {
      fileName: this.source.fileName,
      from: node.path,
      to: this.path,
      position: pos,
    });
    if (result) {
      this.source.canvas.updateContent(result);
    }
  }

  async prependChild(node: EditorNode): Promise<void> {
    const result = await this.executeInWorker("node:move", {
      fileName: this.source.fileName,
      from: node.path,
      to: this.path,
      position: "children",
    });
    if (result) {
      this.source.canvas.updateContent(result);
    }
  }

  async copiedToChild(node: EditorNode): Promise<void> {
    const result = await this.executeInWorker("node:copy", {
      fileName: this.source.fileName,
      from: node.path,
      to: this.path,
      position: "children",
    });
    if (result) {
      this.source.canvas.updateContent(result);
    }
  }

  async getAttributes(): Promise<EditorNodeAttr[]> {
    const result = await this.executeInWorker("node:getAttributes", {
      fileName: this.source.fileName,
      path: this.path,
    });
    if (result) {
      this.tag.attributes = result;
      return result.map((e: any) => {
        return new EditorNodeAttr({ ...e, node: this });
      });
    } else {
      return [];
    }
  }
}
