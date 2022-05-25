import { executeScripts, openTabWithUrl } from '../core';
import { activeListening } from '../store';

// FOR THE REFERENCE FOR action: GOT TO src/js/langs/en.json

const commands = [
  {
    action: 'EXTENSION_CLOSE',
    callback: () => {
      activeListening.set(false);
    }
  },
  {
    action: 'EXTENSION_HELP',
    callback: () => {
      openTabWithUrl("https://github.com/ayushmz29/vawb-chrome-extension/blob/master/git-help-page/vawb_commands.png");
    }
  },
  {
    action: 'EXTENSION_CANCEL',
    callback: () => {
      activeListening.set(false);
    }
  },
  {
    action: 'EXTENSION_SUBMIT',
    callback: () => {
      executeScripts(`
        const focusedElement = document.activeElement;
        if (focusedElement.form) {
          focusedElement.form.submit();
        } else {
          focusedElement.dispatchEvent(new KeyboardEvent("keydown", {
            view: window,
            
            // here keydown is an EVENT (like click), KeyCode 13 is for ENTER KEY 
            
            keyCode: 13, 
            bubbles: true,
            cancelable: true
          }));
        }
      `);
    }
  },


  //form filling through voice input

  {
    action: 'EXTENSION_WRITE',
    callback: query => {
      
      executeScripts(`
        const focusedElement = document.activeElement; // THIS SELECTS THE ACTIVE ELEMENT OF THE HTML
        
        // eg. INPUT TAG / TEXTAREA FIELD
        //Converting the TAG NAME to lower for easy comparison  
        
        const tagName = focusedElement.tagName.toLowerCase();
        
        // IF CONTENTS ARE EDITABLE we can change or append its value or else we can't (BOOLEAN)
        
        const contenteditable = focusedElement.getAttribute('contenteditable') != '';
        let value = '${query}';  
        if (tagName == 'input') {
          if (document.activeElement.value) {
            value = ' ' + value; 
          }
          document.activeElement.value += value;
        } 
        else if (tagName == 'textarea') { // THE LOGIC IS THE TEXTAREA
          
          // TAKES MULTIPLE SENTENCES,HENCE ADDS FULLSTOP AT ENDS.
          // STARTING CHARACTER OF SENTENCE IS UPPERCASE HENCE (SUBSTRING IS USED)
          
          value = value.charAt(0).toUpperCase() + value.substr(1);
          value += '. ';
          const startPos = focusedElement.selectionStart;
          const endPos = focusedElement.selectionEnd;

          // THE BELOW PART HANDELS THE INSERTION IN THE MIDDLE / ANY WHERE
          
          focusedElement.value = focusedElement.value.substring(0, startPos)
              + value
              + focusedElement.value.substring(endPos, focusedElement.value.length);
          focusedElement.selectionEnd = startPos + value.length;
        } 

        // THIS BELOW PART REPLACES THE SELLECTED PART OF THE TEXT WITH NEW ONE. 
        
        else if (contenteditable) {
          value = value.charAt(0).toUpperCase() + value.substr(1);
          value += '. ';
          const sel = window.getSelection();
          if (sel.getRangeAt && sel.rangeCount) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const newValueNode = document.createTextNode(value);
            range.insertNode(newValueNode);
            range.setStart(newValueNode, value.length);
            range.setEnd(newValueNode, value.length);
          }
        }
      `);
    }
  }
];

export default commands;
