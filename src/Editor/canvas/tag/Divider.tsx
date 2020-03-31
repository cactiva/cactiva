import React from "react";
import { observer, useObservable } from "mobx-react-lite";
import { useDrop } from "react-dnd";
import EditorNode from "../../../models/EditorNode";

export default observer(
  (props: {
    bubbleHover?: boolean;
    position: "before" | "after" | "first-children" | "last-children";
    node?: EditorNode;
    hovered?: boolean;
    index: number;
    onDrop: (from: EditorNode, to: EditorNode, pos: string) => void;
  }) => {
    const meta = useObservable({
      hover: false
    });
    const [drop, dropRef] = useDrop({
      accept: "cactiva-tag",
      collect: monitor => ({
        hover: !!monitor.isOver({ shallow: true })
      }),
      drop: (item: any, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          if (props.node) {
            props.onDrop(item.node, props.node, props.position);
          }
        }
      }
    });
    const hovered = meta.hover || drop.hover || props.hovered ? "hover" : "";
    return (
      <div
        ref={dropRef}
        className={`divider ${hovered}`}
        onMouseOut={() => {
          meta.hover = false;
        }}
        onMouseOver={(e: any) => {
          meta.hover = true;

          if (!props.bubbleHover) {
            e.stopPropagation();
          }
        }}
      ></div>
    );
  }
);
