import { JsxElement, JsxFragment, JsxSelfClosingElement, JsxText } from 'ts-morph';
import { getLeadingChar } from './getLeadingChar';
import { getValueLabel } from './getNodeAttributes';
export function generateNodeInfo(node, withAttribute = true) {
    const src = node.getSourceFile().getFullText();
    let text = '';
    let expression = '';
    let startPos = node.getPos();
    const tagInfo = {
        attributes: {}
    };
    if (node instanceof JsxElement) {
        startPos = node.getOpeningElement().getPos();
        text = node.getOpeningElement().getTagNameNode().compilerNode.getText();
        const attr = node.getOpeningElement().getAttributes();
        attr.map((e) => {
            tagInfo.attributes[e.getName()] = getValueLabel(e);
        });
    }
    else if (node instanceof JsxSelfClosingElement) {
        text = node.getTagNameNode().compilerNode.getText();
        const attr = node.getAttributes();
        attr.map((e) => {
            tagInfo.attributes[e.getName()] = getValueLabel(e);
        });
    }
    else if (node instanceof JsxFragment) {
        text = '</>';
    }
    else if (node instanceof JsxText) {
        text = node.getText();
    }
    else {
        expression = node.getText().substr(0, 200);
        text = '{⋯}';
    }
    return {
        text,
        expression,
        kind: node.getKindName(),
        tag: tagInfo,
        start: {
            line: node.getStartLineNumber(),
            column: getLeadingChar(src, startPos, true)
        },
        end: {
            line: node.getEndLineNumber(),
            column: getLeadingChar(src, node.getEnd())
        }
    };
}
