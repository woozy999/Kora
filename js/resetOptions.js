// This project is licensed under the MIT License. See the LICENSE file for details.

document.addEventListener("DOMContentLoaded", () => {
    // Define elements
    const toggleSidebarButton = document.getElementById('toggleSidebarButton');
    const body = document.body;
    const resetButton = document.getElementById('resetButton');
    const resetMessage = document.getElementById('resetMessage');

    // Toggle Sidebar
    if (toggleSidebarButton) {
        toggleSidebarButton.addEventListener('click', () => {
            body.classList.toggle('sidebar-open');
        });
    } else {
        console.error('Sidebar toggle button not found.');
    }

    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && !toggleSidebarButton.contains(event.target)) {
            document.body.classList.remove('sidebar-open');
        }
    });

    // Reset Settings
    if (resetButton && resetMessage) {
        resetButton.addEventListener('click', () => {
            const userConfirmed = confirm("Are you sure you want to reset all settings to default?");

            if (userConfirmed) {
                const defaultColorPresets = {
                    combo1: { name: 'Combo 1 (Default)', outgoing: '#1e87f0', incoming: '#f2f2f3', outgoingText: '#ffffff', incomingText: '#666767' },
                    combo2: { name: 'Combo 2 (Red/Yellow)', outgoing: '#dc3545', incoming: '#ffc107', outgoingText: '#ffffff', incomingText: '#ffffff' },
                    combo3: { name: 'Combo 3 (Purple/Orange)', outgoing: '#6f42c1', incoming: '#fd7e14', outgoingText: '#ffffff', incomingText: '#ffffff' },
                    combo4: { name: 'Combo 4 (Gray/Black)', outgoing: '#6c757d', incoming: '#343a40', outgoingText: '#ffffff', incomingText: '#ffffff' },
                    combo5: { name: 'Combo 5 (Teal/Pink)', outgoing: '#20c997', incoming: '#e83e8c', outgoingText: '#ffffff', incomingText: '#ffffff' }
                };

                const defaultMessagePresets = {
                    preset1: { name: 'Preset 1', text: 'Edit template here...' },
                    preset2: { name: 'Preset 2', text: 'Edit template here...' },
                    preset3: { name: 'Preset 3', text: 'Edit template here...' },
                    preset4: { name: 'Preset 4', text: 'Edit template here...' },
                    preset5: { name: 'Preset 5', text: 'Edit template here...' }
                };

                // Reset color presets, message presets, and remove saved color settings
                chrome.storage.sync.set({ presets: defaultColorPresets, selectedPreset: 'combo1' }, () => {
                    chrome.storage.local.set({ presets: defaultMessagePresets }, () => {
                        chrome.storage.sync.remove([
                            'outgoingBackgroundColor',
                            'incomingBackgroundColor',
                            'outgoingTextColor',
                            'incomingTextColor',
                            'maxMsgLength'
                        ], () => {
                            console.log('Color and message presets have been reset to default settings and color settings removed.');

                            resetMessage.classList.add('visible'); // Show reset confirmation message

                            setTimeout(() => {
                                resetMessage.classList.remove('visible'); // Hide after 3 seconds
                            }, 3000);
                        });
                    });
                });
            }
        });
    } else {
        console.error('Reset button or message element not found.');
    }
});