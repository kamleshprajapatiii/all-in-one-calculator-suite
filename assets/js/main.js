// Main JavaScript File for All-in-One Calculator Suite

$(document).ready(function() {
    
    // Add fade-in animation to cards
    $('.grid > div').each(function(index) {
        $(this).delay(100 * index).queue(function(next) {
            $(this).addClass('fade-in');
            next();
        });
    });

    // Console log for debugging
    console.log('All-in-One Calculator Suite - Main JS Loaded');

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
    });

    // Add active state to navigation
    $('.nav-link').on('click', function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

});

// Utility Functions

// Show Loading Spinner
function showLoading(elementId) {
    $(`#${elementId}`).html('<div class="spinner mx-auto"></div>');
}

// Hide Loading Spinner
function hideLoading(elementId) {
    $(`#${elementId}`).html('');
}

// Show Error Message
function showError(message, elementId = 'error-container') {
    const errorHtml = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle mr-2"></i>
            ${message}
        </div>
    `;
    $(`#${elementId}`).html(errorHtml).show();
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        $(`#${elementId}`).fadeOut();
    }, 5000);
}

// Show Success Message
function showSuccess(message, elementId = 'success-container') {
    const successHtml = `
        <div class="success-message">
            <i class="fas fa-check-circle mr-2"></i>
            ${message}
        </div>
    `;
    $(`#${elementId}`).html(successHtml).show();
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        $(`#${elementId}`).fadeOut();
    }, 5000);
}

// Validate Number Input
function validateNumber(value, fieldName = 'Field') {
    if (value === '' || isNaN(value)) {
        showError(`Please enter a valid ${fieldName}`);
        return false;
    }
    return true;
}

// Validate Date Input
function validateDate(dateString, fieldName = 'Date') {
    if (!dateString) {
        showError(`Please select a valid ${fieldName}`);
        return false;
    }
    return true;
}

// Format Number with Commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format Currency (Indian Rupees)
function formatCurrency(amount) {
    return '₹' + formatNumber(Math.round(amount));
}

// Clear Result
function clearResult(elementId) {
    $(`#${elementId}`).html('').hide();
}

// Print Result
function printResult() {
    window.print();
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Copied to clipboard!');
    }).catch(err => {
        showError('Failed to copy!');
    });
}
