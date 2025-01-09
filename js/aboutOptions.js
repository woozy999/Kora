// This project is licensed under the MIT License. See the LICENSE file for details.

document.addEventListener("DOMContentLoaded", () => {
    const toggleSidebarButton = document.getElementById('toggleSidebarButton');
    const sidebar = document.getElementById('sidebar');
  
    // Toggle Sidebar
    if (toggleSidebarButton) {
        toggleSidebarButton.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-open');
        });
    } else {
        console.error('Sidebar toggle button not found.');
    }
});

document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !toggleSidebarButton.contains(event.target)) {
        document.body.classList.remove('sidebar-open');
    }
});