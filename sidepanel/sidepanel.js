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
      if (tabs.length === 0) return;
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
      // * Fetch and display the note specific to this URL
      chrome.storage.sync.get([url], function (result) {
        writeNote.value = result[url] || ''; // Show saved note or blank if none exists
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

  // Save notes when the side panel is closed
  window.addEventListener('beforeunload', function () {
    if (currentUrl) {
      const note = writeNote.value;
      chrome.storage.sync.set({ [currentUrl]: note }, function () {
        console.log(
          'Note saved before closing side panel for URL:',
          currentUrl
        );
      });
    }
  });

  // Save notes when switching tabs
  chrome.tabs.onActivated.addListener(function () {
    if (currentUrl) {
      const note = writeNote.value;
      chrome.storage.sync.set({ [currentUrl]: note }, function () {
        console.log('Note saved before switching tabs for URL:', currentUrl);
      });
    }
    dynamicNotes(); // Load the note for the newly activated tab
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // Reload the note whenever a tab is switched, URL is entered manually, or page refresh completes
  chrome.tabs.onActivated.addListener(dynamicNotes);
  chrome.webNavigation.onCommitted.addListener((details) => {
    if (details.frameId === 0) {
      dynamicNotes();
    }
  });
});
