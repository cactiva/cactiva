import debounce from "lodash.debounce";
import React from "react";
import { observer } from "mobx-react-lite";
import { getOS } from "../../libs/utils";
import { cactiva } from "../../models/store";
import EditorNode from "../../models/EditorNode";

export const onPaste = debounce(
  async (from: EditorNode, to: EditorNode, mode: string, pos: string) => {
    if (cactiva.propsEditor.mode === "popup") {
      cactiva.propsEditor.hidden = true;
    }

    const editor = to.source.canvas.editor;
    if (editor) {
      if (mode === "copy") {
        await to.copiedToChild(from);
      } else {
        await to.prependChild(from);
      }
      await to.source.canvas.selectNode(to.path + ".0", "canvas");
    }
  }
);

export default observer(({ popover, node }: any) => {
  let shortcutCmnd = getOS() == "Mac OS" ? "⌘" : "Ctrl";

  const handleCopy = (e: any) => {
    cactiva.copiedCode.node = node;
    popover.hide();
    e.stopPropagation();
  };

  const handlePaste = (e: any) => {
    onPaste(cactiva.copiedCode.node, node, cactiva.copiedCode.node, "children");
    popover.hide();
    e.stopPropagation();
  };

  return (
    <div className="contextMenu">
      <div className="item" onClick={handleCopy}>
        <div className="label">Copy</div>
        <div className="shortcut">{shortcutCmnd}+C</div>
      </div>
      <div className="item" onClick={handlePaste}>
        <div className="label">Paste</div>
        <div className="shortcut">{shortcutCmnd}+V</div>
      </div>
      <div className="item">
        <div className="label">Delete</div>
        <div className="shortcut">{shortcutCmnd}+D</div>
      </div>
    </div>
  );
});
