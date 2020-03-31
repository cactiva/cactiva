import { observer } from "mobx-react-lite";
import React from "react";
import EditorCanvas from "../../../models/EditorCanvas";
import EditorNode from "../../../models/EditorNode";

interface ITagPreview {
  canvas: EditorCanvas;
  node: EditorNode;
  style?: any;
  isLast?: boolean;
  children?: any;
  onClick?: (node: Node, nodePath: string) => void;
  className?: string;
  tagName: string;
}

export default observer(({ children, className }: ITagPreview) => {
  return <div className={`tag-preview ${className}`}>{children}</div>;
});
 