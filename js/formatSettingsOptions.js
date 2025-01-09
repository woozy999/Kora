// This project is licensed under the MIT License. See the LICENSE file for details.

document.addEventListener("DOMContentLoaded", () => {
  const maxLengthInput = document.getElementById('maxLength');
  const saveButton = document.getElementById('saveButton');
  const messageDiv = document.getElementById('message');

  const toggleSidebarButton = document.getElementById('toggleSidebarButton');
  const body = document.body;

  toggleSidebarButton.addEventListener('click', () => {
    body.classList.toggle('sidebar-open');
  });

  document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !toggleSidebarButton.contains(event.target)) {
        document.body.classList.remove('sidebar-open');
    }
  });

  let previousMaxLength = 500; // Default previous value

  // Load max message length from storage
  chrome.storage.sync.get(['maxMsgLength'], (data) => {
    const storedLength = data.maxMsgLength || 500;
    maxLengthInput.value = storedLength;
    previousMaxLength = storedLength;
  });

  // Save settings and show confirmation or error message
  saveButton.addEventListener('click', () => {
    const maxMsgLength = parseInt(maxLengthInput.value, 10);

    if (maxMsgLength > 600) {
      alert('The max extension is 600 characters. Anything higher can cause issues.');
      maxLengthInput.value = previousMaxLength;
      return;
    }

    chrome.storage.sync.set({ maxMsgLength }, () => {
      previousMaxLength = maxMsgLength;
      messageDiv.textContent = 'Settings saved! Please reload...';
      messageDiv.style.display = 'block';
      setTimeout(() => { messageDiv.style.display = 'none'; }, 3000);
    });
  });
});
