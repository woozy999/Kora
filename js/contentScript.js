// This project is licensed under the MIT License. See the LICENSE file for details.

// Initialize variables for color settings and max message length
let outgoingBackgroundColor, incomingBackgroundColor, outgoingTextColor, incomingTextColor, maxMsgLength;

// Step 1: Load settings from Chrome storage
chrome.storage.sync.get([
    'outgoingBackgroundColor', 
    'incomingBackgroundColor', 
    'outgoingTextColor', 
    'incomingTextColor',
    'maxMsgLength' // Load max message length
], (data) => {
    outgoingBackgroundColor = data.outgoingBackgroundColor || '#1e87f0'; // Default blue
    incomingBackgroundColor = data.incomingBackgroundColor || '#f2f2f3'; // Default gray
    outgoingTextColor = data.outgoingTextColor || '#ffffff'; // Default white
    incomingTextColor = data.incomingTextColor || '#666767'; // Default gray
    maxMsgLength = data.maxMsgLength || 500; // Default max length

    applyMessageColors(); // Apply loaded colors to messages
    applyDynamicSettings(); // Continuously check and apply settings dynamically
});

function applyMessageColors() {
    document.querySelectorAll('.chat-message.outgoing').forEach(message => {
        message.style.backgroundColor = outgoingBackgroundColor;
        message.style.color = outgoingTextColor;
    });

    document.querySelectorAll('.chat-message.incoming').forEach(message => {
        message.style.backgroundColor = incomingBackgroundColor;
        message.style.color = incomingTextColor;
    });
}

function modifyTextarea(maxLength) {
    const textarea = document.getElementById('newMessage');
    if (textarea) {
        textarea.setAttribute('maxlength', maxLength);
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }
}

// Check every 500ms for URL changes or the element to be available
let previousUrl = '';
const interval = setInterval(() => {
    if (window.location.href !== previousUrl) {
        previousUrl = window.location.href;
    }

    const logoImg = document.querySelector('.uk-navbar-item.uk-logo img');
    if (logoImg) {
        clearInterval(interval);
    }
}, 500);

function applyDynamicSettings() {
    setInterval(() => {
        let textarea = document.getElementById('newMessage');
        if (textarea) {
            modifyTextarea(maxMsgLength);
        }
    }, 500); // Check every 500ms

    let currentUrl = location.href;
    setInterval(() => {
        if (currentUrl !== location.href) {
            currentUrl = location.href;
            modifyTextarea(maxMsgLength);
        }
    }, 500); // Check every 500ms for URL changes
}

const observer = new MutationObserver(() => {
    applyMessageColors(); // Apply colors to new messages dynamically
});

observer.observe(document.body, { childList: true, subtree: true });