// Profile Module - Handles user profile functionality

import { showNotification } from './ui.js';
import { checkAuthStatus } from './auth.js';
import { validateProfileForm, validateProjectForm } from './validation.js';

// Update profile page if user is on profile page
function updateProfilePage() {
    const user = checkAuthStatus();
    
    if (window.location.pathname.includes('/profile')) {
        // Redirect to login if not authenticated
        if (!user) {
            window.location.href = '/login';
            return;
        }
        
        // Safe function to update element text content
        const updateElement = (id, value, defaultValue = '-') => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || defaultValue;
            } else {
                console.warn(`Element with ID ${id} not found in the DOM`);
            }
        };
        
        // Safe function to update element innerHTML
        const updateElementHTML = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = value;
            } else {
                console.warn(`Element with ID ${id} not found in the DOM`);
            }
        };
        
        // Safe function to update image src
        const updateImageSrc = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.src = value;
            } else {
                console.warn(`Image element with ID ${id} not found in the DOM`);
            }
        };
        
        // Update profile elements safely
        updateImageSrc('profile-avatar-img', user.avatar);
        updateElement('profile-first-name', user.first_name || '');
        updateElement('profile-last-name', user.last_name || '');
        updateElementHTML('profile-role', `نوع الحساب: <span>${user.user_role === 'freelancer' ? 'فريلانسر' : 'عميل'}</span>`);
        updateElementHTML('profile-email', `البريد الإلكتروني: <span>${user.email}</span>`);
        updateElementHTML('profile-phone', `رقم الهاتف: <span>${user.phone}</span>`);
        
        // Personal info tab - check IDs carefully
        updateElement('info-username', user.username); 
        updateElement('info-email', user.email);
        updateElement('info-phone', user.phone);
        
        // Safely format and display date of birth
        if (user.date_of_birth) {
            try {
                const date = new Date(user.date_of_birth);
                if (!isNaN(date.getTime())) {
                    updateElement('info-dob', date.toLocaleDateString('ar-SA'));
                } else {
                    updateElement('info-dob', '-');
                }
            } catch (error) {
                console.error('Error formatting date:', error);
                updateElement('info-dob', '-');
            }
        } else {
            updateElement('info-dob', '-');
        }
        
        updateElement('info-gender', user.gender === 'male' ? 'ذكر' : 'أنثى');
        
        // Freelancer specific information
        if (user.user_role === 'freelancer') {
            // Show the freelancer fields sections
            const freelancerInfoSection = document.querySelector('.freelancer-info');
            const freelancerFieldsSection = document.querySelector('.freelancer-fields');
            
            if (freelancerInfoSection) freelancerInfoSection.style.display = 'block';
            if (freelancerFieldsSection) freelancerFieldsSection.style.display = 'block';
            
            // Update specialty with localized name
            if (user.specialty) {
                const specialtyNames = {
                    'web-development': 'تطوير الويب',
                    'graphic-design': 'التصميم الجرافيكي',
                    'digital-marketing': 'التسويق الرقمي',
                    'content-writing': 'كتابة المحتوى',
                    'other': 'أخرى'
                };
                updateElement('info-specialty', specialtyNames[user.specialty] || user.specialty);
                
                // Update the specialty dropdown in edit mode
                const specialtyDropdown = document.getElementById('edit-specialty');
                if (specialtyDropdown) {
                    specialtyDropdown.value = user.specialty;
                }
            }
            
            // Update bio information
            updateElement('info-bio', user.profile_bio);
            
            // Update price range
            if (user.min_price && user.max_price) {
                updateElement('info-price-range', `${user.min_price} - ${user.max_price}`);
                
                // Update price inputs in edit mode
                const minPriceInput = document.getElementById('edit-min-price');
                const maxPriceInput = document.getElementById('edit-max-price');
                
                if (minPriceInput) minPriceInput.value = user.min_price;
                if (maxPriceInput) maxPriceInput.value = user.max_price;
            }
        } else {
            // Hide freelancer sections for clients
            const freelancerInfoSection = document.querySelector('.freelancer-info');
            const freelancerFieldsSection = document.querySelector('.freelancer-fields');
            
            if (freelancerInfoSection) freelancerInfoSection.style.display = 'none';
            if (freelancerFieldsSection) freelancerFieldsSection.style.display = 'none';
        }
        
        // Settings tab
        updateImageSrc('avatar-preview-img', user.avatar);
        
        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                button.classList.add('active');
                const tabContent = document.getElementById(`${tabName}-tab`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
        
        // Logout button in settings
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('userData');
                showNotification(
                    'info',
                    'تم تسجيل الخروج',
                    'تم تسجيل خروجك بنجاح'
                );
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            });
        }
    }
}

