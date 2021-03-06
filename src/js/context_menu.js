import { storage } from "./common";
import { hotwordEnabled } from "./store";

// Context Menue is the Menue popup which opens
// when right clicked on extension

export function initContextMenus() {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    title: '"Hey" hotword detection',
    type: "checkbox",
    id: "hotword",
    contexts: ["browser_action"],
    onclick: info => {
      storage.set({ hotword: info.checked });
    }
  });

  hotwordEnabled.subscribe(result => {
    chrome.contextMenus.update("hotword", { checked: result });
  });
}
