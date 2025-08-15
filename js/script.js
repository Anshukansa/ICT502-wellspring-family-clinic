// WellSpring Family Clinic - Main JavaScript File

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initWelcomePopup();
    initStudentInfoButton();
    initNavigation();
    initBMICalculator();
    initAppointmentForm();
    initContactForm();
    initScrollAnimations();
    initAccessibility();
});

// Welcome Popup functionality
function initWelcomePopup() {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('wellspring_visited');
    const welcomePopup = document.getElementById('welcomePopup');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    // Only show popup on index.html and if first visit
    if (!hasVisited && window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        // Show popup after a short delay
        setTimeout(() => {
            if (welcomePopup) {
                welcomePopup.classList.add('show');
            }
        }, 500);
        
        // Handle Get Started button click
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', function() {
                // Mark as visited
                localStorage.setItem('wellspring_visited', 'true');
                
                // Hide popup
                welcomePopup.classList.remove('show');
                
                // Remove popup from DOM after animation
                setTimeout(() => {
                    welcomePopup.style.display = 'none';
                }, 300);
            });
        }
        
        // Close popup when clicking outside
        if (welcomePopup) {
            welcomePopup.addEventListener('click', function(e) {
                if (e.target === welcomePopup) {
                    localStorage.setItem('wellspring_visited', 'true');
                    welcomePopup.classList.remove('show');
                    setTimeout(() => {
                        welcomePopup.style.display = 'none';
                    }, 300);
                }
            });
        }
    } else {
        // Hide popup if already visited
        if (welcomePopup) {
            welcomePopup.style.display = 'none';
        }
    }
}

// Student Info Button functionality
function initStudentInfoButton() {
    const studentInfoBtn = document.getElementById('studentInfoBtn');
    const welcomePopup = document.getElementById('welcomePopup');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    // Ensure popup is hidden by default on all pages except during first visit
    if (welcomePopup) {
        // Only show automatically on index page for first-time visitors
        const isIndexPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname === '/' || 
                           window.location.pathname.endsWith('/');
        const hasVisited = localStorage.getItem('wellspring_visited');
        
        if (!isIndexPage || hasVisited) {
            welcomePopup.style.display = 'none';
            welcomePopup.classList.remove('show');
        }
    }
    
    if (studentInfoBtn && welcomePopup) {
        studentInfoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Student Info button clicked'); // Debug log
            
            // Make sure popup is visible
            welcomePopup.style.display = 'flex';
            
            // Add show class with animation after a brief delay
            setTimeout(() => {
                welcomePopup.classList.add('show', 'from-nav');
            }, 10);
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
        
        // Handle close button with animation
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closePopupWithAnimation();
            });
        }
        
        // Close popup when clicking outside
        welcomePopup.addEventListener('click', function(e) {
            if (e.target === welcomePopup) {
                closePopupWithAnimation();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && welcomePopup.classList.contains('show')) {
                closePopupWithAnimation();
            }
        });
        
        // Function to close popup with animation
        function closePopupWithAnimation() {
            welcomePopup.classList.add('closing');
            welcomePopup.classList.remove('show', 'from-nav');
            
            setTimeout(() => {
                welcomePopup.style.display = 'none';
                welcomePopup.classList.remove('closing');
            }, 200);
        }
    } else {
        console.log('Student Info elements not found:', {
            button: !!studentInfoBtn,
            popup: !!welcomePopup
        });
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// BMI Calculator functionality
function initBMICalculator() {
    const bmiForm = document.getElementById('bmiForm');
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBMI();
        });
    }
}

function calculateBMI() {
    // Get form elements
    const heightInput = document.getElementById('height');
    const heightUnit = document.getElementById('heightUnit');
    const weightInput = document.getElementById('weight');
    const errorMessage = document.getElementById('errorMessage');
    const resultsDiv = document.getElementById('results');
    
    // Get values
    let height = parseFloat(heightInput.value);
    const heightUnitValue = heightUnit.value;
    const weight = parseFloat(weightInput.value);
    
    // Validate inputs
    if (!height || !weight || height <= 0 || weight <= 0) {
        showError('Please enter valid height and weight values.');
        return;
    }
    
    // Convert height to meters if needed
    if (heightUnitValue === 'cm') {
        height = height / 100; // Convert cm to meters
    }
    
    // Validate height range (in meters)
    if (height < 0.5 || height > 2.5) {
        showError('Please enter a valid height between 50cm-250cm or 0.5m-2.5m.');
        return;
    }
    
    // Validate weight range
    if (weight < 20 || weight > 300) {
        showError('Please enter a valid weight between 20kg-300kg.');
        return;
    }
    
    // Calculate BMI
    const bmi = weight / (height * height);
    
    // Display results
    displayBMIResult(bmi);
    
    // Hide error message if showing
    hideError();
}

