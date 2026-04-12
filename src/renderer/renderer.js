const pingBtn = document.getElementById('pingBtn');
const responseEl = document.getElementById('response');
const dropZone = document.getElementById('dropZone');
const fileListEl = document.getElementById('fileList');

pingBtn.addEventListener('click', () => {
  window.electronAPI.ping();
});

window.electronAPI.onPong((message) => {
  responseEl.innerText = message;
});

window.electronAPI.onRescan(() => {
  responseEl.innerText = 'Rescanning... Please wait.';
  setTimeout(() => {
    responseEl.innerText = 'Rescan complete.';
  }, 2000);
});

// Drag and Drop Logic
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('hover');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('hover');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('hover');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const folderPath = window.electronAPI.getPathForFile(files[0]);
    responseEl.innerText = `Reading folder: ${folderPath}`;
    
    const result = await window.electronAPI.readDirectory(folderPath);
    
    if (result.success) {
      fileListEl.innerHTML = ''; // Clear previous list
      result.files.forEach(file => {
        const li = document.createElement('li');
        li.innerText = file;
        fileListEl.appendChild(li);
      });
    } else {
      responseEl.innerText = `Error: ${result.error}`;
    }
  }
});
