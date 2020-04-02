import { observer, useObservable } from "mobx-react-lite";
import { Callout, DirectionalHint, List } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import * as ReactDOM from "react-dom";
import EditorNodeAttr from "../../models/EditorNodeAttr";
import { cactiva } from "../../models/store";
import IconClose from "../icons/IconClose";
import IconComment from "../icons/IconComment";
import IconSidebar from "../icons/IconSidebar";
import Attribute from "./Attribute";

export default observer(({ domNode }: any) => {
  const propsEditor = cactiva.propsEditor;
  return (
    <>
      {propsEditor.mode === "sidebar" ? (
        <PropsEditorContent
          domNode={domNode}
          style={{ display: propsEditor.hidden ? "none" : "flex" }}
        />
      ) : (
        <>
          {propsEditor.node && propsEditor.node.domRef && !propsEditor.hidden && (
            <Callout
              onDismiss={() => {}}
              directionalHint={DirectionalHint.leftCenter}
              target={propsEditor.node.domRef}
            >
              <PropsEditorContent />
            </Callout>
          )}
        </>
      )}
    </>
  );
});

const PropsEditorContent = observer(({ domNode, style }: any) => {
  let bgColor = "white";
  let fontColor = "black";

  const propsEditor = cactiva.propsEditor;
  const sidebar = document.getElementById("workbench.parts.sidebar");

  if (sidebar && propsEditor.mode === "sidebar") {
    bgColor = sidebar.style.backgroundColor;
    fontColor = sidebar.style.color;
  }
  const meta = useObservable({
    tagName: "",
    newProp: "",
    attributes: [] as EditorNodeAttr[]
  });

  useEffect(() => {
    (async () => {
      if (propsEditor.node) {
        meta.tagName = propsEditor.node.text;
        meta.attributes = await propsEditor.node.getAttributes();
      }
    })();
  }, [propsEditor.node, cactiva.fontColor]);

  const content = (
    <div className={`cactiva-props-editor ${propsEditor.mode}`} style={style}>
      <div className="title row pad space-between">
        <div>{meta.tagName}</div>
        <div className="row">
          <div
            className="center margin-right pointer"
            onClick={() => {
              if (propsEditor.mode === "sidebar") {
                propsEditor.mode = "popup";
              } else {
                propsEditor.mode = "sidebar";
              }
            }}
          >
            {propsEditor.mode === "popup" ? (
              <IconSidebar color={fontColor} size={11} />
            ) : (
              <IconComment color={fontColor} size={11} />
            )}
          </div>
          <div
            className="center pointer"
            onClick={() => {
              propsEditor.hidden = !propsEditor.hidden;
              if (propsEditor.hidden) {
                propsEditor.node = undefined;
              }
            }}
          >
            <IconClose color={fontColor} size={13} />
          </div>
        </div>
      </div>
      <div>
        <List
          items={meta.attributes}
          onRenderCell={(item: EditorNodeAttr, index: number): JSX.Element => {
            return <Attribute item={item} />;
          }}
        />
        <input
          type="text"
          className="new-prop"
          onChange={(e: any) => {
            meta.newProp = e.target.value;
          }}
          value={meta.newProp}
          placeholder="+ new prop"
        />
      </div>
      <style>
        {`
        .cactiva-props-editor {
          background: ${bgColor};
          display: flex;
          flex-direction: column;
        }
        .cactiva-props-editor.sidebar {
          position: absolute;
          top: 0;
          left: 0;
          right: 1px;
          bottom: 0;
          z-index: 9;
        }

        .cactiva-props-editor.popup {
          min-width: 300px;
          min-height: 80px;
        }

        .cactiva-props-editor.popup > .title {
          border-bottom: 1px solid #ccc;
          background: #ececeb;
        }

        .cactiva-props-editor .highlight:active {
          background: rgba(255, 255, 0, 0.3);
        }
        .cactiva-props-editor div {
          display: flex;
          flex-direction: column;
          color: ${fontColor};
        }

        .cactiva-props-editor .pad {
          padding: 5px;
        }

        .cactiva-props-editor .full {
          flex: 1;
        }
        .cactiva-props-editor .row {
          align-items: stretch;
          flex-direction: row;
        }
        .cactiva-props-editor .center {
          align-items: center;
          justify-content: center;
        }
        .cactiva-props-editor .space-between {
          justify-content: space-between;
        }

        .cactiva-props-editor .margin-right {
          margin-right: 5px;
        }

        .cactiva-props-editor .pointer {
          cursor: pointer;
          opacity: 0.7;
        }

        .cactiva-props-editor .pointer:hover {
          opacity: 1;
        }

        .cactiva-props-editor .title {
          padding-left: 10px;
        }

        .cactiva-props-editor .ms-List-cell .prop {
          padding: 3px;
          border-bottom: 1px dotted ${fontColor};
          overflow: hidden;
        }

        .cactiva-props-editor
          .ms-List-cell:first-page
          .ms-List-cell:first-child
          .prop {
          border-top: 1px dotted ${fontColor};
        }

        .cactiva-props-editor .prop .title {
          flex-basis: 30%;
          min-width: 70px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          margin-right: 5px;
        }

        .cactiva-props-editor .prop .field,
        .cactiva-props-editor .prop .field .input {
          flex: 1;
          position: relative;
        }

        .cactiva-props-editor .prop .field .input {
          overflow: hidden;
        }

        .cactiva-props-editor .prop .field .input .overflow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          white-space: nowrap;
        }

        .cactiva-props-editor .prop .field .goto-source {
          flex-basis: 20px;
          display: none;
        }

        .cactiva-props-editor .prop:hover .field .goto-source {
          display: flex;
        }
        .cactiva-props-editor .prop:hover .field .goto-source:focus {
          opacity: 0.5;
        }
        .cactiva-props-editor.popup .goto-source {
          display: none !important;
        }
        .cactiva-props-editor .new-prop {
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
