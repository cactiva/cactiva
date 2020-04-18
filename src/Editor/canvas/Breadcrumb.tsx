import { observer } from "mobx-react-lite";
import IconHybrid from "../icons/IconHybrid";
import IconLayout from "../icons/IconLayout";
import IconPreview from "../icons/IconPreview";
import { cactiva } from "../../models/store";
import EditorNode from "../../models/EditorNode";
import Popover from "../ui/Popover";
import EditorCanvas from "../../models/EditorCanvas";
import React from "react";

export default observer(
  ({ canvas, onClick }: { canvas: EditorCanvas; onClick: any }) => {
    const mode = cactiva.mode;
    const changeMode = (mode: "preview" | "layout" | "hybrid") => {
      cactiva.mode = mode;
      localStorage.cactivaMode = mode;
    };

    return (
      <div className="tabs-breadcrumbs">
        <div className="breadcrumbs-control relative-path backslash-path">
          <div
            className="monaco-scrollable-element"
            role="presentation"
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="monaco-breadcrumbs"
              role="list"
              style={{
                background: "transparent",
                overflow: "hidden",
                width: "100%",
                height: "22px",
              }}
            >
              {canvas.breadcrumbs.map((node: EditorNode, idx: number) => {
                const tagName = node.text;
                const hovered = canvas.hoveredNode === node ? "hover" : "";
                const selected = canvas.selectedNode === node ? "selected" : "";
                const item = (
                  <div
                    key={idx}
                    onClick={() => {
                      onClick(node);
                    }}
                    onMouseOut={() => {
                      canvas.hoveredNode = undefined;
                    }}
                    onMouseOver={(ev: any) => {
                      canvas.hoveredNode = node;
                      ev.stopPropagation();
                    }}
                    className="cactiva folder monaco-breadcrumb-item"
                    role="listitem"
                  >
                    {idx === 0 && (
                      <div className="breadcrumb-first-spacer"></div>
                    )}
                    <div className={`monaco-icon-label ${selected} ${hovered}`}>
                      <div className="monaco-icon-label-container">
                        <span className="monaco-icon-name-container">
                          <a className="label-name"> {tagName}</a>
                        </span>
                        <span className="monaco-icon-description-container"></span>
                      </div>
                    </div>
                    {canvas.breadcrumbs.length - 1 !== idx && (
                      <div className="codicon codicon-chevron-right"></div>
                    )}
                  </div>
                );

                if (idx > 0) {
                  return item;
                } else {
                  return (
                    <Popover
                      key={idx}
                      content={(popover: any) => {
                        return (
                          <div>
                            {canvas.source.rootNodes.map((e, idx) => {
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    padding: "5px 15px",
                                    cursor: "pointer",
                                    borderTop:
                                      idx === 0 ? "0px" : "1px solid #ccc",
                                  }}
                                  onClick={() => {
                                    canvas.selectNode(
                                      idx.toString(),
                                      "breadcrumb"
                                    );
                                    popover.hide();
                                  }}
                                >
                                  {e.text}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }}
                    >
                      {item}
                    </Popover>
                  );
                }
              })}
            </div>
            <div className="canvas-toolbar">
              <div
                className={`btn btn-toolbar btn-layout ${
                  mode === "preview" ? "active" : ""
                }`}
                onClick={() => {
                  changeMode("preview");
                  cactiva.selectedNode = undefined;
                }}
              >
                <IconPreview size={14} color={cactiva.fontColor} />
              </div>
              <div
                className={`btn btn-toolbar btn-preview ${
                  mode === "hybrid" ? "active" : ""
                }`}
                onClick={() => {
                  changeMode("hybrid");
                }}
              >
                <IconHybrid size={14} color={cactiva.fontColor} />
              </div>
              <div
                className={`btn btn-toolbar btn-preview ${
                  mode === "layout" ? "active" : ""
                }`}
                onClick={() => {
                  changeMode("layout");
                }}
              >
                <IconLayout size={13} color={cactiva.fontColor} />
              </div>
            </div>
            <div className="breadcrumb-first-spacer"></div>
          </div>
        </div>
        <style></style>
      </div>
    );
  }
);
