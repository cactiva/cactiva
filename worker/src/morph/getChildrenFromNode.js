import { JsxSelfClosingElement, JsxExpression, JsxElement, JsxFragment, JsxText, JsxAttribute } from 'ts-morph';
import { walkNode } from './walkNode';
export function getChildrenFromNode(node) {
    const list = [];
    walkNode(node, (node, meta) => {
        if (node instanceof JsxSelfClosingElement ||
            node instanceof JsxExpression ||
            node instanceof JsxElement ||
            node instanceof JsxFragment ||
            node instanceof JsxText) {
            if (node instanceof JsxExpression && meta && meta.isAttribute) {
                return false;
            }
            list.push(node);
            return false;
        }
        if (node instanceof JsxAttribute) {
            return { isAttribute: true };
        }
        return {};
    });
    return list.filter(e => {
        return !!e && !e.wasForgotten() && !!e.getText && !!e.getText().trim();
    });
}
