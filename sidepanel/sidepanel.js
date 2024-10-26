document.addEventListener('DOMContentLoaded', function () {
  const writeNote = document.querySelector('#writeNote');
  const saveBtn = document.querySelector('#saveNote');
  const addBtn = document.querySelector('#addNote');
  const clearBtn = document.querySelector('#clearNote');

  // ! LOCAL STORAGE - will need this to GET saved notes from current URL
  // ! will need to use it to save (SET) note
  // ! reference: https://blog.logrocket.com/localstorage-javascript-complete-guide/
  // ! https://www.youtube.com/watch?v=5o8krh_Qduk

  ///////////////////////////////////////////////////////////////////////////////////////////

  // * GET Notes from current URL
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    console.log(tabs);
    const url = tabs[0].url;

    chrome.storage.sync.get([url], function (result) {
      if (result[url]) writeNote.value = result[url]; // return note if exists
    });

    ///////////////////////////////////////////////////////////////////////////////////////////

    // * SET Notes to URL
    // add event listen to button to save note
    saveBtn.addEventListener('click', function () {
      const note = writeNote.value;
      chrome.storage.sync.set({ [url]: note }, function () {
        console.log('Test Note saved func:', url);
      });
    });

    ///////////////////////////////////////////////////////////////////////////////////////////

    // * REMOVE Notes from URL
    // add event listener to button to clear note
    clearBtn.addEventListener('click', function () {
      writeNote.value = ''; // Clear the content in the editable div
      chrome.storage.sync.remove([url], function () {
        console.log('TEST Note deleted for:', url);
      });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////
  });
});

// async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }

// async function getCurrentTabUrl() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab ? tab.url : undefined;
// }

// getCurrentTabUrl().then((tab) => {
//   console.log(tab);
// });
