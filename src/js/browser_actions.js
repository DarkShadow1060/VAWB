import { activeListening } from './store';

// this page sets the icon of extesion 
export function initBrowserAction() {
  activeListening.subscribe(enabled => {
      chrome.browserAction.setIcon({
        path: "../img/icon_16.png"
      });
    }); 
  }
