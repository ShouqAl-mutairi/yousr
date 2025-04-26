document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');

    // Add notification container to body if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Function to show notifications
    const showNotification = (type, title, message, duration = 5000) => {
        const notificationContainer = document.querySelector('.notification-container');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const notificationContent = `
            <div class="notification-header">
                <span class="notification-title">${title}</span>
                <button class="notification-close">&times;</button>
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
});