/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { CactivaEditorWidget } from 'vs/editor/browser/widget/cactivaEditorWidget';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import { createTextBuffer } from 'vs/editor/common/model/textModel';

export class CactivaCanvasPane extends Pane implements IView {
	private _canvas: any;
	private _canvasRendered = false;
	public async updateModelData(modelData: ModelData, editor: CactivaEditorWidget, app: any) {
		const { cactiva, EditorCanvas, EditorSource, observable } = app;
		const id = modelData.model.id;
		if (!cactiva.canvas[id]) {
			cactiva.canvas[id] = new EditorCanvas(id, createTextBuffer);
		}

		if (!this._canvas) {
			this._canvas = observable({ id: '', root: undefined as any });
		}

		this._canvas.id = id;
		this._canvas.root = cactiva.canvas[id];
		const canvas = this._canvas.root;

		if (canvas.source.fileName === modelData.model.uri.fsPath) {
			canvas.source.load(modelData.model.getValue());
		} else {
			canvas.source.dispose();
			canvas.source = new EditorSource(modelData.model.uri.fsPath, canvas);
			canvas.source.load(modelData.model.getValue());
		}

		canvas.editor = editor;
		canvas.modelData = modelData;

		if (!this._canvasRendered) {
			this.renderCanvas(app);
			this._canvasRendered = true;
		}
	}

	public async renderCanvas({ ReactDOM, React, Canvas }: any) {
		ReactDOM.render(
			React.createElement(Canvas, {
				canvas: this._canvas
			}),
			this.element
		);
	}

	constructor(options: IPaneOptions) {
		super(options);

	}
	protected renderHeader(container: HTMLElement): void { }
	protected renderBody(container: HTMLElement): void { }
	protected layoutBody(height: number, width: number): void {
		this.element.setAttribute('style', 'width: 100%;height:100%;');
	}
}
