/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';

export class CactivaCodePane extends Pane implements IView {
	constructor(options: IPaneOptions) {
		super(options);
	}

	protected renderHeader(container: HTMLElement): void { }
	protected renderBody(container: HTMLElement): void { }
	protected layoutBody(height: number, width: number): void {
		const sidebar = document.getElementById('workbench.parts.sidebar');
		const activitybar = document.getElementById('workbench.parts.statusbar');
		let border = sidebar?.style.borderRight
			? `border-right: ${sidebar?.style.borderRight}`
			: `border-right: 1px solid ${activitybar?.style.backgroundColor}`;
		this.element.setAttribute('style', `width: 100%;height:100%;${border};box-sizing:border-box;`);
	}
}
