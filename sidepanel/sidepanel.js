document.addEventListener('DOMContentLoaded', function () {
  const writeNote = document.querySelector('#writeNote');
  const saveBtn = document.querySelector('#saveNote');
  const clearBtn = document.querySelector('#clearNote');
  const defaultPlaceholder = 'creativity starts here...';
  let currentUrl = ''; // Initialize current URL field as blank

  //////////////////////////////////////////////////////////////////////////////////////

  // * Function to dynamically update the note based on the current tab
  function dynamicNotes() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;

      //////////////////////////////////////////////////////////////////////////////////////

      // * when opening a new tab or chrome url
      if (!url || url.startsWith('chrome://')) {
        writeNote.placeholder = 'Cannot save notes on this page';
        writeNote.value = ''; // Clear previous content
        currentUrl = '';
        return;
      }

      //////////////////////////////////////////////////////////////////////////////////////

      currentUrl = url; // get current url
      writeNote.placeholder = defaultPlaceholder; // default placeholder text

      //////////////////////////////////////////////////////////////////////////////////////
      // * Fetch existing note for this URL
      // * STORAGE SYNC - GET
      chrome.storage.sync.get([url], function (result) {
        if (result[url]) {
          writeNote.value = result[url]; // Return note if it exists
        } else {
          writeNote.value = ''; // Otherwise display blank note
        }
      });
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////

  // * Load the note when the extension is opened
  dynamicNotes();

  //////////////////////////////////////////////////////////////////////////////////////

  // * SAVE BUTTON - EVENT LISTENER (add note to current url)
  // * STORAGE SYNC - SET
  saveBtn.addEventListener('click', function () {
    const note = writeNote.value;
    if (currentUrl) {
      chrome.storage.sync.set({ [currentUrl]: note }, function () {
        console.log('Note saved for URL:', currentUrl);
      });
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////

  // * CLEAR BUTTON - EVENT LISTENER (remove note from URL)
  clearBtn.addEventListener('click', function () {
    writeNote.value = ''; // Clear the textarea content
    if (currentUrl) {
      chrome.storage.sync.remove([currentUrl], function () {
        console.log('Note cleared for URL:', currentUrl);
      });
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////

  // * onUPDATED - Listen for page refreshes
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated
  // https://www.youtube.com/watch?v=olLXAFJiL6Q
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      dynamicNotes(); // Update note when the page is loaded
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////

  // * onACTIVATED - Listen for tab changes
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onActivated
  chrome.tabs.onActivated.addListener(() => {
    dynamicNotes(); // Update note when switching tabs
  });

  //////////////////////////////////////////////////////////////////////////////////////

  // * onCOMMITTED - Listen for URL changes
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onCommitted
  chrome.webNavigation.onCommitted.addListener((details) => {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onCommitted#frameid
    if (details.frameId === 0) {
      dynamicNotes(); // Update note when a URL is manually entered
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////
