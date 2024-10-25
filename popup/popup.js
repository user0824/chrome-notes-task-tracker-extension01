document.addEventListener('DOMContentLoaded', function () {
  const writeNote = document.querySelector('#writeNote');
  const saveBtn = document.querySelector('#saveNote');
  const addBtn = document.querySelector('#addNote');
  const clearBtn = document.querySelector('#clearNote');

  // ! LOCAL STORAGE - will need this to GET saved notes from current URL
  // ! will need to use it to save (SET) note
  // ! reference: https://blog.logrocket.com/localstorage-javascript-complete-guide/
  // ! https://www.youtube.com/watch?v=5o8krh_Qduk

  // add event listen to button to save note
  saveBtn.addEventListener('click', function () {
    const note = writeNote.value;
  });

  // add event listener to button to clear note
  clearBtn.addEventListener('click', function () {
    writeNote.value = '';
  });
});
