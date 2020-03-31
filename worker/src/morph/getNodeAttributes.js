import { JsxExpression, JsxSelfClosingElement, JsxElement, ObjectLiteralExpression, PropertyAssignment, StringLiteral } from 'ts-morph';
import { generateNodeInfo } from './generateNodeInfo';
export function getNodeAttributes(node) {
	let attr = null;
	if (node instanceof JsxSelfClosingElement) {
		attr = node.getAttributes();
	}
	else if (node instanceof JsxElement) {
		attr = node.getOpeningElement().getAttributes();
	}
	if (attr) {
		return attr.map((e) => {
			return Object.assign(Object.assign({}, generateNodeInfo(e, false)), { name: e.getName(), value: getValue(e), valueLabel: getValueLabel(e) });
		});
	}
}
export function getValue(item) {
	const izer = item.getInitializer();
	if (izer instanceof JsxExpression) {
		const exp = izer.getExpression();
		if (exp instanceof ObjectLiteralExpression) {
			let obj = {};
			for (let prty of exp.getProperties()) {
				if (prty instanceof PropertyAssignment) {
					let key = prty.getName();
					obj[key] = parseValue(prty);
				}
			}
			return obj;
		}
	}
}
export function parseValue(item) {
	let izer = item.getInitializer();
	if (izer instanceof StringLiteral) {
		let v = izer.getText();
		return v.slice(1, v.length - 1);
	}
	return izer === null || izer === void 0 ? void 0 : izer.getText();
}
export function getValueLabel(item) {
	const izer = item.getInitializer();
	let result = '';
	let text = '';
	if (izer) {
		if (izer instanceof JsxExpression) {
			const exp = izer.getExpression();
			if (exp) {
				result = exp.getKindName();
				text = exp.getText();
			}
		}
		else {
			result = izer.getKindName();
			text = izer.getText();
		}
	}
	const niceName = {
		ObjectLiteralExpression: '{ object }',
		StringLiteral: text.substr(1, text.length - 2)
	};
	return niceName[result] || text;
}
