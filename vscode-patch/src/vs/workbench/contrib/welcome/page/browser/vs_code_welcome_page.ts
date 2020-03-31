/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { escape } from 'vs/base/common/strings';
import { localize } from 'vs/nls';
import { URI } from 'vs/base/common/uri';
const bgPath = URI.parse(require.toUrl('./background-cactiva.png'));
const iconPath = URI.parse(require.toUrl('../../Cactiva.png'));

export default () => `
<div class="welcomePageContainer">
	<img class="bg" src="${bgPath}" width="100%"/>
	<div class="welcomePage">
		<div class="title">
			<img class="logo" src="${iconPath}" width="100%"/>
			<h1 class="caption">cactiva</h1>
		</div>
		<div class="row">
			<div class="commands">
				<p class="subtitle sub1">
					Edit React App With Confidence
				</p>
				<div class="splash">
					<div class="section start">
						<h2 class="caption">${escape(localize('welcomePage.createProject', 'Create Project'))}</h2>
						<ul>
							<li><a href="#">
								Create React App
							</a></li>
							<li><a href="#">
								Next JS
							</a></li>
							<li><a href="#">
								React Native
							</a></li>
						</ul>
					</div>
				</div>
				<p class="showOnStartup">
					Licensed to <b>Khoirul Arif</b>
					<br />
					Valid until <b>April 4, 2024</b>
				</p>
				<p class="showOnStartup"><input type="checkbox" id="showOnStartup" class="checkbox"> <label class="caption" for="showOnStartup">${escape(
					localize('welcomePage.showOnStartup', 'Show welcome page on startup')
				)}</label></p>
			</div>
			<div class="splash">
				<div class="section start">
					<h2 class="caption">${escape(localize('welcomePage.start', 'Start'))}</h2>
					<ul>
						<li><a href="command:workbench.action.files.newUntitledFile">${escape(
							localize('welcomePage.newFile', 'New file')
						)}</a></li>
						<li class="mac-only"><a href="command:workbench.action.files.openFileFolder">${escape(
							localize('welcomePage.openFolder', 'Open folder...')
						)}</a></li>
						<li class="windows-only linux-only"><a href="command:workbench.action.files.openFolder">${escape(
							localize('welcomePage.openFolder', 'Open folder...')
						)}</a></li>
						<li><a href="command:workbench.action.addRootFolder">${escape(
							localize('welcomePage.addWorkspaceFolder', 'Add workspace folder...')
						)}</a></li>
					</ul>
				</div>
				<div class="section recent">
					<h2 class="caption">${escape(localize('welcomePage.recent', 'Recent'))}</h2>
					<ul class="list">
						<!-- Filled programmatically -->
						<li class="moreRecent"><a href="command:workbench.action.openRecent">${escape(
							localize('welcomePage.moreRecent', 'More...')
						)}</a><span class="path detail if_shortcut" data-command="workbench.action.openRecent">(<span class="shortcut" data-command="workbench.action.openRecent"></span>)</span></li>
					</ul>
					<p class="none detail">${escape(localize('welcomePage.noRecentFolders', 'No recent folders'))}</p>
				</div>
				<div class="section help">
					<h2 class="caption">${escape(localize('welcomePage.help', 'Help'))}</h2>
					<ul>
						<li><a href="https://cactiva.netlify.com/">${escape(
							localize('welcomePage.ourWebsite', 'Our Website')
						)}</a></li>
						<li><a href="https://cactiva.netlify.com/">${escape(
							localize('welcomePage.introductoryVideos', 'Introductory Videos')
						)}</a></li>
						<li><a href="https://cactiva.netlify.com/">${escape(
							localize('welcomePage.tipsAndTricks', 'Tips and Tricks')
						)}</a></li>
						<li><a href="https://cactiva.netlify.com/">${escape(
							localize('welcomePage.productDocumentation', 'Product Documentation')
						)}</a></li>
						<li><a href="https://cactiva.netlify.com/">${escape(
							localize('welcomePage.stackOverflow', 'Stack Overflow')
						)}</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
`;
