// Main.js - Entry point that imports and initializes all modules

import { setupNavigation, showNotification } from './modules/ui.js';
import { checkAuthStatus, updateNavMenu, setupLoginForm, setupSignupForm } from './modules/auth.js';
import { validateField, validateDate, validateRadio, validateCheckbox, validateSignupForm } from './modules/validation.js';
import { updateProfilePage, enhanceProfilePage } from './modules/profile.js';
import { fetchAndDisplayFreelancers } from './modules/freelancers.js';
import { setupContactForm } from './modules/contact.js';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup navigation
    setupNavigation();
    
    // Check auth status and update UI accordingly
    updateNavMenu();
    
    // Setup login & signup forms if on those pages
    setupLoginForm();
    setupSignupForm();
    
    // Setup profile page functionality if on profile page
    updateProfilePage();
    enhanceProfilePage();
    
    // Fetch and display freelancers if on freelancers page
    fetchAndDisplayFreelancers();
    
    // Setup contact form if on contact page
    setupContactForm();
    
    // Log initialization
    console.log('Application initialized successfully');
});