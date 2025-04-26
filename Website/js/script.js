document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');

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
    const signupForm = document.querySelector('form[action="#"]');
    if (signupForm && window.location.href.includes('sign-up.html')) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(signupForm);
            
            // Format date of birth to ensure it's in YYYY-MM-DD format
            let dobValue = formData.get('dob');
            console.log('Original DOB from form:', dobValue);
            
            // Simple approach: Just directly convert the dob value to a MySQL acceptable format
            // This is more reliable than trying to construct a date object
            if (dobValue) {
                try {
                    // Extract the date components directly from the string
                    // The input date format is typically YYYY-MM-DD from the HTML date input
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
                        // Success - redirect to login
                        alert('تم إنشاء الحساب بنجاح!');
                        window.location.href = '/login';
                    } else {
                        // Show error message with more details
                        if (result.errors && result.errors.length > 0) {
                            const errorMessages = result.errors.map(err => err.msg).join('\n');
                            alert(`حدثت أخطاء:\n${errorMessages}`);
                        } else {
                            alert(`خطأ: ${result.error || 'حدث خطأ غير معروف'}`);
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
                }
            } else {
                alert('الرجاء إدخال تاريخ الميلاد');
            }
        });
    }

    // Handle login form
    const loginForm = document.querySelector('form[action="#"]');
    if (loginForm && window.location.href.includes('login.html')) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
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
                    // Success - redirect to home/dashboard
                    alert('تم تسجيل الدخول بنجاح!');
                    window.location.href = 'index.html';
                } else {
                    // Show error message
                    alert(`خطأ: ${result.error || result.errors[0].msg}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
            }
        });
    }
});