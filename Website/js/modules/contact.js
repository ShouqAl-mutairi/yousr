// Contact Module - Handles contact form functionality

import { showNotification } from './ui.js';
import { validateField, validateDate, validateRadio } from './validation.js';

// Function to hide all error messages initially
function hideAllErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.style.display = 'none';
    });
}

// Setup contact form validation
function setupContactFormValidation() {
    // Hide all error messages when the page loads
    hideAllErrorMessages();
    
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    const emailInput = document.getElementById('email');
    const languageSelect = document.getElementById('language');
    const messageInput = document.getElementById('message');
    const genderRadios = document.getElementsByName('gender');

    // Add real-time validation for first name
    if (firstNameInput) {
        firstNameInput.addEventListener('input', () => {
            validateField(
                'first-name',
                /^[\p{L}\s]{3,50}$/u,
                'الاسم الأول مطلوب',
                'الاسم الأول يجب أن يحتوي على أحرف ومسافات فقط',
                'مثال: محمد'
            );
        });
    }

    // Add real-time validation for last name
    if (lastNameInput) {
        lastNameInput.addEventListener('input', () => {
            validateField(
                'last-name',
                /^[\p{L}\s]{3,50}$/u,
                'الاسم الأخير مطلوب',
                'الاسم الأخير يجب أن يحتوي على أحرف ومسافات فقط',
                'مثال: العبدالله'
            );
        });
    }

    // Add real-time validation for phone
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            validateField(
                'phone',
                /^[0-9]{10,15}$/u,
                'رقم الهاتف مطلوب',
                'رقم الهاتف يجب أن يتكون من 10 إلى 15 رقمًا',
                'مثال: 0501234567'
            );
        });
    }

    // Add real-time validation for date of birth
    if (dobInput) {
        dobInput.addEventListener('change', () => {
            validateDate(
                'dob',
                'تاريخ الميلاد مطلوب',
                'تاريخ الميلاد يجب أن يكون في الماضي'
            );
        });
    }

    // Add real-time validation for email
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            validateField(
                'email',
                /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/u,
                'البريد الإلكتروني مطلوب',
                'البريد الإلكتروني يجب أن يكون بصيغة صحيحة',
                'مثال: example@domain.com'
            );
        });
    }

    // Add real-time validation for language
    if (languageSelect) {
        languageSelect.addEventListener('change', () => {
            const errorDiv = document.getElementById('language-error');
            if (languageSelect.value === '') {
                languageSelect.classList.add('input-error');
                languageSelect.classList.remove('input-success');
                errorDiv.textContent = 'اللغة مطلوبة';
            } else {
                languageSelect.classList.remove('input-error');
                languageSelect.classList.add('input-success');
                errorDiv.textContent = '';
            }
        });
    }

    // Add real-time validation for message
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            const errorDiv = document.getElementById('message-error');
            const value = messageInput.value.trim();
            if (value === '') {
                messageInput.classList.add('input-error');
                messageInput.classList.remove('input-success');
                errorDiv.textContent = 'الرسالة مطلوبة';
            } else if (value.length < 10) {
                messageInput.classList.add('input-error');
                messageInput.classList.remove('input-success');
                errorDiv.textContent = 'الرسالة يجب أن تكون على الأقل 10 أحرف';
            } else if (value.length > 1000) {
                messageInput.classList.add('input-error');
                messageInput.classList.remove('input-success');
                errorDiv.textContent = 'الرسالة يجب أن تكون أقل من 1000 حرف';
            } else {
                messageInput.classList.remove('input-error');
                messageInput.classList.add('input-success');
                errorDiv.textContent = '';
            }
        });
    }

    // Add real-time validation for gender
    if (genderRadios.length > 0) {
        genderRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                validateRadio('gender', 'الجنس مطلوب');
            });
        });
    }
}

// Validate the entire contact form before submission
function validateContactForm() {
    let isValid = true;

    isValid &= validateField(
        'first-name',
        /^[\p{L}\s]{3,50}$/u,
        'الاسم الأول مطلوب',
        'الاسم الأول يجب أن يحتوي على أحرف ومسافات فقط',
        'مثال: محمد'
    );

    isValid &= validateField(
        'last-name',
        /^[\p{L}\s]{3,50}$/u,
        'الاسم الأخير مطلوب',
        'الاسم الأخير يجب أن يحتوي على أحرف ومسافات فقط',
        'مثال: العبدالله'
    );

    isValid &= validateField(
        'phone',
        /^[0-9]{10,15}$/u,
        'رقم الهاتف مطلوب',
        'رقم الهاتف يجب أن يتكون من 10 إلى 15 رقمًا',
        'مثال: 0501234567'
    );

    isValid &= validateDate(
        'dob',
        'تاريخ الميلاد مطلوب',
        'تاريخ الميلاد يجب أن يكون في الماضي'
    );

    isValid &= validateField(
        'email',
        /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/u,
        'البريد الإلكتروني مطلوب',
        'البريد الإلكتروني يجب أن يكون بصيغة صحيحة',
        'مثال: example@domain.com'
    );

    // Validate language selection
    const languageSelect = document.getElementById('language');
    const languageErrorDiv = document.getElementById('language-error');
    if (languageSelect.value === '') {
        languageSelect.classList.add('input-error');
        languageSelect.classList.remove('input-success');
        languageErrorDiv.textContent = 'اللغة مطلوبة';
        isValid = false;
    } else {
        languageSelect.classList.remove('input-error');
        languageSelect.classList.add('input-success');
        languageErrorDiv.textContent = '';
    }

    // Validate message
    const messageInput = document.getElementById('message');
    const messageErrorDiv = document.getElementById('message-error');
    const messageValue = messageInput.value.trim();
    if (messageValue === '') {
        messageInput.classList.add('input-error');
        messageInput.classList.remove('input-success');
        messageErrorDiv.textContent = 'الرسالة مطلوبة';
        isValid = false;
    } else if (messageValue.length < 10) {
        messageInput.classList.add('input-error');
        messageInput.classList.remove('input-success');
        messageErrorDiv.textContent = 'الرسالة يجب أن تكون على الأقل 10 أحرف';
        isValid = false;
    } else if (messageValue.length > 1000) {
        messageInput.classList.add('input-error');
        messageInput.classList.remove('input-success');
        messageErrorDiv.textContent = 'الرسالة يجب أن تكون أقل من 1000 حرف';
        isValid = false;
    } else {
        messageInput.classList.remove('input-error');
        messageInput.classList.add('input-success');
        messageErrorDiv.textContent = '';
    }

    isValid &= validateRadio('gender', 'الجنس مطلوب');

    return Boolean(isValid);
}

// Setup contact form handling
function setupContactForm() {
    const contactForm = document.querySelector('form[action="/contact"]');
    if (contactForm && window.location.pathname.includes('/contact')) {
        // Setup real-time validation
        setupContactFormValidation();
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form before submission
            if (!validateContactForm()) {
                // If form is invalid, stop submission
                return;
            }
            
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
}

export {
    setupContactForm
};