// Enhanced Profile Page Functionality
function enhanceProfilePage() {
    const user = checkAuthStatus();
    
    if (window.location.pathname.includes('/profile')) {
        // Redirect to login if not authenticated
        if (!user) {
            window.location.href = '/login';
            return;
        }
        
        // Fetch latest user data from server
        fetchUserData(user.id);
        
        // Fetch user projects
        fetchUserProjects(user.id);
        
        // Set up event listeners for profile interactions
        setupProfileInteractions(user.id);
    }
}

// Fetch user data from server
async function fetchUserData(userId) {
    try {
        console.log('Fetching user data for ID:', userId);
        const response = await fetch(`/api/user/${userId}`);
        const result = await response.json();
        
        console.log('Server response for user data:', result);
        
        if (result.success) {
            // Update localStorage with latest data
            const currentUser = JSON.parse(localStorage.getItem('userData'));
            const updatedUser = { ...currentUser, ...result.user };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            
            // Update UI with the latest data
            updateProfileUI(result.user);
        } else {
            console.error('Error in fetchUserData response:', result);
            showNotification('error', 'خطأ في جلب البيانات', result.message || 'حدث خطأ أثناء محاولة جلب بيانات المستخدم');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('error', 'خطأ في الاتصال', 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');
    }
}

// Update the profile UI with user data
function updateProfileUI(userData) {
    console.log('Updating profile UI with data:', userData);
    
    // Check if elements exist before trying to update them
    const updateElement = (id, value, defaultValue = '-') => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || defaultValue;
        } else {
            console.warn(`Element with ID ${id} not found in the DOM`);
        }
    };
    
    const updateElementInnerHTML = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = value;
        } else {
            console.warn(`Element with ID ${id} not found in the DOM`);
        }
    };
    
    const updateInputValue = (id, value, defaultValue = '') => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || defaultValue;
        } else {
            console.warn(`Input element with ID ${id} not found in the DOM`);
        }
    };
    
    // Profile header
    if (userData.avatar) {
        const avatarImg = document.getElementById('profile-avatar-img');
        const avatarPreviewImg = document.getElementById('avatar-preview-img');
        
        if (avatarImg) avatarImg.src = userData.avatar;
        if (avatarPreviewImg) avatarPreviewImg.src = userData.avatar;
    }
    
    // Update with first and last name if available, otherwise fallback to username
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    updateElement('profile-first-name', firstName);
    updateElement('profile-last-name', lastName);
    
    updateElementInnerHTML('profile-role', `نوع الحساب: <span>${userData.user_role === 'freelancer' ? 'فريلانسر' : 'عميل'}</span>`);
    updateElementInnerHTML('profile-email', `البريد الإلكتروني: <span>${userData.email}</span>`);
    updateElementInnerHTML('profile-phone', `رقم الهاتف: <span>${userData.phone}</span>`);

    // Info tab - view mode
    updateElement('info-username', userData.username);
    updateElement('info-first-name', userData.first_name);
    updateElement('info-last-name', userData.last_name);
    updateElement('info-email', userData.email);
    updateElement('info-phone', userData.phone);
    
    // Format date if it exists
    if (userData.date_of_birth) {
        try {
            const date = new Date(userData.date_of_birth);
            if (!isNaN(date.getTime())) {
                updateElement('info-dob', date.toLocaleDateString('ar-SA'));
            } else {
                console.warn('Invalid date format:', userData.date_of_birth);
                updateElement('info-dob', userData.date_of_birth, '-');
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            updateElement('info-dob', userData.date_of_birth, '-');
        }
    } else {
        updateElement('info-dob', null, '-');
    }
    
    updateElement('info-gender', userData.gender === 'male' ? 'ذكر' : 'أنثى');
    
    // Freelancer specific fields
    if (userData.user_role === 'freelancer') {
        // Show freelancer sections
        const freelancerInfoSection = document.querySelector('.freelancer-info');
        const freelancerFieldsSection = document.querySelector('.freelancer-fields');
        
        if (freelancerInfoSection) freelancerInfoSection.style.display = 'block';
        if (freelancerFieldsSection) freelancerFieldsSection.style.display = 'block';
        
        // Update specialty
        updateElement('info-specialty', userData.specialty || '-');
        updateInputValue('edit-specialty', userData.specialty || '');
        
        // Update bio
        updateElement('info-bio', userData.profile_bio || '-');
        updateInputValue('edit-bio', userData.profile_bio || '');
        
        // Update price range display and inputs
        const minPrice = userData.min_price || '';
        const maxPrice = userData.max_price || '';
        
        console.log('Price range data:', { minPrice, maxPrice });
        
        if (minPrice && maxPrice) {
            updateElement('info-price-range', `${minPrice} - ${maxPrice}`);
        } else {
            updateElement('info-price-range', '-');
        }
        
        // Always update the input fields, even if empty
        updateInputValue('edit-min-price', minPrice);
        updateInputValue('edit-max-price', maxPrice);
        
    } else {
        // Hide freelancer sections for clients
        const freelancerInfoSection = document.querySelector('.freelancer-info');
        const freelancerFieldsSection = document.querySelector('.freelancer-fields');
        
        if (freelancerInfoSection) freelancerInfoSection.style.display = 'none';
        if (freelancerFieldsSection) freelancerFieldsSection.style.display = 'none';
    }
    
    updateElement('info-availability', userData.is_available ? 'نعم' : 'لا');

    // Info tab - edit mode
    updateInputValue('edit-first-name', userData.first_name || '');
    updateInputValue('edit-last-name', userData.last_name || '');
    updateInputValue('edit-email', userData.email || '');
    updateInputValue('edit-phone', userData.phone || '');
    
    // Format date for input value
    if (userData.date_of_birth) {
        try {
            const date = new Date(userData.date_of_birth);
            if (!isNaN(date.getTime())) {
                const formattedDate = date.toISOString().split('T')[0];
                updateInputValue('edit-dob', formattedDate);
            }
        } catch (error) {
            console.error('Error formatting date for input:', error);
        }
    }
    
    // Set availability toggle
    const availabilityToggle = document.getElementById('availability-toggle');
    if (availabilityToggle) {
        availabilityToggle.checked = Boolean(userData.is_available);
    }
}

