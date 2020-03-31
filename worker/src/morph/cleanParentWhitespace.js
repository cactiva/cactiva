export function createSourceFile(project, fileName, content) {
    return project.createSourceFile(fileName, content, {
        overwrite: true
    });
}
import { getNodeFromPath } from './getNodeFromPath';
import { JsxElement, JsxFragment, SyntaxList } from 'ts-morph';
export function cleanParentWhitespace(source, pos) {
    const fromParentPath = pos.split('.');
    fromParentPath.pop();
    const fromParent = getNodeFromPath(source, fromParentPath.join('.'));
    if (fromParent instanceof JsxElement || fromParent instanceof JsxFragment) {
        const children = fromParent
            .getChildren()
            .map(e => {
            if (e instanceof SyntaxList) {
                const c = e.getChildren();
                if (c) {
                    return c
                        .map(e => {
                        return e.getText().trim();
                    })
                        .filter(e => !!e)
                        .join('')
                        .trim();
                }
            }
            return e.getText().trim();
        })
            .filter(e => !!e);
        fromParent.replaceWithText(children.join(''));
    }
}
