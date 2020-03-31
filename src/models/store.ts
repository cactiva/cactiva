import { observable } from "mobx";
import EditorNode from "./EditorNode";
import EditorCanvas from "./EditorCanvas";

export const CactivaWorker = {
  worker: null
};

interface IEditorProps {
  el?: HTMLElement;
  node?: EditorNode;
  hidden?: boolean;
  mode?: "popup" | "sidebar";
}

export interface IEditorStore {
  propsEditor: IEditorProps;
  fontColor: string;
  canvas: { [key: string]: EditorCanvas };
  mode: "layout" | "hybrid" | "preview";
}

export const cactiva: IEditorStore = observable({
  propsEditor: {
    mode: "popup",
    hidden: false
  },
  fontColor: "#fff",
  canvas: {},
  mode: localStorage.cactivaMode || "layout"
});
