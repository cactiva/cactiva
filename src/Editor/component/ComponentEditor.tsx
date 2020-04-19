import { observer, useObservable } from "mobx-react-lite";
import { Callout, DirectionalHint, Modal } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import * as ReactDOM from "react-dom";
import { cactiva } from "../../models/store";
import IconClose from "../icons/IconClose";
import IconComment from "../icons/IconComment";
import IconSidebar from "../icons/IconSidebar";
import IconStar from "../icons/IconStar";
import Popover from "../ui/Popover";
import { fuzzyMatch } from "../../libs/utils";

export default observer(({ domNode }: any) => {
  const componentEditor = cactiva.componentEditor;
  return (
    <>
      {componentEditor.mode === "sidebar" ? (
        <ComponentEditorContent
          domNode={domNode}
          style={{ display: componentEditor.hidden ? "none" : "flex" }}
        />
      ) : (
        <>
          {componentEditor.domRef && !componentEditor.hidden && (
            <Modal
              titleAriaId={"ComponentsEditor"}
              isOpen={!componentEditor.hidden}
              onDismiss={() => {
                componentEditor.hidden = !componentEditor.hidden;
              }}
              isBlocking={false}
            >
              <ComponentEditorContent />
            </Modal>
          )}
        </>
      )}
    </>
  );
});

const ComponentEditorContent = observer(({ domNode, style }: any) => {
  let bgColor = "white";
  let fontColor = "black";

  const componentEditor = cactiva.componentEditor;
  const sidebar = document.getElementById("workbench.parts.sidebar");

  if (sidebar && componentEditor.mode === "sidebar") {
    bgColor = sidebar.style.backgroundColor;
    fontColor = sidebar.style.color;
  }
  const meta = useObservable({
    components: [
      {
        label: "View",
        source: "react-native",
      },
      {
        label: "Button",
        source: "react-native",
      },
      {
        label: "Text",
        source: "react-native",
      },
    ],
    filter: "",
  });

  useEffect(() => {
    (async () => {})();
  }, [cactiva.fontColor]);

  const content = (
    <div
      className={`cactiva-components-editor ${componentEditor.mode}`}
      style={style}
    >
      <div className="title row pad space-between">
        <div>Components</div>
        <div className="row">
          <div
            className="center margin-right pointer"
            onClick={() => {
              if (componentEditor.mode === "sidebar") {
                componentEditor.mode = "popup";
              } else {
                componentEditor.mode = "sidebar";
              }
            }}
          >
            {componentEditor.mode === "popup" ? (
              <IconSidebar color={fontColor} size={11} />
            ) : (
              <IconComment color={fontColor} size={11} />
            )}
          </div>
          <div
            className="center pointer"
            onClick={() => {
              componentEditor.hidden = !componentEditor.hidden;
            }}
          >
            <IconClose color={fontColor} size={13} />
          </div>
        </div>
      </div>
      <div className="content">
        <input
          className="search-input"
          placeholder="Search Component"
          value={meta.filter}
          onChange={(e) => {
            meta.filter = e.target.value;
          }}
        />
        {meta.components
          .filter((item: any) => {
            if (meta.filter.length > 0) {
              return (
                fuzzyMatch(
                  meta.filter.toLowerCase(),
                  item.label.toLowerCase()
                ) ||
                fuzzyMatch(meta.filter.toLowerCase(), item.source.toLowerCase())
              );
            }
            return true;
          })

          .map((item, idx) => {
            return (
              <Popover
                key={idx}
                calloutProps={{
                  directionalHint: DirectionalHint.rightCenter,
                  calloutWidth: 180,
                }}
                content={(popover: any) => {
                  return (
                    <div
                      style={{
                        padding: 10,
                        minHeight: 150,
                      }}
                    >
                      Information Component
                    </div>
                  );
                }}
              >
                {({ show, hide, ref, state }: any) => {
                  return (
                    <div
                      ref={ref}
                      className="item-component"
                      onMouseOver={() => {
                        show();
                      }}
                      onMouseOut={() => {
                        hide();
                      }}
                    >
                      <div className="component-info">
                        <div className="label">{item.label}</div>
                        <div className="source">~ {item.source}</div>
                      </div>
                      <div className="component-favorite">
                        <IconStar size={13} color={fontColor} />
                      </div>
                    </div>
                  );
                }}
              </Popover>
            );
          })}
      </div>
      <style>
        {`
        .search-input {
          background: ${bgColor};
          color: ${fontColor};
        }
        .cactiva-components-editor {
          background: ${bgColor};
          display: flex;
          flex-direction: column;
        }
        .cactiva-components-editor.sidebar {
          position: absolute;
          top: 0;
          left: 0;
          right: 1px;
          bottom: 0;
          z-index: 9;
        }

        .cactiva-components-editor.popup {
          min-width: 300px;
          min-height: 80px;
        }

        .cactiva-components-editor.popup > .title {
          border-bottom: 1px solid #ccc;
          background: #ececeb;
        }

        .cactiva-components-editor .highlight:active {
          background: rgba(255, 255, 0, 0.3);
        }
        .cactiva-components-editor div {
          display: flex;
          flex-direction: column;
          color: ${fontColor};
        }

        .cactiva-components-editor .pad {
          padding: 5px;
        }

        .cactiva-components-editor .full {
          flex: 1;
        }
        .cactiva-components-editor .row {
          align-items: stretch;
          flex-direction: row;
        }
        .cactiva-components-editor .center {
          align-items: center;
          justify-content: center;
        }
        .cactiva-components-editor .space-between {
          justify-content: space-between;
        }

        .cactiva-components-editor .margin-right {
          margin-right: 5px;
        }

        .cactiva-components-editor .pointer {
          cursor: pointer;
          opacity: 0.7;
        }

        .cactiva-components-editor .pointer:hover {
          opacity: 1;
        }

        .cactiva-components-editor .title {
          padding-left: 10px;
        }

        .cactiva-components-editor .ms-List-cell .prop {
          padding: 3px;
          border-bottom: 1px dotted ${fontColor};
          overflow: hidden;
        }

        .cactiva-components-editor
          .ms-List-cell:first-page
          .ms-List-cell:first-child
          .prop {
          border-top: 1px dotted ${fontColor};
        }

        .cactiva-components-editor .prop .title {
          flex-basis: 30%;
          min-width: 70px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          margin-right: 5px;
        }

        .cactiva-components-editor .prop .field,
        .cactiva-components-editor .prop .field .input {
          flex: 1;
          position: relative;
        }

        .cactiva-components-editor .prop .field .input {
          overflow: hidden;
        }

        .cactiva-components-editor .prop .field .input .overflow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          white-space: nowrap;
        }

        .cactiva-components-editor .prop .field .goto-source {
          flex-basis: 20px;
          display: none;
        }

        .cactiva-components-editor .prop:hover .field .goto-source {
          display: flex;
        }
        .cactiva-components-editor .prop:hover .field .goto-source:focus {
          opacity: 0.5;
        }
        .cactiva-components-editor.popup .goto-source {
          display: none !important;
        }
        .cactiva-components-editor .new-prop {
          border: 0;
          padding: 2px 0px 4px 12px;
          font-size: 14px;
          outline: none !important;
          background: ${bgColor};
          color: ${fontColor};
        }
        `}
      </style>
    </div>
  );

  if (!domNode) {
    return content;
  }
  return ReactDOM.createPortal(content, domNode);
});
