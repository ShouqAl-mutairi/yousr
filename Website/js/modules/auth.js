// Auth Module - Handles user authentication, login, and signup
import { showNotification } from './ui.js';
import { validateField, validateDate, validateRadio, validateCheckbox, validateSignupForm } from './validation.js';

// Check if user is logged in
function checkAuthStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

// Update nav menu based on auth status
function updateNavMenu() {
    const user = checkAuthStatus();
    const authButtonsContainer = document.querySelector('.auth-buttons');
    
    if (user && authButtonsContainer) {
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
}

// Setup login form handling
function setupLoginForm() {
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
}

// Setup signup form handling
function setupSignupForm() {
    const signupForm = document.querySelector('form[action="/signup"]');
    if (signupForm && window.location.pathname.includes('/signup')) {
        // Add real-time validation for each input field
        const usernameInput = signupForm.querySelector('#username');
        const firstNameInput = signupForm.querySelector('#first-name');
        const lastNameInput = signupForm.querySelector('#last-name');
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
                "مثال: user_123"
            );
        });
        
        firstNameInput.addEventListener('input', () => {
            validateField(
                "first-name",
                /^[a-zA-Zأ-ي\s]{2,30}$/,
                "الاسم الأول مطلوب",
                "يجب أن يتكون الاسم الأول من أحرف فقط (2-30 حرف)",
                "مثال: محمد"
            );
        });
        
        lastNameInput.addEventListener('input', () => {
            validateField(
                "last-name",
                /^[a-zA-Zأ-ي\s]{2,30}$/,
                "الاسم الأخير مطلوب",
                "يجب أن يتكون الاسم الأخير من أحرف فقط (2-30 حرف)",
                "مثال: العبدالله"
            );
        });
        
        emailInput.addEventListener('input', () => {
            validateField(
                "email",
                /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
                "البريد الإلكتروني مطلوب",
                "يرجى إدخال بريد إلكتروني صحيح بتنسيق name@domain.com",
                "مثال: example@email.com"
            );
        });
        
        passwordInput.addEventListener('input', () => {
            validateField(
                "password",
                /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&]).{8,35}/,
                "كلمة المرور مطلوبة",
                "كلمة المرور ضعيفة - يجب أن تحتوي على الأقل على ٨ أحرف تتضمن حرف كبير وحرف صغير ورقم ورمز خاص",
                "مثال: Passw0rd@123"
            );
        });
        
        phoneInput.addEventListener('input', () => {
            validateField(
                "phone",
                /^[0-9]{10,15}$/,
                "رقم الهاتف مطلوب",
                "يرجى إدخال رقم هاتف صحيح مكون من 10-15 رقم بدون أحرف أو رموز",
                "مثال: 0501234567"
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

        // Force initial validation on all fields
        window.addEventListener('load', () => {
            // First clear all error messages to ensure none are showing by default
            clearAllErrorMessages();
            
            // Optional: If you want immediate validation feedback as soon as the page loads,
            // uncomment the line below. Otherwise, errors will only show after user interaction.
            // validateSignupForm();
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate form before submitting
            const isValid = validateSignupForm();
            console.log("Form validation result:", isValid);
            
            if (!isValid) {
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

            try {
                // Properly format the data to match what the server expects
                const userData = {
                    username: formData.get('username'),
                    first_name: formData.get('first_name'),
                    last_name: formData.get('last_name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    phone: formData.get('phone'),
                    "user-role": formData.get('user-role'),
                    gender: formData.get('gender'),
                    date_of_birth: formData.get('date_of_birth')
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
                    // Show all validation errors from server in a clear notification
                    if (result.errors && result.errors.length > 0) {
                        // Format errors in a readable way
                        const uniqueErrors = [...new Set(result.errors.map(err => err.msg))];
                        const errorMessages = uniqueErrors.map(msg => `• ${msg}`).join('<br>');
                        
                        showNotification(
                            'error',
                            result.message || 'فشل في إنشاء الحساب',
                            `<strong>${result.details || 'الرجاء التحقق من المعلومات المدخلة'}</strong><br>${errorMessages}`,
                            20000 // Longer duration for detailed errors
                        );
                        
                        // Also highlight the fields with errors in the form
                        result.errors.forEach(err => {
                            const fieldId = err.path === 'date_of_birth' ? 'dob' : 
                                          (err.path === 'first_name' ? 'first-name' : 
                                          (err.path === 'last_name' ? 'last-name' : err.path));
                            
                            const field = document.getElementById(fieldId);
                            if (field) {
                                field.classList.add('input-error');
                                field.classList.remove('input-success');
                                
                                // Update error message for this field
                                const errorDiv = document.getElementById(`${fieldId}-error`);
                                if (errorDiv) {
                                    errorDiv.textContent = err.msg;
                                }
                            }
                        });
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
        });
    }
}

export {
    checkAuthStatus,
    updateNavMenu,
    setupLoginForm,
    setupSignupForm
};