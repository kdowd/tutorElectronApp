const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const msgStatus = document.getElementById('msgStatus');
const serverStatusBar = document.getElementById('serverStatusBar');

// Keep the server status bar updated
window.electronAPI.onServerInfo((address) => {
  serverStatusBar.innerText = `Shareable Local URL: ${address}`;
});

sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  
  if (message) {
    window.electronAPI.sendToClients(message);
    msgStatus.innerText = `Message "${message}" sent to all clients!`;
    messageInput.value = ''; // Clear input
    setTimeout(() => {
      msgStatus.innerText = '';
    }, 3000);
  } else {
    msgStatus.innerText = 'Please enter a message first.';
    setTimeout(() => {
      msgStatus.innerText = '';
    }, 2000);
  }
});
