import { observer } from "mobx-react-lite";
import React from "react";
import EditorCanvas from "../../../models/EditorCanvas";
import EditorNode from "../../../models/EditorNode";
import { cactiva } from "../../../models/store";
import Divider from "./Divider";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

interface ITagChild {
  canvas: EditorCanvas;
  idx: number;
  onClick: (node: EditorNode) => void;
  node: EditorNode;
  Tag: any;
  isLast: boolean;
}

export default observer(
  ({ canvas, idx, onClick, node, Tag, isLast }: ITagChild) => {
    const mode = cactiva.mode;
    const onDrop = async (from: any, to: any, pos: string) => {
      const editor = node.source.canvas.editor;
      if (editor) {
        if (cactiva.propsEditor.mode === "popup") {
          cactiva.propsEditor.hidden = true;
        }

        await to.moveFrom(from, pos);
        const toPath = to.path.split(".");
        let selectPath = toPath.join(".");
        let index = toPath[toPath.length - 1];
        if (pos === "after") {
          toPath[toPath.length - 1] = (index * 1 + 1).toString();
          selectPath = toPath.join(".");
        }
        await node.source.canvas.selectNode(selectPath, "canvas");
      }
    };
    const [, dragRef, preview] = useDrag({
      item: { type: "cactiva-tag", node, dropEffect: "none" },
      canDrag: monitor => {
        return true;
      }
    });

    React.useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, []);
    if (
      node.kind === "JsxFragment" ||
      node.kind === "JsxSelfClosingElement" ||
      node.kind === "JsxElement"
    ) {
      return (
        <React.Fragment key={idx}>
          <Tag canvas={canvas} onClick={onClick} isLast={isLast} node={node} />
          {mode !== "preview" && (
            <Divider
              position="after"
              onDrop={onDrop}
              bubbleHover={isLast}
              node={node}
              index={idx}
            />
          )}
        </React.Fragment>
      );
    } else if (node.kind === "JsxText" || node.kind === "JsxExpression") {
      let content = null;
      let children = null;
      if (node.kind === "JsxExpression") {
        content = node.expression;
        if (node.children.length > 0) {
          children = node.children.map((j, jix) => (
            <Tag
              canvas={canvas}
              onClick={onClick}
              node={j}
              isLast={jix === node.children.length - 1}
              key={jix}
              style={{
                border: 0,
                borderTop: jix > 0 ? "1px dashed red" : 0
              }}
            />
          ));
        }
      }

      if (!!content || node.kind === "JsxText") {
        const expressionProps = {
          style: {
            fontFamily: canvas.editorOptions?.fontFamily,
            font: canvas.editorOptions?.fontSize
          }
        };

        const text = node.expression || node.text;
        if (text) {
          if (cactiva.mode !== "layout" && node.kind === "JsxExpression") {
            content = null;
          } else {
            content = (
              <div
                {...expressionProps}
                ref={dragRef}
                className={`expression-code ${children ? "has-children" : ""}`}
              >
                {text}
              </div>
            );
          }
        }
      }

      if (content || children) {
        const selected = canvas.selectedNode === node ? "selected" : "";
        const hovered = canvas.hoveredNode === node ? "hover" : "";
        const type = node.kind === "JsxText" ? "" : "expression";
        return (
          <React.Fragment key={idx}>
            <div
              onClick={(e: any) => {
                if (onClick) {
                  onClick(node);
                  e.stopPropagation();
                }
              }}
              onMouseOut={() => {
                canvas.hoveredNode = undefined;
              }}
              onMouseOver={(ev: any) => {
                canvas.hoveredNode = node;
                ev.stopPropagation();
              }}
              className={`singletag vertical ${type} ${selected} ${hovered} ${mode}`}
              key={idx}
            >
              {content} {children}
            </div>
            {mode !== "preview" && (
              <Divider
                onDrop={onDrop}
                position="after"
                bubbleHover={isLast}
                node={node}
                index={idx}
              />
            )}
          </React.Fragment>
        );
      }
    }
    return null;
  }
);
