import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import EditorCanvas from "../models/EditorCanvas";
import EditorNode from "../models/EditorNode";
import { cactiva } from "../models/store";
import Breadcrumb from "./canvas/Breadcrumb";
import Tag from "./canvas/Tag";
import TagDragPreview from "./canvas/tag/TagDragPreview";
import PropsEditor from "./props/PropsEditor";
import "./styles/Breadcrumb.scss";
import "./styles/Editor.scss";
import "./styles/Tag.scss";
import "./styles/ComponentEditor.scss";
import ComponentEditor from "./component/ComponentEditor";

export const Editor = observer(
  ({ canvas }: { canvas: EditorCanvas | undefined }) => {
    const meta = useObservable({
      root: undefined as EditorNode | undefined,
    });

    useEffect(() => {
      let rootItem: EditorNode | undefined = undefined;
      if (canvas.breadcrumbs.length > 0) {
        rootItem = canvas.breadcrumbs[0];
      }
      meta.root = rootItem;
    }, [canvas.breadcrumbs, canvas.breadcrumbs.length, canvas.selectedNode]);

    const propsEditorEl = cactiva.propsEditor.el;
    const componentEditorEl = cactiva.componentEditor.el;
    const mode = cactiva.mode;

    const tagClicked = (node: EditorNode) => {
      if (canvas.source) {
        canvas.selectNode(node.path, "canvas");
      }
    };
    const breadcrumbClicked = (node: EditorNode) => {
      canvas.selectNode(node.path, "canvas");
    };

    if (canvas.id === "-1") {
      return <div>Canvas can't be loaded</div>;
    }
    return (
      <DndProvider backend={HTML5Backend}>
        {propsEditorEl && <PropsEditor domNode={propsEditorEl} />}
        {componentEditorEl && <ComponentEditor domNode={componentEditorEl} />}
        <TagDragPreview />
        <div className="cactiva-canvas">
          <div className={`cactiva-canvas-content ${mode}`}>
            {!meta.root ? (
              !canvas.isReady ? (
                <div className="full-center">Rendering Component</div>
              ) : (
                <div>No Component to Render</div>
              )
            ) : (
              <Tag
                canvas={canvas}
                isLast={true}
                node={meta.root}
                onClick={tagClicked}
              />
            )}
          </div>
          <Breadcrumb canvas={canvas} onClick={breadcrumbClicked} />
        </div>
      </DndProvider>
    );
  }
);
