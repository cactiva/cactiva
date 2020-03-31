export const walkNode = (root, f, prevMeta) => {
	if (!!root && root.forEachChild) {
		root.forEachChild(e => {
			const result = f(e, prevMeta);
			if (result) {
				if (e && e.forEachChild) {
					walkNode(e, f, result);
				}
			}
		});
	}
};
