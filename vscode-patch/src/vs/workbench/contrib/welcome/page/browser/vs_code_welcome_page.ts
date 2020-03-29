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
				<p class="subtitle sub2">
					Cactiva is a <b>React Editor</b><br />
					built on the top of VSCode
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
						<li class="keybindingsReferenceLink"><a href="command:workbench.action.keybindingsReference">${escape(
							localize('welcomePage.keybindingsCheatsheet', 'Printable keyboard cheatsheet')
						)}</a></li>
						<li><a href="command:workbench.action.openIntroductoryVideosUrl">${escape(
							localize('welcomePage.introductoryVideos', 'Introductory videos')
						)}</a></li>
						<li><a href="command:workbench.action.openTipsAndTricksUrl">${escape(
							localize('welcomePage.tipsAndTricks', 'Tips and Tricks')
						)}</a></li>
						<li><a href="command:workbench.action.openDocumentationUrl">${escape(
							localize('welcomePage.productDocumentation', 'Product documentation')
						)}</a></li>
						<li><a href="https://github.com/Microsoft/vscode">${escape(
							localize('welcomePage.gitHubRepository', 'GitHub repository')
						)}</a></li>
						<li><a href="http://stackoverflow.com/questions/tagged/vscode?sort=votes&pageSize=50">${escape(
							localize('welcomePage.stackOverflow', 'Stack Overflow')
						)}</a></li>
						<li><a href="command:workbench.action.openNewsletterSignupUrl">${escape(
							localize('welcomePage.newsletterSignup', 'Join our Newsletter')
						)}</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
`;
