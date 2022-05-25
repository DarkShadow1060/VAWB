import { allPlugins } from "./plugins/index";
import { initCommander } from "./commander";
import { initContextMenus } from "./context_menu";
import { initBrowserAction } from "./browser_actions";
import { initTabMuteListener } from "./tab_muter";

// this page runs in background of extension

initCommander(allPlugins); // initilize all the plugins ie., media,page,navigation etc.
initBrowserAction(); 
initContextMenus(); // initialize COntext menues (extension menu after right click )
initTabMuteListener(); 

// as soon as the extension is installed option page will be opened
chrome.runtime.onInstalled.addListener(e => {
  if (chrome.runtime.OnInstalledReason.INSTALL === e.reason) {
    chrome.runtime.openOptionsPage();
  }
});
