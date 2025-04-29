// Form Validation Functions
// Validate text input fields
function validateField(id, regex, requiredMessage, invalidMessage, exampleMessage) {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(`${id}-error`);
    const value = input.value.trim();

    // Check for native HTML5 validation state
    if (input.validity.valueMissing) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.innerHTML = `${requiredMessage}<small>`;
        return false;
    }
    
    // Check for native HTML5 validation - too short
    if (input.validity.tooShort) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.innerHTML = `الحد الأدنى هو ${input.minLength} حرف`;
        return false;
    }
    
    // Check for native HTML5 validation - too long
    if (input.validity.tooLong) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.innerHTML = `الحد الأقصى هو ${input.maxLength} حرف`;
        return false;
    }

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

// Validate optional field (can be empty but must match regex if not empty)
function validateOptionalField(id, regex, invalidMessage, exampleMessage) {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(`${id}-error`);
    const value = input.value.trim();

    // Check for native HTML5 validation - pattern mismatch
    if (input.validity.patternMismatch) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.innerHTML = `${invalidMessage}<br><small>${exampleMessage}</small>`;
        return false;
    }
    
    // Check for native HTML5 validation - too short
    if (input.validity.tooShort) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.innerHTML = `الحد الأدنى هو ${input.minLength} حرف`;
        return false;
    }
    
    // Check for native HTML5 validation - too long
    if (input.validity.tooLong) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.innerHTML = `الحد الأقصى هو ${input.maxLength} حرف`;
        return false;
    }

    // If field is empty, it's valid (optional)
    if (value === "") {
        input.classList.remove("input-error");
        input.classList.remove("input-success");
        errorDiv.textContent = "";
        return true;
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

// Validate number input
function validateNumber(id, min, max, requiredMessage, invalidMessage) {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(`${id}-error`);
    const value = input.value.trim();

    // If field is empty
    if (value === "") {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.textContent = requiredMessage;
        return false;
    }

    const numberValue = parseFloat(value);

    // If input is not a valid number or is outside the min/max range
    if (isNaN(numberValue) || numberValue < min || (max !== null && numberValue > max)) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.textContent = invalidMessage;
        return false;
    }

    // If input is valid
    input.classList.remove("input-error");
    input.classList.add("input-success");
    errorDiv.textContent = "";
    return true;
}

