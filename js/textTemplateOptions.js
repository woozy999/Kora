// This project is licensed under the MIT License. See the LICENSE file for details.

const presetDropdown = document.getElementById('presetDropdown');
const presetName = document.getElementById('presetName');
const presetText = document.getElementById('presetText');
const charCounter = document.getElementById('charCounter');
const addPresetButton = document.getElementById('addPresetButton');
const deletePresetButton = document.getElementById('deletePresetButton');
const savePresetButton = document.getElementById('savePresetButton');
const saveMessage = document.getElementById('saveMessage');
const toggleSidebarButton = document.getElementById('toggleSidebarButton');
const exportPresetsButton = document.getElementById('exportPresetsButton'); // Export button element
const body = document.body;

    // One-Time Popup for acknowledgement
    chrome.storage.local.get('nameChangeAcknowledged', (result) => {
      if (!result.nameChangeAcknowledged) {
          showNameChangePopup();
      }
  });

// Show one-time popup for name change
function showNameChangePopup() {
  const popupHtml = `
      <div class="modal-overlay" id="nameChangeOverlay">
          <div class="modal">
              <h1> Welcome to Kora!</h1>
              <h2>Disclaimer</h2>
              <p>This extension is an independent tool developed to assist users. It is <strong>not affiliated with, endorsed by, or associated with any third-party messaging applications.</strong></p>
              <p>This software is open-source and provided free of charge under the MIT License.</p>
              <h2>By clicking "Acknowledge," you agree that:</h2>
    <ul>
        <li>You understand this extension operates independently from any third-party services.</li>
        <li>You assume full responsibility for your use of the extension, including any impact on third-party service agreements.</li>
        <li>The developer takes no responsibility for any consequences resulting from the use of this extension.</li>
    </ul>

    <p>For more details, please review the About section and the complete source code repository.</p>
              <button id="acknowledgeNameChange" class="save-button">Acknowledge</button>
          </div>
      </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', popupHtml);
  
  document.getElementById('acknowledgeNameChange').addEventListener('click', function() {
      chrome.storage.local.set({ nameChangeAcknowledged: true });
      document.getElementById('nameChangeOverlay').remove();
  });
}

// Sidebar toggle functionality
toggleSidebarButton.addEventListener('click', () => {
  body.classList.toggle('sidebar-open');
});

document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !toggleSidebarButton.contains(event.target)) {
      document.body.classList.remove('sidebar-open');
  }
});

// Default preset data
let presets = {
  preset1: { name: 'Preset 1', text: 'Edit template here...' },
  preset2: { name: 'Preset 2', text: 'Edit template here...' },
  preset3: { name: 'Preset 3', text: 'Edit template here...' },
  preset4: { name: 'Preset 4', text: 'Edit template here...' },
  preset5: { name: 'Preset 5', text: 'Edit template here...' }
};
let currentPresetKey = 'preset1'; // Track the current preset

// Function to save presets to Chrome storage
function savePresetsToStorage() {
  chrome.storage.local.set({ presets: presets }, () => {
    console.log('Presets saved to storage.');
  });
}

// Function to load presets from Chrome storage
function loadPresetsFromStorage() {
  chrome.storage.local.get(['presets'], (result) => {
    if (result.presets) {
      presets = result.presets;
    }
    populateDropdown();
    loadPresets();
  });
}

// Function to populate dropdown with preset options
function populateDropdown() {
  presetDropdown.innerHTML = '';
  Object.keys(presets).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = presets[key].name;
    presetDropdown.appendChild(option);
  });
}

// Function to auto-expand or shrink the textarea
function autoExpandTextArea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Function to load selected preset data into the UI
function loadPresets() {
  const preset = presets[currentPresetKey];
  presetText.value = preset.text;
  presetName.value = preset.name;
  updateCharCounter();
  autoExpandTextArea(presetText); // Ensure auto-expand on load
}

// Update character counter as the user types
function updateCharCounter() {
  const charCount = presetText.value.length;
  charCounter.textContent = `${charCount} / 1000`; // Updated to 1000
}

// Save the preset only when "Save Preset" is clicked
savePresetButton.addEventListener('click', () => {
  presets[currentPresetKey].name = presetName.value;
  presets[currentPresetKey].text = presetText.value;
  savePresetsToStorage();
  populateDropdown();
  presetDropdown.value = currentPresetKey;

  // Show the "Preset saved!" message for 3 seconds
  saveMessage.classList.remove('hidden');
  saveMessage.style.display = 'block';
  if (saveMessage.timeout) clearTimeout(saveMessage.timeout);
  saveMessage.timeout = setTimeout(() => {
    saveMessage.style.display = 'none';
  }, 3000);
});

// Add a new preset with a unique key
addPresetButton.addEventListener('click', () => {
  let newPresetKey;
  let presetIndex = 1;

  do {
    newPresetKey = `preset${presetIndex}`;
    presetIndex++;
  } while (presets.hasOwnProperty(newPresetKey));

  presets[newPresetKey] = { name: `Preset ${presetIndex - 1}`, text: 'Edit template here...' };
  currentPresetKey = newPresetKey;

  // Update the dropdown and UI
  populateDropdown();
  presetDropdown.value = newPresetKey;
  loadPresets();
  savePresetsToStorage();
});

// Delete the selected preset with confirmation
deletePresetButton.addEventListener('click', () => {
  const confirmDelete = confirm(`Are you sure you want to delete "${presets[currentPresetKey].name}"?`);
  
  if (confirmDelete) {
    delete presets[currentPresetKey];
    currentPresetKey = Object.keys(presets)[0] || '';
    populateDropdown();
    presetDropdown.value = currentPresetKey;
    loadPresets();
    savePresetsToStorage();
  }
});

// Track preset changes without saving until "Save Preset" is clicked
presetDropdown.addEventListener('change', () => {
  currentPresetKey = presetDropdown.value;
  loadPresets();
});

// Automatically adjust the textarea height as the user types
presetText.addEventListener('input', () => {
  if (presetText.value.length > 1000) { // Updated to 1000
    presetText.value = presetText.value.slice(0, 1000); // Enforce 1000 character limit
  }
  autoExpandTextArea(presetText);
  updateCharCounter();
});

// Function to export presets to a .txt file
function exportPresetsToTxt() {
    chrome.storage.local.get(['presets'], (result) => {
        const presets = result.presets;
        if (!presets) {
            alert("No presets found to export.");
            return;
        }

        // Format presets as text
        let presetText = "Saved Presets:\n\n";
        for (const [key, preset] of Object.entries(presets)) {
            presetText += `Preset Name: ${preset.name}\n`;
            presetText += `Preset Text: ${preset.text}\n`;
            presetText += "\n--------------------\n\n";
        }

        // Create a blob and download the file
        const blob = new Blob([presetText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        
        // Create a link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'presets.txt';
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}

// Attach the export function to the export button
exportPresetsButton.addEventListener('click', exportPresetsToTxt);

// Initial load: Retrieve presets from storage or use defaults
window.addEventListener('load', () => {
  loadPresetsFromStorage();
});
