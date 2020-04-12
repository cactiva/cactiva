import debounce from "lodash.debounce";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useCallbackRef } from "../../libs/useCallbackRef";
import EditorCanvas from "../../models/EditorCanvas";
import EditorNode from "../../models/EditorNode";
import { cactiva } from "../../models/store";
import Divider from "./tag/Divider";
import TagChild from "./tag/TagChild";
import TagPreview from "./tag/TagPreview";
import Popover from "../ui/Popover";
import { DirectionalHint } from "office-ui-fabric-react";

interface ISingleTag {
  canvas: EditorCanvas;
  node: EditorNode;
  style?: any;
  isLast?: boolean;
  onClick?: (node: EditorNode) => void;
}

const Tag: React.FunctionComponent<ISingleTag> = observer(
  ({ canvas, node, style, onClick }: ISingleTag) => {
    const [, dragRef, preview] = useDrag({
      item: { type: "cactiva-tag", node, dropEffect: "none" },
      canDrag: (monitor) => {
        return true;
      },
    });
    const onDrop = debounce(
      async (from: EditorNode, to: EditorNode, pos: string) => {
        if (cactiva.propsEditor.mode === "popup") {
          cactiva.propsEditor.hidden = true;
        }

        const editor = node.source.canvas.editor;
        if (editor) {
          await to.prependChild(from);
          await node.source.canvas.selectNode(to.path + ".0", "canvas");
        }
      }
    );
    const [drop, dropRef] = useDrop({
      accept: "cactiva-tag",
      collect: (monitor) => ({
        hover: !!monitor.isOver({ shallow: true }),
      }),
      drop: (item: any, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          onDrop(item.node, node, "children");
        }
      },
    });

    const mode = cactiva.mode;
    const tagName = node.text;
    const childrenNode = node.children;
    const hovered = canvas.hoveredNode === node ? "hover" : "";
    const selected = canvas.selectedNode === node ? "selected" : "";
    const hasChildren = childrenNode.length > 0;
    const domRef = useCallbackRef(null as HTMLDivElement | null, (val) => {
      node.domRef = val;
    });

    let className = node.tag.attributes.className || "";
    if (className) {
      className =
        "." +
        className
          .split(" ")
          .filter((e) => !!e.trim())
          .join(" .");
    }

    useEffect(() => {
      node.domRef = domRef.current;
    }, [node]);

    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, []);

    dragRef(domRef);
    dropRef(domRef);

    const showProps = () => {
      const sidebar = document.getElementById("workbench.parts.sidebar");
      if (!document.getElementById("cactiva.props")) {
        const el = document.createElement("div");
        el.setAttribute("id", "cactiva.props");
        sidebar?.appendChild(el);
        cactiva.propsEditor.el = el;
      }
    };

    return (
      <Popover
        calloutProps={{
          directionalHint: DirectionalHint.topLeftEdge,
          calloutWidth: 150,
          isBeakVisible: false,
          coverTarget: true,
        }}
        content={(popover: any) => {
          return (
            <div
              style={{
                padding: 10,
                height: 80,
              }}
            >
              Klik Kanan
            </div>
          );
        }}
      >
        {({ show, hide, ref, state }: any) => {
          ref.current = node.domRef;
          return (
            <div
              ref={domRef}
              onClick={(e: any) => {
                if (onClick) {
                  onClick(node);
                  e.stopPropagation();
                }
              }}
              onContextMenu={(e) => {
                if (!!state.visible) {
                  hide();
                } else {
                  show();
                }
                e.stopPropagation();
              }}
              onDoubleClick={(e: any) => {
                showProps();
                if (cactiva.propsEditor.mode === "popup") {
                  if (onClick) {
                    onClick(node);
                  }
                  cactiva.propsEditor.hidden = false;
                }
                e.stopPropagation();
              }}
              onMouseOut={() => {
                canvas.hoveredNode = undefined;
              }}
              onMouseOver={(e: any) => {
                canvas.hoveredNode = node;
                e.stopPropagation();
              }}
              className={`singletag vertical ${selected} ${hovered} ${mode}`}
              style={style}
            >
              {mode !== "preview" && (
                <div className="headertag">
                  <span className="tagname">
                    {tagName}
                    {className}
                  </span>
                </div>
              )}
              <TagPreview
                className="children"
                canvas={canvas}
                node={node}
                tagName={tagName}
              >
                {mode !== "preview" && (
                  <Divider
                    onDrop={onDrop}
                    position="first-children"
                    hovered={drop.hover}
                    node={node}
                    index={0}
                  />
                )}
                {hasChildren &&
                  childrenNode.map((e: EditorNode, idx) => {
                    return (
                      <TagChild
                        canvas={canvas}
                        Tag={Tag}
                        isLast={idx === childrenNode.length - 1}
                        key={idx}
                        node={e}
                        idx={idx}
                        onClick={onClick}
                      />
                    );
                  })}
              </TagPreview>
            </div>
          );
        }}
      </Popover>
    );
  }
);

export default Tag;
