const sendBtn = document.getElementById('sendBtn');
const msgStatus = document.getElementById('msgStatus');
const serverStatusBar = document.getElementById('serverStatusBar');

// Keep the server status bar updated
window.electronAPI.onServerInfo((address) => {
  serverStatusBar.innerText = `Shareable Local URL: ${address}`;
});

sendBtn.addEventListener('click', () => {
  window.electronAPI.sendToClients('hello universe');
  msgStatus.innerText = 'Message sent to all clients!';
  setTimeout(() => {
    msgStatus.innerText = '';
  }, 3000);
});