// Fetch user projects
async function fetchUserProjects(userId) {
    try {
        const response = await fetch(`/api/user/${userId}/projects`);
        const result = await response.json();
        
        if (result.success) {
            // Update UI with projects
            updateProjectsUI(result.projects);
        } else {
            showNotification('error', 'خطأ في جلب المشاريع', result.message || 'حدث خطأ أثناء محاولة جلب مشاريع المستخدم');
        }
    } catch (error) {
        console.error('Error fetching user projects:', error);
        showNotification('error', 'خطأ في الاتصال', 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');
    }
}

// Update the projects UI
function updateProjectsUI(projects) {
    const projectsList = document.getElementById('projects-list');
    const projectsEmpty = document.getElementById('projects-empty');
    const projectsTab = document.getElementById('projects-tab');
    
    if (!projectsList) return;
    
    // Clear current projects
    projectsList.innerHTML = '';
    
    if (projects && projects.length > 0) {
        if (projectsTab) {
            projectsTab.classList.add('has-projects');
        }
        
        // Create project cards
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    } else {
        if (projectsTab) {
            projectsTab.classList.remove('has-projects');
        }
    }
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;
    
    // Get category display name
    const categoryNames = {
        'web-development': 'تطوير الويب',
        'graphic-design': 'التصميم الجرافيكي',
        'digital-marketing': 'التسويق الرقمي',
        'content-writing': 'كتابة المحتوى',
        'other': 'أخرى'
    };
    
    const categoryDisplayName = categoryNames[project.category] || project.category;
    
    card.innerHTML = `
        <h4>${project.title}</h4>
        <div class="project-category">${categoryDisplayName}</div>
        <p class="project-description">${project.description}</p>
        <div class="project-actions">
            <button class="edit-project-btn" data-id="${project.id}"><i class="fas fa-edit"></i></button>
            <button class="delete-project-btn" data-id="${project.id}"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Add event listeners for project card actions
    card.querySelector('.edit-project-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = e.currentTarget.dataset.id;
        openProjectEditForm(projectId);
    });
    
    card.querySelector('.delete-project-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = e.currentTarget.dataset.id;
        confirmDeleteProject(projectId);
    });
    
    return card;
}

// Setup all profile page interactions
function setupProfileInteractions(userId) {
    // Info tab edit button
    const editInfoBtn = document.querySelector('.edit-info-btn');
    const infoViewMode = document.getElementById('info-view-mode');
    const infoEditMode = document.getElementById('info-edit-mode');
    const cancelEditBtn = document.querySelector('.cancel-edit-btn');
    const userInfoForm = document.getElementById('user-info-form');
    
    // Edit info button
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', () => {
            infoViewMode.style.display = 'none';
            infoEditMode.style.display = 'block';
        });
    }
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            infoViewMode.style.display = 'block';
            infoEditMode.style.display = 'none';
        });
    }
    
    // Save info changes
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate the form before submission
            const isValid = validateProfileForm();
            if (!isValid) {
                showNotification('error', 'خطأ في النموذج', 'يرجى التحقق من المعلومات المدخلة وتصحيح الأخطاء');
                return;
            }
            
            const formData = new FormData(userInfoForm);
            try {
                // Convert price values to numbers if they're not empty
                let minPrice = formData.get('min_price');
                let maxPrice = formData.get('max_price');
                
                // Log values for debugging
                console.log("Min price before conversion:", minPrice);
                console.log("Max price before conversion:", maxPrice);
                
                // Only convert to numbers if they're not empty
                if (minPrice) minPrice = Number(minPrice);
                if (maxPrice) maxPrice = Number(maxPrice);
                
                const userData = {
                    first_name: formData.get('first_name'),
                    last_name: formData.get('last_name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    date_of_birth: formData.get('date_of_birth'),
                    profile_bio: formData.get('profile_bio'),
                    is_available: formData.get('is_available') === 'on',
                    
                    // Freelancer specific fields
                    specialty: formData.get('specialty') || null,
                    min_price: minPrice || null,
                    max_price: maxPrice || null
                };
                
                // Log the data being sent to the server
                console.log("Sending profile update with data:", userData);
                
                const response = await fetch(`/api/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showNotification('success', 'تم التحديث بنجاح', 'تم تحديث المعلومات الشخصية بنجاح');
                    
                    // Update localStorage with new data
                    const currentUser = JSON.parse(localStorage.getItem('userData'));
                    const updatedUser = { ...currentUser, ...userData };
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    
                    // If user is a freelancer and has set availability to true, show special notification
                    if (currentUser.user_role === 'freelancer' && userData.is_available) {
                        showNotification('info', 'إشعار التوفر', 'تم تحديث حالة توفرك للعمل. سيظهر ملفك الشخصي الآن في صفحة الفريلانسرز المتاحين.');
                    }
                    
                    fetchUserData(userId); // Refresh user data
                    infoViewMode.style.display = 'block';
                    infoEditMode.style.display = 'none';
                } else {
                    showNotification('error', 'فشل التحديث', result.message || 'حدث خطأ أثناء تحديث المعلومات');
                }
            } catch (error) {
                console.error('Error updating user info:', error);
                showNotification('error', 'خطأ في الاتصال', 'حدث خطأ أثناء الاتصال بالخادم');
            }
        });
    }
    
    // Projects tab
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectFormContainer = document.getElementById('project-form-container');
    const addProjectForm = document.getElementById('add-project-form');
    const cancelProjectBtn = document.querySelector('.cancel-project-btn');
    
    // Show add project form
    if (addProjectBtn && projectFormContainer) {
        addProjectBtn.addEventListener('click', () => {
            // Reset the form
            addProjectForm.reset();
            // Show the form
            projectFormContainer.style.display = 'block';
            // Change button text and action if editing
            addProjectForm.dataset.mode = 'add';
            addProjectForm.querySelector('.save-project-btn').textContent = 'حفظ المشروع';
            
            // Hide price field if it exists (since we're using projects as portfolio only)
            const priceField = document.getElementById('project-price');
            if (priceField) {
                const priceContainer = priceField.closest('.form-group');
                if (priceContainer) {
                    priceContainer.style.display = 'none';
                }
            }
        });
    }
    
    // Cancel add/edit project
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', () => {
            projectFormContainer.style.display = 'none';
            addProjectForm.reset();
        });
    }
    
    // Add/edit project form submission
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate the project form before submission
            const isValid = validateProjectForm();
            if (!isValid) {
                showNotification('error', 'خطأ في النموذج', 'يرجى التحقق من المعلومات المدخلة وتصحيح الأخطاء');
                return;
            }
            
            const formData = new FormData(addProjectForm);
            const projectData = {
                user_id: userId,
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description')
                // Removed price field since we're using projects as portfolio only
            };
            
            const mode = addProjectForm.dataset.mode || 'add';
            const projectId = addProjectForm.dataset.projectId;
            
            try {
                let url = '/api/projects';
                let method = 'POST';
                
                if (mode === 'edit' && projectId) {
                    url = `/api/projects/${projectId}`;
                    method = 'PUT';
                }
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projectData),
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showNotification(
                        'success',
                        mode === 'add' ? 'تمت الإضافة بنجاح' : 'تم التحديث بنجاح',
                        mode === 'add' ? 'تم إضافة المشروع بنجاح' : 'تم تحديث المشروع بنجاح'
                    );
                    
                    // Hide form and reset
                    projectFormContainer.style.display = 'none';
                    addProjectForm.reset();
                    
                    // Refresh projects list
                    fetchUserProjects(userId);
                } else {
                    showNotification('error', 'فشل العملية', result.message || 'حدث خطأ أثناء معالجة المشروع');
                }
            } catch (error) {
                console.error('Error with project operation:', error);
                showNotification('error', 'خطأ في الاتصال', 'حدث خطأ أثناء الاتصال بالخادم');
            }
        });
    }
    
    // Delete account
    const deleteAccountBtn = document.querySelector('.delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                deleteUserAccount(userId);
            }
        });
    }
}

