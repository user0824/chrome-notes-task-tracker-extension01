// * Set up the side panel behavior on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// * Save notes when the extension or side panel is suspended (about to be closed)
chrome.runtime.onSuspend.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const url = tabs[0].url;

    if (url && !url.startsWith('chrome://')) {
      chrome.storage.sync.get([url], (result) => {
        const note = result[url] || '';
        chrome.storage.sync.set({ [url]: note }, () => {
          console.log('Note saved before extension unload for URL:', url);
        });
      });
    }
  });
});

// * Save notes when switching tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab) {
      const url = tab.url;
      if (url && !url.startsWith('chrome://')) {
        chrome.storage.sync.get([url], (result) => {
          const note = result[url] || '';
          chrome.storage.sync.set({ [url]: note }, () => {
            console.log('Note saved when switching tabs for URL:', url);
          });
        });
      }
    }
  });
});

// * Save notes when the tab updates or loads a new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const url = tab.url;
    if (url && !url.startsWith('chrome://')) {
      chrome.storage.sync.get([url], (result) => {
        const note = result[url] || '';
        chrome.storage.sync.set({ [url]: note }, () => {
          console.log('Note saved on tab update for URL:', url);
        });
      });
    }
  }
});
