import { observable } from "mobx";
import EditorNode from "./EditorNode";
import EditorCanvas from "./EditorCanvas";

export const CactivaWorker = {
  worker: null,
};

interface IEditorProps {
  el?: HTMLElement;
  node?: EditorNode;
  hidden?: boolean;
  mode?: "popup" | "sidebar";
}

interface IEditorComponent {
  el?: HTMLElement;
  domRef?: HTMLElement;
  hidden?: boolean;
  mode?: "popup" | "sidebar";
}

interface IEditorCopy {
  node?: EditorNode;
  mode: "copy" | "move";
}

export interface IEditorStore {
  propsEditor: IEditorProps;
  componentEditor: IEditorComponent;
  fontColor: string;
  canvas: { [key: string]: EditorCanvas };
  mode: "layout" | "hybrid" | "preview";
  selectedNode: EditorNode;
  copiedCode: IEditorCopy;
}

export const cactiva: IEditorStore = observable({
  propsEditor: {
    mode: "popup",
    hidden: false,
  },
  componentEditor: {
    mode: "popup",
    hidden: false,
  },
  fontColor: "#fff",
  canvas: {},
  mode: localStorage.cactivaMode || "layout",
  selectedNode: null,
  copiedCode: {
    mode: "copy",
  },
});
