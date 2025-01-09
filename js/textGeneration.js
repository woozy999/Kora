// This project is licensed under the MIT License. See the LICENSE file for details.

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resetApiKeyBtn = document.getElementById('resetApiKeyBtn');
    const promptInput = document.getElementById('promptInput');
    const responseOutput = document.getElementById('responseOutput');
    const toggleSidebarButton = document.getElementById('toggleSidebarButton');
    const sidebar = document.getElementById('sidebar');

    let koraGenerativeApiKey = '';

    // Sidebar Toggle Functionality
    toggleSidebarButton.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && !toggleSidebarButton.contains(event.target)) {
            document.body.classList.remove('sidebar-open');
        }
    });

    // Check if API key is already saved in local storage
    const storedApiKey = localStorage.getItem('koraGenerativeApiKey');
    if (storedApiKey) {
        koraGenerativeApiKey = storedApiKey;
    }

    // Show API Key Modal
    function showApiKeyModal() {
        const modalHtml = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal">
                    <h2>Enter Your OpenAI API Key</h2>
                    <p>Your API key will be stored in your browser's local storage for convenience.</p>
                    <input type="password" id="apiKeyInput" placeholder="Enter your OpenAI API key">
                    <button id="closeModal" class="close-button">Close Without Saving</button>
                    <button id="saveApiKey" class="save-button">Save API Key</button>
                    <p id="apiKeyFeedback" class="feedback-message"></p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    
        // Event listeners for both buttons
        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('saveApiKey').addEventListener('click', async function() {
            const apiKeyInput = document.getElementById('apiKeyInput').value;
            const feedbackMessage = document.getElementById('apiKeyFeedback');
    
            if (apiKeyInput) {
                const isValidKey = await validateApiKey(apiKeyInput);
    
                if (isValidKey) {
                    koraGenerativeApiKey = apiKeyInput;
                    localStorage.setItem('koraGenerativeApiKey', apiKeyInput);
                    feedbackMessage.textContent = 'API Key saved successfully!';
                    feedbackMessage.style.color = 'green';
                    setTimeout(closeModal, 1000);
                } else {
                    feedbackMessage.textContent = 'Invalid API key. Please try again.';
                    feedbackMessage.style.color = 'red';
                }
            }
        });
    }

    // Validate API Key Function
    async function validateApiKey(apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.ok; // Return true if the response is okay
        } catch (error) {
            console.error('Error validating API key:', error);
            return false;
        }
    }

    // Close the modal
    function closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.remove();
        }
    }

    resetApiKeyBtn.addEventListener('click', function() {
        localStorage.removeItem('koraGenerativeApiKey');
        koraGenerativeApiKey = '';
        showApiKeyModal();
    });

    generateBtn.addEventListener('click', async function() {
        const promptText = promptInput.value;
        if (!promptText) {
            responseOutput.value = 'Please enter a prompt first.';
            return;
        }

        if (!koraGenerativeApiKey) {
            showApiKeyModal();
            return;
        }

        generateBtn.disabled = true;
        responseOutput.value = 'Generating response...';

        try {
            const response = await generateResponse(promptText);
            responseOutput.value = response;
        } catch (error) {
            responseOutput.value = `Error: ${error.message}`;
        } finally {
            generateBtn.disabled = false;
        }
    });

    clearBtn.addEventListener('click', function() {
        promptInput.value = '';
        responseOutput.value = '';
    });

    async function generateResponse(prompt) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${koraGenerativeApiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 350
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    localStorage.removeItem('koraGenerativeApiKey');
                    showApiKeyModal();
                    return 'Invalid API key. Please enter a valid API key.';
                }
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('Error:', error);
            return `Error generating response: ${error.message}`;
        }
    }
});
