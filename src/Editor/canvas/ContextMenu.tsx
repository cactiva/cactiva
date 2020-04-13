import React from "react";
import { observer } from "mobx-react-lite";
import { getOS } from "../../libs/utils";

export default observer(() => {
  let shortcutCmnd = getOS() == "Mac OS" ? "⌘" : "Ctrl";
  return (
    <div className="contextMenu">
      <div className="item">
        <div className="label">Copy</div>
        <div className="shortcut">{shortcutCmnd}+C</div>
      </div>
      <div className="item">
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
