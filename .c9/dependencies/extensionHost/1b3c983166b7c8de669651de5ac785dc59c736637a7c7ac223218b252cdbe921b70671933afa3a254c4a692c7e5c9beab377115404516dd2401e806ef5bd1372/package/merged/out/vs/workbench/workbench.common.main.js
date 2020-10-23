/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/platform/instantiation/common/extensions", "vs/platform/extensionManagement/common/extensionGalleryService", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/contextview/browser/contextViewService", "vs/platform/contextview/browser/contextView", "vs/platform/list/browser/listService", "vs/editor/common/services/editorWorkerService", "vs/editor/common/services/editorWorkerServiceImpl", "vs/editor/common/services/markerDecorationsServiceImpl", "vs/editor/common/services/markersDecorationService", "vs/platform/markers/common/markers", "vs/platform/markers/common/markerService", "vs/platform/contextkey/browser/contextKeyService", "vs/platform/contextkey/common/contextkey", "vs/editor/common/services/modelService", "vs/editor/common/services/modelServiceImpl", "vs/editor/common/services/resourceConfiguration", "vs/editor/common/services/resourceConfigurationImpl", "vs/platform/actions/common/actions", "vs/platform/actions/common/menuService", "vs/platform/download/common/download", "vs/platform/download/common/downloadService", "vs/editor/browser/services/openerService", "vs/platform/opener/common/opener", "vs/editor/editor.all", "vs/workbench/api/browser/extensionHost.contribution", "vs/workbench/browser/workbench.contribution", "vs/workbench/browser/actions/layoutActions", "vs/workbench/browser/actions/windowActions", "vs/workbench/browser/actions/developerActions", "vs/workbench/browser/actions/listCommands", "vs/workbench/browser/actions/navigationActions", "vs/workbench/browser/parts/quickopen/quickOpenActions", "vs/workbench/browser/parts/quickinput/quickInputActions", "vs/workbench/api/common/menusExtensionPoint", "vs/workbench/api/common/configurationExtensionPoint", "vs/workbench/api/browser/viewsExtensionPoint", "vs/workbench/browser/parts/quickinput/quickInput", "vs/workbench/browser/parts/quickopen/quickOpenController", "vs/workbench/browser/parts/titlebar/titlebarPart", "vs/workbench/browser/parts/editor/editorPart", "vs/workbench/browser/parts/activitybar/activitybarPart", "vs/workbench/browser/parts/panel/panelPart", "vs/workbench/browser/parts/sidebar/sidebarPart", "vs/workbench/browser/parts/statusbar/statusbarPart", "vs/workbench/browser/parts/views/views", "vs/workbench/services/extensions/common/inactiveExtensionUrlHandler", "vs/workbench/services/bulkEdit/browser/bulkEditService", "vs/workbench/services/keybinding/common/keybindingEditing", "vs/workbench/services/decorations/browser/decorationsService", "vs/workbench/services/progress/browser/progressService", "vs/workbench/services/editor/browser/codeEditorService", "vs/workbench/services/preferences/browser/preferencesService", "vs/workbench/services/configuration/common/jsonEditingService", "vs/workbench/services/textmodelResolver/common/textModelResolverService", "vs/workbench/services/dialogs/browser/fileDialogService", "vs/workbench/services/editor/browser/editorService", "vs/workbench/services/history/browser/history", "vs/workbench/services/activity/browser/activityService", "vs/workbench/services/keybinding/browser/keybindingService", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/textfile/common/textResourcePropertiesService", "vs/workbench/services/mode/common/workbenchModeService", "vs/workbench/services/commands/common/commandService", "vs/workbench/services/themes/browser/workbenchThemeService", "vs/workbench/services/label/common/labelService", "vs/workbench/services/extensionManagement/common/extensionEnablementService", "vs/workbench/services/notification/common/notificationService", "vs/workbench/services/extensions/common/staticExtensions", "vs/workbench/services/files/common/workspaceWatcher", "vs/workbench/contrib/telemetry/browser/telemetry.contribution", "vs/workbench/contrib/preferences/browser/preferences.contribution", "vs/workbench/contrib/preferences/browser/keybindingsEditorContribution", "vs/workbench/contrib/preferences/browser/preferencesSearch", "vs/workbench/contrib/logs/common/logs.contribution", "vs/workbench/contrib/quickopen/browser/quickopen.contribution", "vs/workbench/contrib/files/browser/explorerViewlet", "vs/workbench/contrib/files/browser/fileActions.contribution", "vs/workbench/contrib/files/browser/files.contribution", "vs/workbench/contrib/backup/common/backup.contribution", "vs/workbench/contrib/search/browser/search.contribution", "vs/workbench/contrib/search/browser/searchView", "vs/workbench/contrib/search/browser/openAnythingHandler", "vs/workbench/contrib/scm/browser/scm.contribution", "vs/workbench/contrib/scm/browser/scmViewlet", "vs/workbench/contrib/debug/browser/debug.contribution", "vs/workbench/contrib/debug/browser/debugQuickOpen", "vs/workbench/contrib/debug/browser/debugEditorContribution", "vs/workbench/contrib/debug/browser/repl", "vs/workbench/contrib/debug/browser/debugViewlet", "vs/workbench/contrib/markers/browser/markers.contribution", "vs/workbench/contrib/comments/browser/comments.contribution", "vs/workbench/contrib/url/common/url.contribution", "vs/workbench/contrib/webview/browser/webview.contribution", "vs/workbench/contrib/extensions/browser/extensions.contribution", "vs/workbench/contrib/extensions/browser/extensionsQuickOpen", "vs/workbench/contrib/extensions/browser/extensionsViewlet", "vs/workbench/contrib/output/browser/output.contribution", "vs/workbench/contrib/output/browser/outputPanel", "vs/workbench/contrib/terminal/browser/terminal.contribution", "vs/workbench/contrib/terminal/browser/terminalQuickOpen", "vs/workbench/contrib/terminal/browser/terminalPanel", "vs/workbench/contrib/relauncher/common/relauncher.contribution", "vs/workbench/contrib/tasks/browser/task.contribution", "vs/workbench/contrib/remote/common/remote.contribution", "vs/workbench/contrib/remote/browser/remote", "vs/workbench/contrib/emmet/browser/emmet.contribution", "vs/workbench/contrib/codeEditor/browser/codeEditor.contribution", "vs/workbench/contrib/externalTerminal/browser/externalTerminal.contribution", "vs/workbench/contrib/snippets/browser/snippets.contribution", "vs/workbench/contrib/snippets/browser/snippetsService", "vs/workbench/contrib/snippets/browser/insertSnippet", "vs/workbench/contrib/snippets/browser/configureSnippets", "vs/workbench/contrib/snippets/browser/tabCompletion", "vs/workbench/contrib/format/browser/format.contribution", "vs/workbench/contrib/themes/browser/themes.contribution", "vs/workbench/contrib/watermark/browser/watermark", "vs/workbench/contrib/welcome/walkThrough/browser/walkThrough.contribution", "vs/workbench/contrib/welcome/overlay/browser/welcomeOverlay", "vs/workbench/contrib/callHierarchy/browser/callHierarchy.contribution", "vs/workbench/contrib/outline/browser/outline.contribution", "vs/workbench/contrib/experiments/browser/experiments.contribution", "vs/workbench/contrib/feedback/browser/feedback.contribution"], function (require, exports, extensions_1, extensionGalleryService_1, extensionManagement_1, contextViewService_1, contextView_1, listService_1, editorWorkerService_1, editorWorkerServiceImpl_1, markerDecorationsServiceImpl_1, markersDecorationService_1, markers_1, markerService_1, contextKeyService_1, contextkey_1, modelService_1, modelServiceImpl_1, resourceConfiguration_1, resourceConfigurationImpl_1, actions_1, menuService_1, download_1, downloadService_1, openerService_1, opener_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    extensions_1.registerSingleton(extensionManagement_1.IExtensionGalleryService, extensionGalleryService_1.ExtensionGalleryService, true);
    extensions_1.registerSingleton(contextView_1.IContextViewService, contextViewService_1.ContextViewService, true);
    extensions_1.registerSingleton(listService_1.IListService, listService_1.ListService, true);
    extensions_1.registerSingleton(editorWorkerService_1.IEditorWorkerService, editorWorkerServiceImpl_1.EditorWorkerServiceImpl);
    extensions_1.registerSingleton(markersDecorationService_1.IMarkerDecorationsService, markerDecorationsServiceImpl_1.MarkerDecorationsService);
    extensions_1.registerSingleton(markers_1.IMarkerService, markerService_1.MarkerService, true);
    extensions_1.registerSingleton(contextkey_1.IContextKeyService, contextKeyService_1.ContextKeyService);
    extensions_1.registerSingleton(modelService_1.IModelService, modelServiceImpl_1.ModelServiceImpl, true);
    extensions_1.registerSingleton(resourceConfiguration_1.ITextResourceConfigurationService, resourceConfigurationImpl_1.TextResourceConfigurationService);
    extensions_1.registerSingleton(actions_1.IMenuService, menuService_1.MenuService, true);
    extensions_1.registerSingleton(download_1.IDownloadService, downloadService_1.DownloadService, true);
    extensions_1.registerSingleton(opener_1.IOpenerService, openerService_1.OpenerService, true);
});
//#endregion
//# sourceMappingURL=workbench.common.main.js.map