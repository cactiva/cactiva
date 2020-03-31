import { generateChildNodes } from './generateChildNodes';
import { generateNodeInfo } from './generateNodeInfo';
export function generateNodes(source, path) {
	const rootNodes = generateChildNodes(source);
	const pathArray = (path === null || path === void 0 ? void 0 : path.split('.')) || [];
	return rootNodes.map((e, idx) => {
		const nodeInfo = generateNodeInfo(e);
		const nodePath = [...pathArray, idx].join('.');
		if (e) {
			e.cactivaPath = nodePath;
		}
		return Object.assign(Object.assign({}, nodeInfo), { path: nodePath, children: generateNodes(e, nodePath) });
	});
}
