// EMI Calculator JavaScript

let emiChart = null;

$(document).ready(function() {
    // Sync range sliders with input fields
    $('#loanAmount').on('input', function() {
        $('#loanAmountRange').val($(this).val());
    });
    
    $('#loanAmountRange').on('input', function() {
        $('#loanAmount').val($(this).val());
    });
    
    $('#interestRate').on('input', function() {
        $('#interestRateRange').val($(this).val());
    });
    
    $('#interestRateRange').on('input', function() {
        $('#interestRate').val($(this).val());
    });
    
    $('#loanTenure').on('input', function() {
        $('#loanTenureRange').val($(this).val());
    });
    
    $('#loanTenureRange').on('input', function() {
        $('#loanTenure').val($(this).val());
    });
    
    // Update range max when tenure type changes
    $('#tenureType').on('change', function() {
        if ($(this).val() === 'months') {
            $('#loanTenureRange').attr('max', 360);
        } else {
            $('#loanTenureRange').attr('max', 30);
        }
    });
    
    console.log('EMI Calculator Loaded');
});

function calculateEMI() {
    // Get input values
    const loanAmount = parseFloat($('#loanAmount').val());
    const interestRate = parseFloat($('#interestRate').val());
    let loanTenure = parseFloat($('#loanTenure').val());
    const tenureType = $('#tenureType').val();
    
    // Validate inputs
    if (!validateNumber(loanAmount, 'Loan Amount') || loanAmount < 1000) {
        showError('Please enter a valid Loan Amount (minimum ₹1,000)');
        return;
    }
    
    if (!validateNumber(interestRate, 'Interest Rate') || interestRate <= 0) {
        showError('Please enter a valid Interest Rate');
        return;
    }
    
    if (!validateNumber(loanTenure, 'Loan Tenure') || loanTenure <= 0) {
        showError('Please enter a valid Loan Tenure');
        return;
    }
    
    // Convert tenure to months
    let tenureInMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;
    
    // Calculate EMI using formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const monthlyRate = interestRate / 12 / 100;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    
    // Calculate totals
    const totalAmount = emi * tenureInMonths;
    const totalInterest = totalAmount - loanAmount;
    
    // Display results
    displayEMIResult(emi, loanAmount, totalInterest, totalAmount, tenureInMonths, interestRate);
    
    // Generate payment schedule
    generatePaymentSchedule(loanAmount, emi, monthlyRate, tenureInMonths);
    
    // Show result section
    $('#result').removeClass('hidden').addClass('fade-in');
    
    // Scroll to result
    $('html, body').animate({
        scrollTop: $('#result').offset().top - 100
    }, 500);
}

function displayEMIResult(emi, principal, interest, total, tenure, rate) {
    // Display values
    $('#monthlyEMI').text(formatCurrency(emi));
    $('#principalAmount').text(formatCurrency(principal));
    $('#totalInterest').text(formatCurrency(interest));
    $('#totalAmount').text(formatCurrency(total));
    
    // Display loan period
    const years = Math.floor(tenure / 12);
    const months = tenure % 12;
    let periodText = '';
    if (years > 0) {
        periodText += `${years} Year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
        if (years > 0) periodText += ' ';
        periodText += `${months} Month${months > 1 ? 's' : ''}`;
    }
    $('#loanPeriod').text(periodText);
    $('#displayRate').text(rate.toFixed(2));
    
    // Create/Update Chart
    createEMIChart(principal, interest);
}

function createEMIChart(principal, interest) {
    const ctx = document.getElementById('emiChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (emiChart) {
        emiChart.destroy();
    }
    
    emiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(239, 68, 68, 0.8)'    // Red
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        font: {
                            size: 14
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            label += ` (${percentage}%)`;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function generatePaymentSchedule(principal, emi, monthlyRate, tenure) {
    let balance = principal;
    let scheduleHTML = '';
    
    // Show only first 12 months and last 12 months if tenure > 24
    const showAll = tenure <= 24;
    
    for (let month = 1; month <= tenure; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = emi - interest;
        balance -= principalPaid;
        
        // Ensure balance doesn't go negative due to rounding
        if (balance < 0) balance = 0;
        
        // Skip middle months if tenure > 24
        if (!showAll && month > 12 && month <= tenure - 12) {
            if (month === 13) {
                scheduleHTML += `
                    <tr class="border-t">
                        <td colspan="5" class="p-2 text-center text-gray-500 italic">
                            ... ${tenure - 24} months omitted ...
                        </td>
                    </tr>
                `;
            }
            continue;
        }
        
        scheduleHTML += `
            <tr class="border-t hover:bg-gray-50">
                <td class="p-2">${month}</td>
                <td class="p-2 text-right">${formatCurrency(emi)}</td>
                <td class="p-2 text-right">${formatCurrency(principalPaid)}</td>
                <td class="p-2 text-right">${formatCurrency(interest)}</td>
                <td class="p-2 text-right">${formatCurrency(balance)}</td>
            </tr>
        `;
    }
    
    $('#scheduleTableBody').html(scheduleHTML);
}

function togglePaymentSchedule() {
    $('#paymentSchedule').toggleClass('hidden');
    if (!$('#paymentSchedule').hasClass('hidden')) {
        $('html, body').animate({
            scrollTop: $('#paymentSchedule').offset().top - 100
        }, 500);
    }
}

function resetForm() {
    // Reset to default values
    $('#loanAmount').val('500000');
    $('#loanAmountRange').val('500000');
    $('#interestRate').val('8.5');
    $('#interestRateRange').val('8.5');
    $('#loanTenure').val('10');
    $('#loanTenureRange').val('10');
    $('#tenureType').val('years');
    
    // Hide results
    $('#result').addClass('hidden');
    $('#paymentSchedule').addClass('hidden');
    
    // Clear error
    $('#error-container').addClass('hidden').html('');
    
    // Destroy chart
    if (emiChart) {
        emiChart.destroy();
        emiChart = null;
    }
    
    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Allow Enter key to calculate
$('#loanAmount, #interestRate, #loanTenure').on('keypress', function(e) {
    if (e.which === 13) {
        calculateEMI();
    }
});
