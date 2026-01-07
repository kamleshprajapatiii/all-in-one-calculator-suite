// Date Difference Calculator JavaScript

$(document).ready(function() {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    $('#fromDate').val(today.toISOString().split('T')[0]);
    $('#toDate').val(tomorrow.toISOString().split('T')[0]);
    
    console.log('Date Difference Calculator Loaded');
});

function calculateDateDifference() {
    // Get input values
    const fromDateInput = $('#fromDate').val();
    const toDateInput = $('#toDate').val();
    const excludeEndDate = $('#excludeEndDate').is(':checked');
    
    // Validate dates
    if (!validateDate(fromDateInput, 'From Date')) {
        return;
    }
    
    if (!validateDate(toDateInput, 'To Date')) {
        return;
    }
    
    // Parse dates
    const fromDate = new Date(fromDateInput);
    const toDate = new Date(toDateInput);
    
    // Validate that from date is not after to date
    if (fromDate > toDate) {
        showError('From Date cannot be after To Date!');
        return;
    }
    
    // Calculate difference
    const difference = calculateDetailedDifference(fromDate, toDate, excludeEndDate);
    
    // Display result
    displayDateDifferenceResult(difference, fromDate, toDate);
    
    // Show result section
    $('#result').removeClass('hidden').addClass('fade-in');
    
    // Scroll to result
    $('html, body').animate({
        scrollTop: $('#result').offset().top - 100
    }, 500);
}

function calculateDetailedDifference(fromDate, toDate, excludeEndDate) {
    // Adjust for exclude end date
    let adjustedToDate = new Date(toDate);
    if (excludeEndDate) {
        adjustedToDate.setDate(adjustedToDate.getDate() - 1);
    }
    
    // Calculate years, months, days
    let years = adjustedToDate.getFullYear() - fromDate.getFullYear();
    let months = adjustedToDate.getMonth() - fromDate.getMonth();
    let days = adjustedToDate.getDate() - fromDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(adjustedToDate.getFullYear(), adjustedToDate.getMonth(), 0);
        days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total values
    const totalDays = Math.floor((adjustedToDate - fromDate) / (1000 * 60 * 60 * 24)) + (excludeEndDate ? 0 : 1);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    
    return {
        years,
        months,
        days,
        totalDays,
        totalWeeks,
        totalMonths,
        totalHours,
        totalMinutes,
        totalSeconds
    };
}

function displayDateDifferenceResult(difference, fromDate, toDate) {
    // Main difference display
    let mainText = '';
    if (difference.years > 0) {
        mainText += `${difference.years} Year${difference.years > 1 ? 's' : ''}, `;
    }
    if (difference.months > 0) {
        mainText += `${difference.months} Month${difference.months > 1 ? 's' : ''}, `;
    }
    mainText += `${difference.days} Day${difference.days !== 1 ? 's' : ''}`;
    
    $('#mainDifference').text(mainText);
    
    // Individual values
    $('#years').text(difference.years);
    $('#months').text(difference.months);
    $('#days').text(difference.days);
    
    // Total values
    $('#totalDays').text(formatNumber(difference.totalDays));
    $('#totalWeeks').text(formatNumber(difference.totalWeeks));
    $('#totalMonths').text(formatNumber(difference.totalMonths));
    $('#totalHours').text(formatNumber(difference.totalHours));
    $('#totalMinutes').text(formatNumber(difference.totalMinutes));
    $('#totalSeconds').text(formatNumber(difference.totalSeconds));
    
    // Date displays
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#fromDateDisplay').text(fromDate.toLocaleDateString('en-US', options));
    $('#toDateDisplay').text(toDate.toLocaleDateString('en-US', options));
}

function setQuickDate(days) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);
    
    $('#fromDate').val(today.toISOString().split('T')[0]);
    $('#toDate').val(futureDate.toISOString().split('T')[0]);
    
    // Auto calculate
    calculateDateDifference();
}

function resetForm() {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    $('#fromDate').val(today.toISOString().split('T')[0]);
    $('#toDate').val(tomorrow.toISOString().split('T')[0]);
    $('#excludeEndDate').prop('checked', false);
    
    // Hide result
    $('#result').addClass('hidden');
    
    // Clear error
    $('#error-container').addClass('hidden').html('');
    
    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Allow Enter key to calculate
$('#fromDate, #toDate').on('keypress', function(e) {
    if (e.which === 13) {
        calculateDateDifference();
    }
});
