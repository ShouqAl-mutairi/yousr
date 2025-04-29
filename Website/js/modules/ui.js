// UI Module - Handles UI components like notifications, navigation, etc.

// Function to show notifications
function showNotification(type, title, message, duration = 10000) {
    // Create container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    const notificationContainer = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const notificationContent = `
        <div class="notification-header">
            <span class="notification-title">${title}</span>
            <button class="notification-close" style="color: #777 !important; background: none !important; border: none; font-size: 14px; padding: 3px; margin-left: 8px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">&times;</button>
        </div>
        <div class="notification-body">
            <p>${message}</p>
        </div>
    `;

    notification.innerHTML = notificationContent;
    notificationContainer.appendChild(notification);

    // Add visible class after a small delay for animation
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('visible');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto close after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('visible');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

// Setup mobile navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (authButtons) {
                authButtons.classList.toggle('active');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link, .btn').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (authButtons) {
                    authButtons.classList.remove('active');
                }
            });
        });
    }
}

export {
    showNotification,
    setupNavigation
};