// Validate optional number input
function validateOptionalNumber(id, min, max, invalidMessage) {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(`${id}-error`);
    const value = input.value.trim();

    // If field is empty, it's valid (optional)
    if (value === "") {
        input.classList.remove("input-error");
        input.classList.remove("input-success");
        errorDiv.textContent = "";
        return true;
    }

    const numberValue = parseFloat(value);

    // If input is not a valid number or is outside the min/max range
    if (isNaN(numberValue) || numberValue < min || (max !== null && numberValue > max)) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorDiv.textContent = invalidMessage;
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

// Validate optional date input
function validateOptionalDate(id, invalidMessage) {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(`${id}-error`);
    
    // If field is empty, it's valid (optional)
    if (input.value.trim() === "") {
        input.classList.remove("input-error");
        input.classList.remove("input-success");
        errorDiv.textContent = "";
        return true;
    }
    
    const value = new Date(input.value);
    const today = new Date();

    if (isNaN(value) || value >= today) {
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

// Validate select input
function validateSelect(id, requiredMessage) {
    const select = document.getElementById(id);
    const errorDiv = document.getElementById(`${id}-error`);
    const value = select.value.trim();

    if (value === "") {
        select.classList.add("input-error");
        select.classList.remove("input-success");
        errorDiv.textContent = requiredMessage;
        return false;
    } else {
        select.classList.remove("input-error");
        select.classList.add("input-success");
        errorDiv.textContent = "";
        return true;
    }
}

// Validate price range (min_price should be less than max_price)
function validatePriceRange(minId, maxId, errorMessage) {
    const minInput = document.getElementById(minId);
    const maxInput = document.getElementById(maxId);
    const errorDiv = document.getElementById(`${minId}-range-error`);
    
    const minValue = parseFloat(minInput.value) || 0;
    const maxValue = parseFloat(maxInput.value) || 0;
    
    if (minValue >= maxValue && maxValue > 0) {
        minInput.classList.add("input-error");
        maxInput.classList.add("input-error");
        errorDiv.textContent = errorMessage;
        return false;
    } else {
        minInput.classList.remove("input-error");
        maxInput.classList.remove("input-error");
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
        "first-name",
        /^[a-zA-Zأ-ي\s]{2,30}$/,
        "الاسم الأول مطلوب",
        "يجب أن يتكون الاسم الأول من أحرف فقط (2-30 حرف)",
        ""
    );

    isValid &= validateField(
        "last-name",
        /^[a-zA-Zأ-ي\s]{2,30}$/,
        "الاسم الأخير مطلوب",
        "يجب أن يتكون الاسم الأخير من أحرف فقط (2-30 حرف)",
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

// Validate the profile update form
function validateProfileForm() {
    let isValid = true;

    isValid &= validateField(
        "edit-first-name",
        /^[a-zA-Zأ-ي\s]{2,30}$/,
        "الاسم الأول مطلوب",
        "يجب أن يتكون الاسم الأول من أحرف فقط (2-30 حرف)",
        ""
    );

    isValid &= validateField(
        "edit-last-name",
        /^[a-zA-Zأ-ي\s]{2,30}$/,
        "الاسم الأخير مطلوب",
        "يجب أن يتكون الاسم الأخير من أحرف فقط (2-30 حرف)",
        ""
    );

    isValid &= validateField(
        "edit-email",
        /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
        "البريد الإلكتروني مطلوب",
        "يرجى إدخال بريد إلكتروني صحيح بتنسيق name@domain.com",
        ""
    );

    isValid &= validateField(
        "edit-phone",
        /^[0-9]{10,15}$/,
        "رقم الهاتف مطلوب",
        "يرجى إدخال رقم هاتف صحيح مكون من 10-15 رقم بدون أحرف أو رموز",
        ""
    );

    isValid &= validateOptionalDate(
        "edit-dob",
        "يرجى إدخال تاريخ ميلاد صحيح (يجب أن يكون في الماضي)"
    );

    // Check if user is freelancer and validate freelancer-specific fields
    const freelancerFields = document.querySelector('.freelancer-fields');
    if (freelancerFields && freelancerFields.style.display !== 'none') {
        isValid &= validateOptionalField(
            "edit-specialty",
            /^[a-zA-Zأ-ي0-9\s\-,.]{2,50}$/,
            "يجب أن يتكون التخصص من 2-50 حرف",
            ""
        );

        isValid &= validateOptionalField(
            "edit-bio",
            /^[\s\S]{10,500}$/,
            "يجب أن تتكون النبذة المهنية من 10-500 حرف",
            ""
        );

        // Validate price range only if both fields have values
        const minPrice = document.getElementById("edit-min-price").value.trim();
        const maxPrice = document.getElementById("edit-max-price").value.trim();
        
        if (minPrice !== "" || maxPrice !== "") {
            isValid &= validateOptionalNumber(
                "edit-min-price",
                0,
                null,
                "يجب أن يكون الحد الأدنى للسعر رقماً موجباً"
            );
            
            isValid &= validateOptionalNumber(
                "edit-max-price",
                0,
                null,
                "يجب أن يكون الحد الأقصى للسعر رقماً موجباً"
            );
            
            if (minPrice !== "" && maxPrice !== "") {
                isValid &= validatePriceRange(
                    "edit-min-price",
                    "edit-max-price",
                    "يجب أن يكون الحد الأدنى للسعر أقل من الحد الأقصى"
                );
            }
        }
    }

    return Boolean(isValid);
}

// Validate the add project form
function validateProjectForm() {
    let isValid = true;

    isValid &= validateField(
        "project-title",
        /^[\u0600-\u06FFa-zA-Z0-9\s.,!?-]{5,100}$/,
        "عنوان المشروع مطلوب",
        "يجب أن يتكون العنوان من 5-100 حرف",
        ""
    );

    isValid &= validateSelect(
        "project-category",
        "يجب اختيار فئة المشروع"
    );

    isValid &= validateField(
        "project-description",
        /^[\u0600-\u06FFa-zA-Z0-9\s.,!?()-]{20,1000}$/,
        "وصف المشروع مطلوب",
        "يجب أن يتكون الوصف من 20-1000 حرف",
        ""
    );

    isValid &= validateOptionalNumber(
        "project-price",
        0,
        null,
        "يجب أن يكون السعر رقماً موجباً"
    );

    return Boolean(isValid);
}

// Export functions for use in other modules
export {
    validateField,
    validateOptionalField,
    validateNumber,
    validateOptionalNumber,
    validateDate,
    validateOptionalDate,
    validateSelect,
    validatePriceRange,
    validateRadio,
    validateCheckbox,
    validateSignupForm,
    validateProfileForm,
    validateProjectForm
};