// Open project edit form with project data
function openProjectEditForm(projectId) {
    const projectsList = document.getElementById('projects-list');
    const projectCard = projectsList.querySelector(`[data-id="${projectId}"]`);
    
    if (!projectCard) return;
    
    const title = projectCard.querySelector('h4').textContent;
    const category = projectCard.querySelector('.project-category').textContent;
    const description = projectCard.querySelector('.project-description').textContent;
    
    // Get category value from display name
    const categoryMap = {
        'تطوير الويب': 'web-development',
        'التصميم الجرافيكي': 'graphic-design',
        'التسويق الرقمي': 'digital-marketing',
        'كتابة المحتوى': 'content-writing',
        'أخرى': 'other'
    };
    
    const categoryValue = categoryMap[category] || 'other';
    
    // Fill the form with project data
    const addProjectForm = document.getElementById('add-project-form');
    const projectFormContainer = document.getElementById('project-form-container');
    
    document.getElementById('project-title').value = title;
    document.getElementById('project-category').value = categoryValue;
    document.getElementById('project-description').value = description;
    
    // Hide price field or set default value if it exists
    const priceField = document.getElementById('project-price');
    if (priceField) {
        priceField.value = '';
        // If you want to hide the price field in the form:
        const priceContainer = priceField.closest('.form-group');
        if (priceContainer) {
            priceContainer.style.display = 'none';
        }
    }
    
    // Set form mode to edit
    addProjectForm.dataset.mode = 'edit';
    addProjectForm.dataset.projectId = projectId;
    
    // Change button text
    addProjectForm.querySelector('.save-project-btn').textContent = 'تحديث المشروع';
    
    // Show form
    projectFormContainer.style.display = 'block';
}

