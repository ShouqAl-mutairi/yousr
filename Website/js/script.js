document.addEventListener('DOMContentLoaded', () => {

    //Form Validation Functions
    // Validate text input fields
    function validateField(id, regex, requiredMessage, invalidMessage, exampleMessage) {
        const input = document.getElementById(id);
        const errorDiv = document.getElementById(`${id}-error`);
        const value = input.value.trim();

        // If field is empty
        if (value === "") {
            input.classList.add("input-error");
            input.classList.remove("input-success");
            errorDiv.innerHTML = `${requiredMessage}<small>`;
            return false;
        }

        // If input does not match the required pattern 
        if (!regex.test(value)) {
            input.classList.add("input-error");
            input.classList.remove("input-success");
            errorDiv.innerHTML = `${invalidMessage}<br><small>${exampleMessage}</small>`;
            return false;
        }

        // If input is valid
        input.classList.remove("input-error");
        input.classList.add("input-success");
        errorDiv.textContent = "";
        return true;
    }

    // Validate date input
    function validateDate(id, emptyMessage, invalidMessage) {
        const input = document.getElementById(id);
        const errorDiv = document.getElementById(`${id}-error`);
        const value = new Date(input.value);
        const today = new Date();

        if (input.value.trim() === "") {
            input.classList.add("input-error");
            input.classList.remove("input-success");
            errorDiv.textContent = emptyMessage;
            return false;
        } else if (isNaN(value) || value >= today) {
            input.classList.add("input-error");
            input.classList.remove("input-success");
            errorDiv.textContent = invalidMessage;
            return false;
        } else {
            input.classList.remove("input-error");
            input.classList.add("input-success");
            errorDiv.textContent = "";
            return true;
        }
    }

    // Validate radio buttons
    function validateRadio(name, errorMessage) {
        const radios = document.getElementsByName(name);
        const errorDiv = document.getElementById(`${name}-error`);
        let checked = false;

        radios.forEach(radio => {
            if (radio.checked) {
                checked = true;
            }
        });

        if (!checked) {
            errorDiv.textContent = errorMessage;
            return false;
        } else {
            errorDiv.textContent = "";
            return true;
        }
    }

    // Validate checkbox
    function validateCheckbox(id, errorMessage) {
        const checkbox = document.getElementById(id);
        const errorDiv = document.getElementById(`${id}-error`);

        if (!checkbox.checked) {
            errorDiv.textContent = errorMessage;
            return false;
        } else {
            errorDiv.textContent = "";
            return true;
        }
    }

    // Validate the entire signup form before submission
    function validateSignupForm() {
        let isValid = true;

        isValid &= validateField(
            "username",
            /^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/,
            "اسم المستخدم مطلوب",
            "يجب أن يبدأ اسم المستخدم بحرف وأن يتكون من أحرف وأرقام وشرطات سفلية فقط (3-20 حرف)",
            ""
        );

        isValid &= validateField(
            "email",
            /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
            "البريد الإلكتروني مطلوب",
            "يرجى إدخال بريد إلكتروني صحيح بتنسيق name@domain.com",
            ""
        );

        isValid &= validateField(
            "password",
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&]).{8,35}/,
            "كلمة المرور مطلوبة",
            "كلمة المرور ضعيفة - يجب أن تحتوي على الأقل على ٨ أحرف تتضمن حرف كبير وحرف صغير ورقم ورمز خاص",
            ""
        );

        isValid &= validateField(
            "phone",
            /^[0-9]{10,15}$/,
            "رقم الهاتف مطلوب",
            "يرجى إدخال رقم هاتف صحيح مكون من 10-15 رقم بدون أحرف أو رموز",
            ""
        );

        isValid &= validateDate(
            "dob",
            "تاريخ الميلاد مطلوب",
            "يرجى إدخال تاريخ ميلاد صحيح (يجب أن يكون في الماضي)"
        );

        isValid &= validateRadio(
            "user-role",
            "الرجاء تحديد نوع المستخدم "
        );

        isValid &= validateRadio(
            "gender",
            "الرجاء تحديد الجنس "
        );

        isValid &= validateCheckbox(
            "terms",
            "يجب الموافقة على الشروط والأحكام"
        );

        return Boolean(isValid);
    }

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    
    // Check if user is logged in
    const checkAuthStatus = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            // User is logged in
            return JSON.parse(userData);
        }
        return null;
    };
    
    // Update nav menu based on auth status
    const updateNavMenu = () => {
        const user = checkAuthStatus();
        const authButtonsContainer = document.querySelector('.auth-buttons');
        
        if (user && authButtonsContainer) {
            // Replace auth buttons with profile picture
            authButtonsContainer.innerHTML = `
                <div class="user-profile">
                    <img src="${user.avatar}" alt="${user.username}" class="profile-picture">
                    <div class="profile-dropdown">
                        <a href="/profile" class="profile-dropdown-item">
                            <i class="fas fa-user"></i> الملف الشخصي
                        </a>
                        <div class="profile-dropdown-divider"></div>
                        <a href="#" class="profile-dropdown-item logout-link">
                            <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                        </a>
                    </div>
                </div>
            `;
            
            // Add click event for profile picture dropdown
            const profilePicture = document.querySelector('.profile-picture');
            const profileDropdown = document.querySelector('.profile-dropdown');
            
            if (profilePicture && profileDropdown) {
                profilePicture.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profileDropdown.classList.toggle('active');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    profileDropdown.classList.remove('active');
                });
                
                // Prevent dropdown from closing when clicking inside it
                profileDropdown.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                
                // Handle logout
                const logoutLink = document.querySelector('.logout-link');
                if (logoutLink) {
                    logoutLink.addEventListener('click', (e) => {
                        e.preventDefault();
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
    };
    
    // Update profile page if user is on profile page
    const updateProfilePage = () => {
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
            updateElement('profile-name', user.username);
            updateElementHTML('profile-role', `نوع الحساب: <span>${user.user_role === 'freelancer' ? 'فريلانسر' : 'عميل'}</span>`);
            updateElementHTML('profile-email', `البريد الإلكتروني: <span>${user.email}</span>`);
            updateElementHTML('profile-phone', `رقم الهاتف: <span>${user.phone}</span>`);
            
            // Personal info tab - check IDs carefully
            updateElement('info-username', user.username); // Changed from 'info-name' to 'info-username'
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
    };

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
        
        updateElement('profile-name', userData.username);
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
            
            // Update specialty with localized name
            if (userData.specialty) {
                const specialtyNames = {
                    'web-development': 'تطوير الويب',
                    'graphic-design': 'التصميم الجرافيكي',
                    'digital-marketing': 'التسويق الرقمي',
                    'content-writing': 'كتابة المحتوى',
                    'other': 'أخرى'
                };
                updateElement('info-specialty', specialtyNames[userData.specialty] || userData.specialty);
                
                // Set the specialty dropdown in edit mode
                updateInputValue('edit-specialty', userData.specialty);
            }
            
            // Update bio
            updateElement('info-bio', userData.profile_bio);
            updateInputValue('edit-bio', userData.profile_bio);
            
            // Update price range display and inputs
            if (userData.min_price && userData.max_price) {
                updateElement('info-price-range', `${userData.min_price} - ${userData.max_price}`);
                updateInputValue('edit-min-price', userData.min_price);
                updateInputValue('edit-max-price', userData.max_price);
            } else {
                updateElement('info-price-range', '-');
            }
        } else {
            // Hide freelancer sections for clients
            const freelancerInfoSection = document.querySelector('.freelancer-info');
            const freelancerFieldsSection = document.querySelector('.freelancer-fields');
            
            if (freelancerInfoSection) freelancerInfoSection.style.display = 'none';
            if (freelancerFieldsSection) freelancerFieldsSection.style.display = 'none';
        }
        
        updateElement('info-availability', userData.is_available ? 'نعم' : 'لا');

        // Info tab - edit mode
        updateInputValue('edit-first-name', userData.first_name);
        updateInputValue('edit-last-name', userData.last_name);
        updateInputValue('edit-email', userData.email);
        updateInputValue('edit-phone', userData.phone);
        
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
        
        // Clear current projects
        projectsList.innerHTML = '';
        
        if (projects && projects.length > 0) {
            projectsTab.classList.add('has-projects');
            
            // Create project cards
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsList.appendChild(projectCard);
            });
        } else {
            projectsTab.classList.remove('has-projects');
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
                const formData = new FormData(userInfoForm);
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
                    min_price: formData.get('min_price') || null,
                    max_price: formData.get('max_price') || null
                };
                
                try {
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
        
        // Password change
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const currentPassword = document.getElementById('current-password').value;
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                // Validate passwords
                if (newPassword !== confirmPassword) {
                    showNotification('error', 'خطأ في كلمة المرور', 'كلمات المرور الجديدة غير متطابقة');
                    return;
                }
                
                // Validate new password format
                const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,35}/;
                if (!passwordPattern.test(newPassword)) {
                    showNotification('error', 'كلمة المرور ضعيفة', 'كلمة المرور الجديدة يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص');
                    return;
                }
                
                try {
                    const response = await fetch(`/api/user/${userId}/password`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ currentPassword, newPassword }),
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        showNotification('success', 'تم تغيير كلمة المرور', 'تم تغيير كلمة المرور بنجاح');
                        passwordForm.reset();
                    } else {
                        showNotification('error', 'فشل تغيير كلمة المرور', result.message || 'حدث خطأ أثناء تغيير كلمة المرور');
                    }
                } catch (error) {
                    console.error('Error changing password:', error);
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

    // Add notification container to body if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Function to show notifications
    const showNotification = (type, title, message, duration = 10000) => {
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
    };

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        authButtons.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link, .btn').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            authButtons.classList.remove('active');
        });
    });

    // Form validation and submission for signup
    const signupForm = document.querySelector('form[action="/signup"]');
    if (signupForm && window.location.pathname.includes('/signup')) {
        // Add real-time validation for each input field
        const usernameInput = signupForm.querySelector('#username');
        const emailInput = signupForm.querySelector('#email');
        const passwordInput = signupForm.querySelector('#password');
        const phoneInput = signupForm.querySelector('#phone');
        const dobInput = signupForm.querySelector('#dob');
        const termsCheckbox = signupForm.querySelector('#terms');
        const userRoleRadios = signupForm.querySelectorAll('input[name="user-role"]');
        const genderRadios = signupForm.querySelectorAll('input[name="gender"]');
        
        // Event listeners for text inputs
        usernameInput.addEventListener('input', () => {
            validateField(
                "username",
                /^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/,
                "اسم المستخدم مطلوب",
                "يجب أن يبدأ اسم المستخدم بحرف وأن يتكون من أحرف وأرقام وشرطات سفلية فقط (3-20 حرف)",
                ""
            );
        });
        
        emailInput.addEventListener('input', () => {
            validateField(
                "email",
                /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
                "البريد الإلكتروني مطلوب",
                "يرجى إدخال بريد إلكتروني صحيح بتنسيق name@domain.com",
                ""
            );
        });
        
        passwordInput.addEventListener('input', () => {
            validateField(
                "password",
                /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&]).{8,35}/,
                "كلمة المرور مطلوبة",
                "كلمة المرور ضعيفة - يجب أن تحتوي على الأقل على ٨ أحرف تتضمن حرف كبير وحرف صغير ورقم ورمز خاص",
                ""
            );
        });
        
        phoneInput.addEventListener('input', () => {
            validateField(
                "phone",
                /^[0-9]{10,15}$/,
                "رقم الهاتف مطلوب",
                "يرجى إدخال رقم هاتف صحيح مكون من 10-15 رقم بدون أحرف أو رموز",
                ""
            );
        });
        
        dobInput.addEventListener('change', () => {
            validateDate(
                "dob",
                "تاريخ الميلاد مطلوب",
                "يرجى إدخال تاريخ ميلاد صحيح (يجب أن يكون في الماضي)"
            );
        });
        
        // Event listeners for radio buttons
        userRoleRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                validateRadio(
                    "user-role",
                    "الرجاء تحديد نوع المستخدم"
                );
            });
        });
        
        genderRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                validateRadio(
                    "gender",
                    "الرجاء تحديد الجنس"
                );
            });
        });
        
        // Event listener for terms checkbox
        termsCheckbox.addEventListener('change', () => {
            validateCheckbox(
                "terms",
                "يجب الموافقة على الشروط والأحكام"
            );
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate form before submitting
            if (!validateSignupForm()) {
                showNotification('warning', 'بيانات غير مكتملة', 'يرجى تصحيح الأخطاء قبل إرسال النموذج');
                return;
            }

            // Get form data
            const formData = new FormData(signupForm);

            // Disable form submission while processing
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'جاري إنشاء الحساب...';

            // Get date of birth from the form
            let dobValue = formData.get('date_of_birth');
            console.log('Original date_of_birth from form:', dobValue);

            if (dobValue) {
                try {
                    // Make sure the date is in the format expected by the server
                    dobValue = dobValue.toString().trim();

                    const userData = {
                        username: formData.get('username'),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        phone: formData.get('phone'),
                        "user-role": formData.get('user-role'),
                        gender: formData.get('gender'),
                        date_of_birth: dobValue
                    };

                    console.log('Form data being sent:', userData);

                    // Send data to server
                    const response = await fetch('/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    const result = await response.json();
                    console.log('Server response:', result);

                    if (response.ok) {
                        // Success notification
                        showNotification(
                            'success',
                            result.message || 'تم إنشاء الحساب بنجاح!',
                            result.details || 'يمكنك الآن تسجيل الدخول باستخدام بيانات حسابك'
                        );

                        // Redirect to login after a delay
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    } else {
                        // Error notification
                        if (result.errors && result.errors.length > 0) {
                            const errorMessages = result.errors.map(err => err.msg).join('<br>');
                            showNotification(
                                'error',
                                result.message || 'فشل في إنشاء الحساب',
                                `<strong>${result.details || 'الرجاء التحقق من المعلومات المدخلة'}</strong><br>${errorMessages}`
                            );
                        } else {
                            showNotification(
                                'error',
                                result.message || 'فشل في إنشاء الحساب',
                                result.details || result.error || 'حدث خطأ غير معروف'
                            );
                        }

                        // Reset submit button
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showNotification(
                        'error',
                        'خطأ في النظام',
                        'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.'
                    );

                    // Reset submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            } else {
                showNotification(
                    'warning',
                    'بيانات ناقصة',
                    'الرجاء إدخال تاريخ الميلاد'
                );

                // Reset submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Handle login form
    const loginForm = document.querySelector('form[action="/login"]');
    if (loginForm && window.location.pathname.includes('/login')) {
        // Frontend validation functions
        const validateUsername = (username) => {
            if (!username) {
                return 'اسم المستخدم مطلوب';
            }
            if (username.length < 3 || username.length > 20) {
                return 'اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا';
            }
            // Username pattern: starts with a letter, then letters, numbers, dots, underscores, or hyphens
            const usernamePattern = /^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/;
            if (!usernamePattern.test(username)) {
                return 'اسم المستخدم يجب أن يبدأ بحرف ويحتوي على أحرف وأرقام فقط';
            }
            return '';
        };

        const validatePassword = (password) => {
            if (!password) {
                return 'كلمة المرور مطلوبة';
            }
            if (password.length < 8 || password.length > 35) {
                return 'كلمة المرور يجب أن تكون بين 8 و 35 حرفًا';
            }
            // Password pattern: at least one digit, one lowercase, one uppercase, one special character
            const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,35}/;
            if (!passwordPattern.test(password)) {
                return 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص';
            }
            return '';
        };

        // Add event listeners for real-time validation
        const usernameInput = loginForm.querySelector('#username');
        const passwordInput = loginForm.querySelector('#password');
        const usernameError = document.getElementById('username-error');
        const passwordError = document.getElementById('password-error');

        usernameInput.addEventListener('input', (e) => {
            const error = validateUsername(e.target.value);
            usernameError.textContent = error;
            
            if (error) {
                e.target.classList.add('input-error');
                e.target.classList.remove('input-success');
            } else {
                e.target.classList.add('input-success');
                e.target.classList.remove('input-error');
            }
        });

        passwordInput.addEventListener('input', (e) => {
            const error = validatePassword(e.target.value);
            passwordError.textContent = error;
            
            if (error) {
                e.target.classList.add('input-error');
                e.target.classList.remove('input-success');
            } else {
                e.target.classList.add('input-success');
                e.target.classList.remove('input-error');
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            
            // Validate inputs
            const usernameError = validateUsername(username);
            const passwordError = validatePassword(password);
            
            // Display validation errors if any
            document.getElementById('username-error').textContent = usernameError;
            document.getElementById('password-error').textContent = passwordError;
            
            // Apply error styling
            if (usernameError) {
                usernameInput.classList.add('input-error');
                usernameInput.classList.remove('input-success');
            }
            
            if (passwordError) {
                passwordInput.classList.add('input-error');
                passwordInput.classList.remove('input-success');
            }
            
            // If there are validation errors, stop form submission
            if (usernameError || passwordError) {
                return;
            }
            
            const loginData = {
                username,
                password
            };
            
            // Disable form submission while processing
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'جاري تسجيل الدخول...';
            
            try {
                // Send data to server
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Store user data in localStorage
                    if (result.user) {
                        localStorage.setItem('userData', JSON.stringify(result.user));
                    }
                    
                    // Success notification
                    showNotification(
                        'success', 
                        'تم تسجيل الدخول بنجاح!',
                        'جاري تحويلك إلى الصفحة الرئيسية...'
                    );
                    
                    // Redirect to home/dashboard after a delay
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    // Error notification
                    showNotification(
                        'error', 
                        'فشل تسجيل الدخول',
                        result.error || (result.errors && result.errors[0].msg) || 'خطأ في اسم المستخدم أو كلمة المرور'
                    );
                    
                    // Reset submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(
                    'error', 
                    'خطأ في النظام',
                    'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
                );
                
                // Reset submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Contact form handler
    const contactForm = document.querySelector('form[action="/contact"]');
    if (contactForm && window.location.pathname.includes('/contact')) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        const contactData = {
          firstName: formData.get('firstName'),
          'last-name': formData.get('last-name'),
          gender: formData.get('gender'),
          phone: formData.get('phone'),
          dob: formData.get('dob'),
          email: formData.get('email'),
          language: formData.get('language'),
          message: formData.get('message')
        };
        
        console.log('Contact form data:', contactData);
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'جاري إرسال الرسالة...';
        
        try {
          const response = await fetch('/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
          });
          
          const result = await response.json();
          console.log('Server response to contact:', result);
          
          if (response.ok) {
            showNotification(
              'success',
              'تم إرسال الرسالة بنجاح!',
              'شكراً لتواصلك معنا. سيتم الرد عليك في أقرب وقت ممكن.'
            );
            
            // Redirect to home page after delay
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
            
            contactForm.reset();
          } else {
            // More detailed error handling
            if (result.errors && result.errors.length > 0) {
              const errorMessages = result.errors.map(err => err.msg).join('<br>');
              showNotification(
                'error',
                'فشل في إرسال الرسالة',
                `<strong>${result.message || 'الرجاء التحقق من المعلومات المدخلة'}</strong><br>${errorMessages}`
              );
            } else {
              showNotification(
                'error',
                'فشل في إرسال الرسالة',
                result.message || result.error || 'حدث خطأ أثناء إرسال الرسالة'
              );
            }
            
            // Reset submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        } catch (error) {
          console.error('Error:', error);
          showNotification(
            'error',
            'خطأ في النظام',
            'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
          );
          
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    }
    
    // Fetch and display available freelancers
    async function fetchAvailableFreelancers() {
      if (!window.location.pathname.includes('/freelancers')) {
        return;
      }
      
      try {
        const response = await fetch('/api/freelancers');
        const result = await response.json();
        
        if (result.success && result.freelancers && result.freelancers.length > 0) {
          // Remove static examples if we have real data
          const staticExamples = document.querySelectorAll('.static-example');
          staticExamples.forEach(example => {
            example.style.display = 'none';
          });
          
          const freelancersGrid = document.getElementById('freelancers-grid');
          
          // Display real freelancers from database
          result.freelancers.forEach(freelancer => {
            const card = createFreelancerCard(freelancer);
            freelancersGrid.appendChild(card);
          });
        }
      } catch (error) {
        console.error('Error fetching freelancers:', error);
        // Keep static examples visible in case of error
      }
    }

    // Create a freelancer card element
    function createFreelancerCard(freelancer) {
      // Get category image based on user's specialty
      const categoryImages = {
        'web-development': '../assets/images/header/webDev.jpg',
        'graphic-design': '../assets/images/header/graphic.jpg',
        'digital-marketing': '../assets/images/header/DigitalMarketing.avif',
        'content-writing': '../assets/images/header/ContentWriting.avif',
        'other': '../assets/images/header/UI.avif'
      };
      
      // Use the specialty from user's profile
      const categoryImage = categoryImages[freelancer.specialty || 'other'];
      
      // Display name depending on whether first/last name are available
      const displayName = (freelancer.first_name && freelancer.last_name) 
        ? `${freelancer.first_name} ${freelancer.last_name}` 
        : freelancer.username;
      
      // Determine role/specialty text based on the user's specialty
      let roleText = 'فريلانسر';
      if (freelancer.specialty) {
        const specialtyNames = {
          'web-development': 'مطور ويب',
          'graphic-design': 'مصمم جرافيك',
          'digital-marketing': 'متخصص تسويق رقمي',
          'content-writing': 'كاتب محتوى',
          'other': 'فريلانسر'
        };
        roleText = specialtyNames[freelancer.specialty] || 'فريلانسر';
      }
      
      // Format price range
      const priceRange = (freelancer.min_price && freelancer.max_price) 
        ? `${freelancer.min_price} - ${freelancer.max_price}` 
        : '٢٠٠ - ٥٠٠';
      
      // Create card using the service-card style
      const card = document.createElement('div');
      card.className = 'service-card';
      card.dataset.id = freelancer.id;
      
      card.innerHTML = `
        <div class="avatar-container">
          <img src="${freelancer.avatar}" alt="${displayName}" class="avatar">
        </div>
        <img src="${categoryImage}" alt="${roleText}" class="service-image">
        <h3>${displayName}</h3>
        <p class="role"><strong>${roleText}</strong></p>
        <p>${freelancer.profile_bio || 'فريلانسر متاح للعمل على مشاريع جديدة'}</p>
        <p>
          <strong>السعر: ${priceRange}
            <span class="sar-container">
              <img src="../assets/images/SAR.png" alt="ريال سعودي" class="sar-icon">
            </span>
          </strong>
        </p>
        <div class="actions">
          <button class="primary-btn">
            تواصل <i class="fas fa-comment"></i>
          </button>
          <button class="secondary-btn">
            المزيد <i class="fas fa-arrow-left"></i>
          </button>
        </div>
      `;
      
      // Add event listeners for card buttons
      const contactBtn = card.querySelector('.primary-btn');
      if (contactBtn) {
        contactBtn.addEventListener('click', () => {
          window.location.href = '/contact?freelancer=' + freelancer.id;
        });
      }
      
      const moreBtn = card.querySelector('.secondary-btn');
      if (moreBtn) {
        moreBtn.addEventListener('click', () => {
          // Could redirect to freelancer profile or show more info in a modal
          showFreelancerDetails(freelancer);
        });
      }
      
      return card;
    }

    // Show freelancer details in a modal
    function showFreelancerDetails(freelancer) {
      // Create a modal to display more information about the freelancer
      const modal = document.createElement('div');
      modal.className = 'freelancer-modal';
      
      // Convert specialty code to readable text
      let specialtyText = 'فريلانسر';
      if (freelancer.specialty) {
        const specialtyNames = {
          'web-development': 'مطور ويب',
          'graphic-design': 'مصمم جرافيك',
          'digital-marketing': 'متخصص تسويق رقمي',
          'content-writing': 'كاتب محتوى',
          'other': 'فريلانسر'
        };
        specialtyText = specialtyNames[freelancer.specialty] || 'فريلانسر';
      }
      
      // Format price range
      const priceRange = (freelancer.min_price && freelancer.max_price) 
        ? `${freelancer.min_price} - ${freelancer.max_price}` 
        : '٢٠٠ - ٥٠٠';
        
      // Create display name
      const displayName = (freelancer.first_name && freelancer.last_name) 
        ? `${freelancer.first_name} ${freelancer.last_name}` 
        : freelancer.username;
      
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div class="freelancer-profile-header">
            <img src="${freelancer.avatar}" alt="${displayName}" class="freelancer-avatar">
            <div class="freelancer-basic-info">
              <h2>${displayName}</h2>
              <p class="specialty-badge">${specialtyText}</p>
              <p class="price-badge">
                <strong>السعر: ${priceRange}
                  <span class="sar-container">
                    <img src="../assets/images/SAR.png" alt="ريال سعودي" class="sar-icon">
                  </span>
                </strong>
              </p>
            </div>
          </div>
          <div class="freelancer-bio">
            <h3>نبذة مهنية</h3>
            <p>${freelancer.profile_bio || 'فريلانسر متاح للعمل على مشاريع جديدة'}</p>
          </div>
          <div class="freelancer-projects">
            <h3>أمثلة من الأعمال</h3>
            <div class="projects-grid" id="freelancer-projects-${freelancer.id}">
              <p class="loading-projects">جاري تحميل الأعمال...</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="contact-freelancer-btn primary-btn">
              تواصل الآن <i class="fas fa-comment"></i>
            </button>
          </div>
        </div>
      `;
      
      // Add modal to the body
      document.body.appendChild(modal);
      
      // Show the modal with animation
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
      
      // Close button functionality
      const closeButton = modal.querySelector('.close-modal');
      closeButton.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.remove();
        }, 300);
      });
      
      // Close when clicking outside the modal
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.style.opacity = '0';
          setTimeout(() => {
            modal.remove();
          }, 300);
        }
      });
      
      // Contact button functionality
      const contactBtn = modal.querySelector('.contact-freelancer-btn');
      contactBtn.addEventListener('click', () => {
        window.location.href = '/contact?freelancer=' + freelancer.id;
      });
      
      // Fetch and display freelancer projects
      fetchFreelancerProjects(freelancer.id, `freelancer-projects-${freelancer.id}`);
    }
    
    // Fetch a freelancer's projects
    async function fetchFreelancerProjects(freelancerId, containerId) {
      try {
        const response = await fetch(`/api/freelancers/${freelancerId}/projects`);
        const result = await response.json();
        
        const projectsContainer = document.getElementById(containerId);
        
        if (!projectsContainer) return;
        
        // Clear loading message
        projectsContainer.innerHTML = '';
        
        if (result.success && result.projects && result.projects.length > 0) {
          // Display projects
          result.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-item';
            projectCard.innerHTML = `
              <h4>${project.title}</h4>
              <p>${project.description}</p>
            `;
            projectsContainer.appendChild(projectCard);
          });
        } else {
          // No projects found
          projectsContainer.innerHTML = '<p class="no-projects">لا توجد أعمال لعرضها حالياً</p>';
        }
      } catch (error) {
        console.error('Error fetching freelancer projects:', error);
        const projectsContainer = document.getElementById(containerId);
        if (projectsContainer) {
          projectsContainer.innerHTML = '<p class="error-loading">حدث خطأ أثناء تحميل المشاريع</p>';
        }
      }
    }

    // Call this function when page loads
    fetchAvailableFreelancers();
    
    // Call the authentication check and UI update
    updateNavMenu();
    updateProfilePage();
    enhanceProfilePage();
});
