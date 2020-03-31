import { observable } from "mobx";
import EditorNode from "./EditorNode";
import EditorCanvas from "./EditorCanvas";
import EditorBase from "./EditorBase";

export default class EditorSource extends EditorBase {
  @observable fileName: string;
  @observable content: string;
  @observable rootNodes: EditorNode[] = [];
  @observable canvas: EditorCanvas;
  @observable isReady: boolean = false;

  constructor(fileName: string, canvas: EditorCanvas) {
    super();
    this.fileName = fileName;
    this.canvas = canvas;
  }

  async load(content: string) {
    const data = await this.executeInWorker("source:load", {
      fileName: this.fileName,
      content
    });

    this.rootNodes = data.map((e: any) => {
      return new EditorNode({ ...e, source: this });
    });

    this.isReady = true;
  }

  continueWhenReady(): Promise<boolean> {
    return new Promise(resolve => {
      let i = 0;
      setInterval(() => {
        if (this.isReady) {
          resolve(true);
        }
        i++;

        if (i > 100) {
          resolve(false);
        }
      }, 50);
    });
  }

  async getNodeFromPath(
    nodePath: string,
    whenEachFound?: (node: EditorNode, path: string) => void
  ): Promise<EditorNode | null> {
    if (!nodePath || typeof nodePath !== "string") {
      return null;
    }
    if (!(await this.continueWhenReady())) {
      return null;
    }

    const pathArray = nodePath.split(".");
    const lastPath: string[] = [];

    let lastNode = { children: this.rootNodes };
    let continueLoop = true;
    pathArray.forEach((e, idx: number) => {
      if (!continueLoop) {
        return;
      }
      lastPath.push(e);
      const num = parseInt(e);
      const path = lastPath.join(".");
      const children = lastNode.children;

      if (num >= children.length) {
        continueLoop = false;
      } else {
        const child = children[num];

        if (child) {
          if (whenEachFound) {
            whenEachFound(child, path);
          }
          lastNode = child;
        } else {
          continueLoop = false;
        }
      }
    });

    if (lastNode instanceof EditorNode) {
      return lastNode;
    }
    return null;
  }

  async getNodePathAtPos(pos: number) {
    const node = this.executeInWorker("node:getNodePathAtPos", {
      pos,
      fileName: this.fileName
    });
    return node;
  }
}
