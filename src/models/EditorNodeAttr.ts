import { observable } from 'mobx';
import EditorNode, { IEditorNodePos } from './EditorNode';
import { Range } from './vscode/range';

export default class EditorNodeAttr {
	@observable valueLabel: string;
	@observable name: string;
	@observable path: string;
	@observable start: IEditorNodePos = {
		line: 0,
		column: 0
	};
	@observable end: IEditorNodePos = {
		line: 0,
		column: 0
	};
	@observable node: EditorNode;
	@observable value: any;

	constructor(props: {
		node: EditorNode;
		path: string;
		valueLabel: string;
		name: string;
		start: IEditorNodePos;
		end: IEditorNodePos;
		value: any;
	}) {
		this.name = props.name;
		this.valueLabel = props.valueLabel;
		this.path = props.path;
		this.name = props.name;
		this.start = props.start;
		this.end = props.end;
		this.node = props.node;
		this.value = props.value;
	}

	selectInCode() {
		const editor = this.node.source.canvas.editor;
		if (editor) {
			const s = this.start;
			const e = this.end;
			editor.setSelection(new Range(s.line, s.column, e.line, e.column));
			editor.revealLineNearTop(s.line);
			editor.focus();
		}
	}
}
