// This project is licensed under the MIT License. See the LICENSE file for details.

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    presetSelect: document.getElementById('presetSelect'),
    presetNameInput: document.getElementById('presetName'),
    outgoingColorInput: document.getElementById('outgoingColor'),
    incomingColorInput: document.getElementById('incomingColor'),
    outgoingTextColorInput: document.getElementById('outgoingTextColor'),
    incomingTextColorInput: document.getElementById('incomingTextColor'),
    saveButton: document.getElementById('saveButton'),
    messageDiv: document.getElementById('message')
  };

  const defaultPresets = {
    combo1: { name: 'Combo 1 (Blue/Green)', outgoing: '#007bff', incoming: '#28a745', outgoingText: '#ffffff', incomingText: '#ffffff' },
    combo2: { name: 'Combo 2 (Red/Yellow)', outgoing: '#dc3545', incoming: '#ffc107', outgoingText: '#ffffff', incomingText: '#ffffff' },
    combo3: { name: 'Combo 3 (Purple/Orange)', outgoing: '#6f42c1', incoming: '#fd7e14', outgoingText: '#ffffff', incomingText: '#ffffff' },
    combo4: { name: 'Combo 4 (Gray/Black)', outgoing: '#6c757d', incoming: '#343a40', outgoingText: '#ffffff', incomingText: '#ffffff' },
    combo5: { name: 'Combo 5 (Teal/Pink)', outgoing: '#20c997', incoming: '#e83e8c', outgoingText: '#ffffff', incomingText: '#ffffff' }
  };

  let presets = { ...defaultPresets };

  const toggleSidebarButton = document.getElementById('toggleSidebarButton');
  const body = document.body;
  toggleSidebarButton.addEventListener('click', () => {
    body.classList.toggle('sidebar-open');
  });

  function loadSettings() {
    chrome.storage.sync.get(['presets', 'selectedPreset'], (data) => {
      presets = data.presets || { ...defaultPresets };
      const selectedPreset = data.selectedPreset || 'combo1';

      elements.presetSelect.innerHTML = '';
      Object.keys(presets).forEach((key) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = presets[key].name;
        elements.presetSelect.appendChild(option);
      });

      elements.presetSelect.value = selectedPreset;
      updateUI(presets[selectedPreset]);
    });
  }

  function updateUI(preset) {
    elements.presetNameInput.value = preset.name;
    elements.outgoingColorInput.value = preset.outgoing;
    elements.incomingColorInput.value = preset.incoming;
    elements.outgoingTextColorInput.value = preset.outgoingText;
    elements.incomingTextColorInput.value = preset.incomingText;
    applyMessageColors();
  }

  elements.saveButton.addEventListener('click', () => {
    const selectedPresetKey = elements.presetSelect.value;
    const newPreset = {
      name: elements.presetNameInput.value,
      outgoing: elements.outgoingColorInput.value,
      incoming: elements.incomingColorInput.value,
      outgoingText: elements.outgoingTextColorInput.value,
      incomingText: elements.incomingTextColorInput.value
    };

    presets[selectedPresetKey] = newPreset;

    chrome.storage.sync.set({
      presets: presets,
      selectedPreset: selectedPresetKey,
      outgoingBackgroundColor: newPreset.outgoing,
      incomingBackgroundColor: newPreset.incoming,
      outgoingTextColor: newPreset.outgoingText,
      incomingTextColor: newPreset.incomingText
    }, () => {
      const option = elements.presetSelect.querySelector(`option[value="${selectedPresetKey}"]`);
      if (option) option.textContent = newPreset.name;
      elements.messageDiv.textContent = 'Settings saved! Please reload...';
      setTimeout(() => { elements.messageDiv.textContent = ''; }, 2000);
      applyMessageColors();
    });
  });

  elements.presetSelect.addEventListener('change', () => {
    const selectedPreset = elements.presetSelect.value;
    clearFields();
    updateUI(presets[selectedPreset]);
    chrome.storage.sync.set({ selectedPreset });
  });

  function clearFields() {
    elements.presetNameInput.value = '';
    elements.outgoingColorInput.value = '';
    elements.incomingColorInput.value = '';
    elements.outgoingTextColorInput.value = '';
    elements.incomingTextColorInput.value = '';
  }

  function applyMessageColors() {
    const outgoingColor = elements.outgoingColorInput.value;
    const outgoingTextColor = elements.outgoingTextColorInput.value;
    const incomingColor = elements.incomingColorInput.value;
    const incomingTextColor = elements.incomingTextColorInput.value;

    const outgoingMessages = document.querySelectorAll('.chat-message.outgoing');
    outgoingMessages.forEach(message => {
      message.style.backgroundColor = outgoingColor;
      message.style.color = outgoingTextColor;
    });

    const incomingMessages = document.querySelectorAll('.chat-message.incoming');
    incomingMessages.forEach(message => {
      message.style.backgroundColor = incomingColor;
      message.style.color = incomingTextColor;
    });
  }

  // Monitor URL changes and reapply modifications
  function monitorUrlAndReapply() {
    let currentUrl = location.href;
    setInterval(() => {
      if (currentUrl !== location.href) {
        currentUrl = location.href;
        console.log('URL changed, reapplying colors...');
        loadSettings();
      } else {
        applyMessageColors();
      }
    }, 500); // Check every 500ms
  }

  loadSettings();
  monitorUrlAndReapply(); // Start monitoring URL changes
});

document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !toggleSidebarButton.contains(event.target)) {
      document.body.classList.remove('sidebar-open');
  }
});