function displayBMIResult(bmi) {
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiDescription = document.getElementById('bmiDescription');
    const resultsDiv = document.getElementById('results');
    const formDiv = document.querySelector('.calculator-form');
    
    // Round BMI to 1 decimal place
    const roundedBMI = bmi.toFixed(1);
    
    // Determine category and description
    let category, description, categoryClass;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        description = `Your BMI is ${roundedBMI} — Underweight`;
        categoryClass = 'underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        description = `Your BMI is ${roundedBMI} — Normal`;
        categoryClass = 'normal';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        description = `Your BMI is ${roundedBMI} — Overweight`;
        categoryClass = 'overweight';
    } else {
        category = 'Obese';
        description = `Your BMI is ${roundedBMI} — Obese`;
        categoryClass = 'obese';
    }
    
    // Update result elements
    bmiValue.textContent = roundedBMI;
    bmiCategory.textContent = category;
    bmiCategory.className = `bmi-category ${categoryClass}`;
    bmiDescription.textContent = description;
    
    // Show results and hide form
    resultsDiv.style.display = 'block';
    formDiv.style.display = 'none';
    
    // Add animation
    resultsDiv.classList.add('fade-in-up');
}

function resetCalculator() {
    const resultsDiv = document.getElementById('results');
    const formDiv = document.querySelector('.calculator-form');
    const bmiForm = document.getElementById('bmiForm');
    
    // Hide results and show form
    resultsDiv.style.display = 'none';
    formDiv.style.display = 'block';
    
    // Reset form
    bmiForm.reset();
    
    // Hide any error messages
    hideError();
    
    // Add animation
    formDiv.classList.add('fade-in-up');
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = errorDiv.querySelector('p');
    
    errorText.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.classList.add('fade-in-up');
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}

// Appointment Form functionality
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateAndSubmitAppointmentForm();
        });
        
        // Set minimum date to today
        const dateInput = document.getElementById('preferredDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

function validateAndSubmitAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate required fields
    const requiredFields = [
        { name: 'firstName', message: 'First name is required' },
        { name: 'lastName', message: 'Last name is required' },
        { name: 'email', message: 'Email address is required' },
        { name: 'phone', message: 'Phone number is required' },
        { name: 'preferredDate', message: 'Preferred date is required' },
        { name: 'consent', message: 'You must consent to data collection' }
    ];
    
    requiredFields.forEach(field => {
        const value = formData.get(field.name);
        if (!value || (field.name === 'consent' && !document.getElementById('consent').checked)) {
            showFieldError(field.name, field.message);
            isValid = false;
        }
    });
    
    // Validate email format
    const email = formData.get('email');
    if (email && !validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone format (Australian format)
    const phone = formData.get('phone');
    if (phone && !validatePhone(phone)) {
        showFieldError('phone', 'Please enter a valid Australian phone number');
        isValid = false;
    }
    
    // Validate date is in the future
    const preferredDate = formData.get('preferredDate');
    if (preferredDate && !validateFutureDate(preferredDate)) {
        showFieldError('preferredDate', 'Please select a future date');
        isValid = false;
    }
    
    // Validate name fields (no numbers)
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    if (firstName && !validateName(firstName)) {
        showFieldError('firstName', 'First name should only contain letters');
        isValid = false;
    }
    if (lastName && !validateName(lastName)) {
        showFieldError('lastName', 'Last name should only contain letters');
        isValid = false;
    }
    
    if (isValid) {
        submitAppointmentForm();
    }
}

function submitAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const successMessage = document.getElementById('successMessage');
    
    // Hide form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.classList.add('fade-in-up');
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    const form = document.getElementById('appointmentForm');
    const successMessage = document.getElementById('successMessage');
    
    // Show form and hide success message
    form.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Reset form
    form.reset();
    clearFormErrors();
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Contact Form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateAndSubmitContactForm();
        });
    }
}

function validateAndSubmitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Clear previous errors
    clearContactFormErrors();
    
    // Validate required fields
    const requiredFields = [
        { name: 'firstName', id: 'contactFirstName', message: 'First name is required' },
        { name: 'lastName', id: 'contactLastName', message: 'Last name is required' },
        { name: 'email', id: 'contactEmail', message: 'Email address is required' },
        { name: 'subject', id: 'contactSubject', message: 'Please select a subject' },
        { name: 'message', id: 'contactMessage', message: 'Message is required' }
    ];
    
    requiredFields.forEach(field => {
        const value = formData.get(field.name);
        if (!value) {
            showContactFieldError(field.id, field.message);
            isValid = false;
        }
    });
    
    // Validate email format
    const email = formData.get('email');
    if (email && !validateEmail(email)) {
        showContactFieldError('contactEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone format if provided
    const phone = formData.get('phone');
    if (phone && phone.trim() !== '' && !validatePhone(phone)) {
        showContactFieldError('contactPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate name fields
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    if (firstName && !validateName(firstName)) {
        showContactFieldError('contactFirstName', 'First name should only contain letters');
        isValid = false;
    }
    if (lastName && !validateName(lastName)) {
        showContactFieldError('contactLastName', 'Last name should only contain letters');
        isValid = false;
    }
    
    // Validate message length
    const message = formData.get('message');
    if (message && message.length < 10) {
        showContactFieldError('contactMessage', 'Message should be at least 10 characters long');
        isValid = false;
    }
    
    if (isValid) {
        submitContactForm();
    }
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccessMessage');
    
    // Hide form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.classList.add('fade-in-up');
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccessMessage');
    
    // Show form and hide success message
    form.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Reset form
    form.reset();
    clearContactFormErrors();
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Validation helper functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Australian phone number format validation
    const phoneRegex = /^(\+61|0)[2-9]\d{8}$|^(\(0[2-9]\)\s?\d{4}\s?\d{4})$|^(0[2-9]\s?\d{4}\s?\d{4})$/;
    const cleanPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone) || /^0[2-9]\d{8}$/.test(cleanPhone);
}

function validateName(name) {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
}

function validateFutureDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return selectedDate >= today;
}

// Error handling functions
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Add error styling to input
    const inputElement = document.getElementById(fieldName);
    if (inputElement) {
        inputElement.style.borderColor = '#ef5350';
    }
}

function showContactFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Add error styling to input
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.style.borderColor = '#ef5350';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    const inputElements = document.querySelectorAll('input, select, textarea');
    
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
    
    inputElements.forEach(element => {
        element.style.borderColor = '#e0e0e0';
    });
}

function clearContactFormErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    const inputElements = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
    
    inputElements.forEach(element => {
        element.style.borderColor = '#e0e0e0';
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animationTargets = document.querySelectorAll(
        '.service-card, .action-item, .service-detail, .category-item, ' +
        '.doctor-card, .facility-item, .activity-item, .faq-item, ' +
        '.contact-method, .hero-content, .hero-image'
    );
    
    animationTargets.forEach(target => {
        observer.observe(target);
    });
}

// Accessibility enhancements
function initAccessibility() {
    // Add skip link functionality
    addSkipLink();
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation();
    
    // Add ARIA labels where needed
    addAriaLabels();
    
    // Handle focus management
    manageFocus();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2c5aa0;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

function enhanceKeyboardNavigation() {
    // Add keyboard support for buttons
    const buttons = document.querySelectorAll('.cta-button, .action-button, .service-cta');
    buttons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add keyboard support for mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

function addAriaLabels() {
    // Add aria-labels to form inputs without labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label')) {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder) {
                input.setAttribute('aria-label', placeholder);
            }
        }
    });
    
    // Add aria-labels to navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', `Navigate to ${link.textContent}`);
        }
    });
}

function manageFocus() {
    // Manage focus for mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                // Menu is now open, focus on first link
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });
    }
    
    // Manage focus for form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (e.defaultPrevented) {
                // Form validation failed, focus on first error
                const firstError = form.querySelector('.error-text[style*="block"]');
                if (firstError) {
                    const errorInput = firstError.previousElementSibling;
                    if (errorInput) {
                        errorInput.focus();
                    }
                }
            }
        });
    });
}

// Utility functions
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Handle browser back button
window.addEventListener('popstate', function(e) {
    // Close mobile menu if open
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', debounce(function() {
    // Close mobile menu when resizing to desktop
    if (window.innerWidth >= 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}, 250));


// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Console message for developers
console.log('%cMelbourne Medical Clinic Website', 'color: #2c5aa0; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped with accessibility and performance in mind', 'color: #4fc3f7; font-size: 12px;');