// Confirm and delete project
function confirmDeleteProject(projectId) {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        deleteProject(projectId);
    }
}

// Delete project API call
async function deleteProject(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('success', 'تم الحذف بنجاح', 'تم حذف المشروع بنجاح');
            
            // Get user ID from localStorage
            const user = JSON.parse(localStorage.getItem('userData'));
            
            // Refresh projects list
            if (user) {
                fetchUserProjects(user.id);
            }
        } else {
            showNotification('error', 'فشل الحذف', result.message || 'حدث خطأ أثناء حذف المشروع');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('error', 'خطأ في الاتصال', 'حدث خطأ أثناء الاتصال بالخادم');
    }
}

// Delete user account
async function deleteUserAccount(userId) {
    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('success', 'تم حذف الحساب', 'تم حذف الحساب بنجاح');
            
            // Clear user data and redirect to home
            localStorage.removeItem('userData');
            
            // Redirect after short delay to show notification
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            showNotification('error', 'فشل حذف الحساب', result.message || 'حدث خطأ أثناء حذف الحساب');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('error', 'خطأ في الاتصال', 'حدث خطأ أثناء الاتصال بالخادم');
    }
}

// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const profileTabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const editProfileForm = document.getElementById('edit-profile-form');
    const addProjectForm = document.getElementById('add-project-form');
    
    // Tab switching functionality
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            profileTabs.forEach(t => t.classList.remove('active-tab'));
            tabContents.forEach(c => c.classList.remove('active-content'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active-tab');
            const contentId = this.getAttribute('data-tab');
            document.getElementById(contentId).classList.add('active-content');
        });
    });
    
    // Edit profile form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (validateProfileForm()) {
                // Form is valid, proceed with submission
                console.log('Profile form is valid, submitting...');
                // You can add AJAX request here to submit form data
                
                // Simulate successful form submission
                showMessage('success', 'تم تحديث البيانات الشخصية بنجاح');
            } else {
                // Form is invalid, show error message
                showMessage('error', 'يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
            }
        });
    }
    
    // Add project form submission
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (validateProjectForm()) {
                // Form is valid, proceed with submission
                console.log('Project form is valid, submitting...');
                // You can add AJAX request here to submit form data
                
                // Simulate successful form submission
                showMessage('success', 'تم إضافة المشروع بنجاح');
                this.reset();
            } else {
                // Form is invalid, show error message
                showMessage('error', 'يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
            }
        });
    }
    
    // Toggle visibility of freelancer-specific fields based on user role
    const userRole = document.querySelector('input[name="user-role"]:checked');
    if (userRole) {
        const freelancerFields = document.querySelector('.freelancer-fields');
        if (freelancerFields) {
            if (userRole.value === 'freelancer') {
                freelancerFields.style.display = 'block';
            } else {
                freelancerFields.style.display = 'none';
            }
        }
    }
    
    // Function to show success/error messages
    function showMessage(type, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;
        
        // Add message to page
        const container = document.querySelector('.profile-container');
        container.insertBefore(messageElement, container.firstChild);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
    
});

export {
    updateProfilePage,
    enhanceProfilePage
};