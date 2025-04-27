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
            "يجب إدخال اسم المستخدم",
            "اسم المستخدم غير صحيح",
            "مثال: user123 أو user.name"
        );

        isValid &= validateField(
            "email",
            /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
            "يجب إدخال البريد الإلكتروني",
            "البريد الإلكتروني غير صالح",
            "مثال: example@email.com"
        );

        isValid &= validateField(
            "password",
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&]).{8,35}/,
            "يجب إدخال كلمة المرور",
            "كلمة المرور ضعيفة",
            "يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص مثل: Aa123@abc"
        );

        isValid &= validateField(
            "phone",
            /^[0-9]{10,15}$/,
            "يجب إدخال رقم الهاتف",
            "رقم الهاتف غير صحيح",
            "مثال: 0551234567"
        );

        isValid &= validateDate(
            "dob",
            "يجب إدخال تاريخ الميلاد",
            "تاريخ الميلاد يجب أن يكون صحيح"
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
            
            // Update profile page elements with user data
            document.getElementById('profile-avatar-img').src = user.avatar;
            document.getElementById('profile-name').textContent = user.username;
            document.getElementById('profile-role').innerHTML = `نوع الحساب: <span>${user.user_role === 'freelancer' ? 'فريلانسر' : 'عميل'}</span>`;
            document.getElementById('profile-email').innerHTML = `البريد الإلكتروني: <span>${user.email}</span>`;
            document.getElementById('profile-phone').innerHTML = `رقم الهاتف: <span>${user.phone}</span>`;
            
            // Personal info tab
            document.getElementById('info-name').textContent = user.username;
            document.getElementById('info-email').textContent = user.email;
            document.getElementById('info-phone').textContent = user.phone;
            document.getElementById('info-dob').textContent = new Date(user.date_of_birth).toLocaleDateString('ar-SA');
            document.getElementById('info-gender').textContent = user.gender === 'male' ? 'ذكر' : 'أنثى';
            
            // Settings tab
            document.getElementById('avatar-preview-img').src = user.avatar;
            
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
                    document.getElementById(`${tabName}-tab`).classList.add('active');
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
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(loginForm);
            const loginData = {
                username: formData.get('username'),
                password: formData.get('password')
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
    
    // Call the authentication check and UI update
    updateNavMenu();
    updateProfilePage();
});
