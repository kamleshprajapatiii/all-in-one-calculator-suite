// Age Calculator JavaScript

$(document).ready(function() {
    // Set max date for DOB as today
    const today = new Date().toISOString().split('T')[0];
    $('#dob').attr('max', today);
    
    // Set default current date as today
    $('#currentDate').val(today);
    
    console.log('Age Calculator Loaded');
});

function calculateAge() {
    // Get input values
    const dobInput = $('#dob').val();
    const currentDateInput = $('#currentDate').val() || new Date().toISOString().split('T')[0];
    
    // Validate DOB
    if (!validateDate(dobInput, 'Date of Birth')) {
        return;
    }
    
    // Parse dates
    const dob = new Date(dobInput);
    const currentDate = new Date(currentDateInput);
    
    // Validate that DOB is not in future
    if (dob > currentDate) {
        showError('Date of Birth cannot be in the future!');
        return;
    }
    
    // Calculate age
    const ageResult = calculateDetailedAge(dob, currentDate);
    
    // Display result
    displayAgeResult(ageResult);
    
    // Show result section
    $('#result').removeClass('hidden').addClass('fade-in');
    
    // Scroll to result
    $('html, body').animate({
        scrollTop: $('#result').offset().top - 100
    }, 500);
}

function calculateDetailedAge(dob, currentDate) {
    let years = currentDate.getFullYear() - dob.getFullYear();
    let months = currentDate.getMonth() - dob.getMonth();
    let days = currentDate.getDate() - dob.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total values
    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((currentDate - dob) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    // Calculate next birthday
    let nextBirthday = new Date(currentDate.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < currentDate) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.floor((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));
    
    return {
        years,
        months,
        days,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        nextBirthday: `${daysToNextBirthday} days`,
        nextBirthdayDate: nextBirthday.toDateString()
    };
}

function displayAgeResult(result) {
    // Main age display
    $('#mainAge').text(`${result.years} Years, ${result.months} Months, ${result.days} Days`);
    
    // Individual values
    $('#years').text(result.years);
    $('#months').text(result.months);
    $('#days').text(result.days);
    
    // Total values
    $('#totalMonths').text(formatNumber(result.totalMonths));
    $('#totalWeeks').text(formatNumber(result.totalWeeks));
    $('#totalDays').text(formatNumber(result.totalDays));
    $('#totalHours').text(formatNumber(result.totalHours));
    $('#totalMinutes').text(formatNumber(result.totalMinutes));
    $('#nextBirthday').text(`${result.nextBirthday} (${result.nextBirthdayDate})`);
}

function resetForm() {
    // Clear inputs
    $('#dob').val('');
    $('#currentDate').val(new Date().toISOString().split('T')[0]);
    
    // Hide result
    $('#result').addClass('hidden');
    
    // Clear error
    $('#error-container').addClass('hidden').html('');
    
    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Allow Enter key to calculate
$('#dob, #currentDate').on('keypress', function(e) {
    if (e.which === 13) {
        calculateAge();
    }
});
