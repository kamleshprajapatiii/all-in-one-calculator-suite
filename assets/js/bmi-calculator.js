// BMI Calculator JavaScript

$(document).ready(function() {
    console.log('BMI Calculator Loaded');
});

function calculateBMI() {
    // Get input values
    const gender = $('input[name="gender"]:checked').val();
    const age = parseFloat($('#age').val());
    const weight = parseFloat($('#weight').val());
    const weightUnit = $('#weightUnit').val();
    const height = parseFloat($('#height').val());
    const heightUnit = $('#heightUnit').val();
    
    // Validate inputs
    if (!validateNumber(age, 'Age') || age < 1 || age > 120) {
        showError('Please enter a valid age (1-120)');
        return;
    }
    
    if (!validateNumber(weight, 'Weight') || weight <= 0) {
        showError('Please enter a valid weight');
        return;
    }
    
    if (!validateNumber(height, 'Height') || height <= 0) {
        showError('Please enter a valid height');
        return;
    }
    
    // Convert weight to kg
    let weightInKg = weight;
    if (weightUnit === 'lbs') {
        weightInKg = weight * 0.453592;
    }
    
    // Convert height to meters
    let heightInMeters = height;
    if (heightUnit === 'cm') {
        heightInMeters = height / 100;
    } else if (heightUnit === 'ft') {
        heightInMeters = height * 0.3048;
    } else if (heightUnit === 'in') {
        heightInMeters = height * 0.0254;
    }
    
    // Calculate BMI
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    // Get BMI category and recommendation
    const category = getBMICategory(bmi);
    const recommendation = getRecommendation(bmi, category);
    
    // Calculate ideal weight range
    const idealWeightRange = calculateIdealWeight(heightInMeters, weightUnit);
    
    // Display result
    displayBMIResult(bmi, category, recommendation, idealWeightRange);
    
    // Show result section
    $('#result').removeClass('hidden').addClass('fade-in');
    
    // Scroll to result
    $('html, body').animate({
        scrollTop: $('#result').offset().top - 100
    }, 500);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return {
            name: 'Underweight',
            color: 'text-blue-200',
            bgColor: 'bg-blue-400'
        };
    } else if (bmi >= 18.5 && bmi < 25) {
        return {
            name: 'Normal Weight',
            color: 'text-green-200',
            bgColor: 'bg-green-400'
        };
    } else if (bmi >= 25 && bmi < 30) {
        return {
            name: 'Overweight',
            color: 'text-yellow-200',
            bgColor: 'bg-yellow-400'
        };
    } else {
        return {
            name: 'Obese',
            color: 'text-red-200',
            bgColor: 'bg-red-400'
        };
    }
}

function getRecommendation(bmi, category) {
    const recommendations = {
        'Underweight': 'You may need to gain weight. Consult with a healthcare provider for a personalized nutrition plan. Focus on nutrient-rich foods and strength training.',
        'Normal Weight': 'Great! You have a healthy weight. Maintain your current lifestyle with regular exercise and balanced diet.',
        'Overweight': 'You may benefit from losing some weight. Consider increasing physical activity and following a balanced, calorie-controlled diet.',
        'Obese': 'It is recommended to lose weight for better health. Please consult with a healthcare provider for a personalized weight loss plan.'
    };
    
    return recommendations[category.name];
}

function calculateIdealWeight(heightInMeters, weightUnit) {
    // Using BMI range of 18.5 to 24.9 for ideal weight
    const minWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxWeight = 24.9 * (heightInMeters * heightInMeters);
    
    if (weightUnit === 'lbs') {
        return `${(minWeight * 2.20462).toFixed(1)} - ${(maxWeight * 2.20462).toFixed(1)} lbs`;
    } else {
        return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`;
    }
}

function displayBMIResult(bmi, category, recommendation, idealWeight) {
    // Display BMI value
    $('#bmiValue').text(bmi.toFixed(1));
    
    // Display category
    $('#bmiCategory').text(category.name);
    
    // Update indicator position
    let position = 0;
    if (bmi < 18.5) {
        position = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
        position = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
        position = 50 + ((bmi - 25) / (30 - 25)) * 25;
    } else {
        position = 75 + Math.min(((bmi - 30) / 10) * 25, 24);
    }
    
    $('#bmiIndicator').css('left', position + '%');
    
    // Display ideal weight
    $('#idealWeight').text(idealWeight);
    
    // Display recommendation
    $('#recommendationText').text(recommendation);
}

function resetForm() {
    // Clear inputs
    $('#age').val('');
    $('#weight').val('');
    $('#height').val('');
    $('input[name="gender"]').first().prop('checked', true);
    $('#weightUnit').val('kg');
    $('#heightUnit').val('cm');
    
    // Hide result
    $('#result').addClass('hidden');
    
    // Clear error
    $('#error-container').addClass('hidden').html('');
    
    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Allow Enter key to calculate
$('#age, #weight, #height').on('keypress', function(e) {
    if (e.which === 13) {
        calculateBMI();
    }
});
