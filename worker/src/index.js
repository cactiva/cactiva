import { Project } from "ts-morph";
import { createSourceFile } from "./morph/createSourceFile";
import { generateChildNodes } from "./morph/generateChildNodes";
import { generateNodes } from "./morph/generateNodes";
import { getNodeAttributes } from "./morph/getNodeAttributes";
import { getNodeFromPath } from "./morph/getNodeFromPath";
import { moveNode } from "./morph/moveNode";
import { copyNode } from "./morph/copyNode";
const project = new Project();
const post = postMessage;
const reply = (id, type, message) => {
  post({
    id,
    type,
    message,
  });
};
const actions = {
  "source:load": async (data) => {
    const sourceFile = createSourceFile(project, data.fileName, data.content);
    return generateNodes(sourceFile);
  },
  "node:getAttributes": async (data) => {
    const source = project.getSourceFile(data.fileName);
    if (!source) {
      return [];
    }
    const node = getNodeFromPath(source, data.path);
    if (node) {
      return getNodeAttributes(node);
    }
    return [];
  },
  "node:move": async (data) => {
    const source = project.getSourceFile(data.fileName);
    if (!source) {
      return "";
    }
    return moveNode(source, data.from, data.to, data.position);
  },
  "node:copy": async (data) => {
    const source = project.getSourceFile(data.fileName);
    if (!source) {
      return "";
    }
    return copyNode(source, data.from, data.to, data.position);
  },
  "node:getCode": async (data) => {
    const source = project.getSourceFile(data.fileName);
    if (!source) {
      return "";
    }
    const node = getNodeFromPath(source, data.path);
    return node === null || node === void 0
      ? void 0
      : node.getChildren().map((e) => {
          return { kind: e.getKindName(), text: e.getText() };
        });
  },
  "node:setCode": async (data) => {
    const source = project.getSourceFile(data.fileName);
    if (!source) {
      return "";
    }
    const node = getNodeFromPath(source, data.path);
    if (node) {
      source.replaceText([node.getStart(), node.getEnd()], data.code);
    }
    return source.getText();
  },
  "node:getNodePathAtPos": async (data) => {
    const source = project.getSourceFile(data.fileName);
    if (!source) {
      return "";
    }
    const rawNode = source.getDescendantAtPos(data.pos);
    if (rawNode) {
      let cursor = rawNode;
      let rootIndex = -1;
      const rootNodes = generateChildNodes(source);
      while (cursor && !cursor.cactivaPath) {
        rootIndex = rootNodes.indexOf(cursor);
        if (rootIndex >= 0) {
          break;
        }
        const parent = cursor.getParent();
        cursor = parent;
      }
      if (cursor) {
        return cursor.cactivaPath;
      }
    }
    return "";
  },
};
self.addEventListener("message", async function (event) {
  const data = event.data;
  const type = data.type;
  const id = data.id;
  if (type && id) {
    const action = actions[type];
    if (typeof action === "function") {
      const result = await action(data.message);
      reply(id, type, result);
    } else {
      reply(id, type, `Action ${type}: NOT FOUND`);
    }
  }
});
