import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useDrop } from "react-dnd";
import EditorNode from "../../../models/EditorNode";
import { cactiva } from "../../../models/store";
import IconAddCircle from "../../icons/IconAddCircle";
import { onPaste } from "../ContextMenu";
import IconPaste from "../../icons/IconPaste";

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
      hover: false,
      addTag: false,
    });
    const [drop, dropRef] = useDrop({
      accept: "cactiva-tag",
      collect: (monitor) => ({
        hover: !!monitor.isOver({ shallow: true }),
      }),
      drop: (item: any, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          if (props.node) {
            props.onDrop(item.node, props.node, props.position);
          }
        }
      },
    });
    const hovered = meta.hover || drop.hover || props.hovered ? "hover" : "";
    const showComponents = () => {
      const sidebar = document.getElementById("workbench.parts.sidebar");
      console.log(
        "ex",
        !document.getElementById("cactiva.components"),
        sidebar
      );
      if (!document.getElementById("cactiva.components")) {
        const el = document.createElement("div");
        el.setAttribute("id", "cactiva.components");
        sidebar?.appendChild(el);
        cactiva.componentEditor.el = el;
      }
    };
    const clearEditor = () => {
      let el = document.getElementById("cactiva.components");
      if (!!el) {
        el.remove();
      }
    };
    useEffect(() => {
      if (cactiva.componentEditor.hidden) {
        meta.addTag = false;
        meta.hover = false;
        clearEditor();
      }
    }, [cactiva.componentEditor.hidden]);
    return (
      <div
        ref={dropRef}
        className={`divider ${hovered}`}
        onMouseOut={() => {
          if (!meta.addTag) meta.hover = false;
        }}
        onMouseOver={(e: any) => {
          meta.hover = true;

          if (!props.bubbleHover) {
            e.stopPropagation();
          }
        }}
      >
        <div className="divider-action">
          <div
            className="icon"
            onClick={(e: any) => {
              showComponents();
              cactiva.componentEditor.hidden = false;
              cactiva.componentEditor.domRef = e.target.parentElement;
              meta.addTag = true;
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <IconAddCircle size={14} color={"#333"} />
          </div>
          {!!cactiva.copiedCode.node && (
            <div
              className="icon"
              onClick={(e: any) => {
                onPaste(
                  cactiva.copiedCode.node,
                  props.node,
                  cactiva.copiedCode.mode,
                  "children"
                );
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <IconPaste size={14} color={"#333"} />
            </div>
          )}
        </div>
      </div>
    );
  }
);
