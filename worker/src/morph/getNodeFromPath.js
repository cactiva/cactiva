import { getChildrenFromNode } from './getChildrenFromNode';
export function getNodeFromPath(source, nodePath, whenEachFound) {
    if (!nodePath || !source) {
        return source || null;
    }
    const lastPath = [];
    let lastNode = source;
    let continueLoop = true;
    nodePath.split('.').forEach((e, idx) => {
        if (!continueLoop) {
            return;
        }
        lastPath.push(e);
        const num = parseInt(e);
        const path = lastPath.join('.');
        const children = getChildrenFromNode(lastNode);
        const child = children[num];
        if (child) {
            if (whenEachFound) {
                whenEachFound(child, path);
            }
            lastNode = child;
        }
        else {
            continueLoop = false;
        }
    });
    return lastNode;
}
