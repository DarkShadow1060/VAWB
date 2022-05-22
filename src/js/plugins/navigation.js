import { executeScripts } from '../core';



//stack over flow 
// XPATH -> XML PATH to navigate through HTML 
// not working currently
// kept for testing purpose


const selectResultScript = `
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function selectResult(index) {
  const anchor = getElementByXpath(
    '((//*[not(ancestor::*[contains(@class,"related-question-pair")])][@class="r"]/a)'
    + '|(//a[@id="thumbnail"][not(ancestor::*[@hidden])]))'
    + '[' + (index + 1) + ']');
  if (anchor && anchor.href) {
    if (anchor.href.startsWith('https://www.google.com/')) {
      const url = new URL(anchor.href);
      window.location.href = url.href;
    } else {
      window.location.href = anchor.href;
    }
  }  
}
`;


//For the reference of the ACTIONS: go to src/js/langs/en.json


const commands = [
  {
    action: 'NAVIGATION_BACK',
    callback: () => {
      executeScripts("window.history.back();");
    }
  },

  {
    action: 'NAVIGATION_FORWARD',
    callback: () => {
      executeScripts("window.history.forward();");
    }
  },

  {
    action: 'NAVIGATION_RELOAD',
    callback: () => {
      chrome.tabs.reload({});
    }
  },
];

// Currently not working  
// since each search result gives 10 links 
// hence the loop is from 0 to 9
for (let i = 0; i < 10; i++) {
  commands.push({
    action: `NAVIGATION_SELECT_${i + 1}`,
    callback: () => {
      executeScripts(selectResultScript + `selectResult(${i});`);
    }
  });
}

export default commands;
