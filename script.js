// Function to validate if input is numeric
function isNumeric(input) {
    const regex = /^\d+$/;
    return regex.test(input);
}

// Object mapping field names to error icon IDs
const errorIconIdByFieldName = {
    'annualIncome': 'annualIncomeErrorIcon',
    'grossIncome': 'grossIncomeErrorIcon',
    'deduction': 'deductionErrorIcon',
    'age': 'ageErrorIcon'
};

// Object mapping age ranges to deduction percentages
const deductionPercentByAge = {
    'age < 40': 30,
    'age ≥ 40 but < 60': 40,
    'age ≥ 60': 10
};

// Main function to calculate total income and handle form submission
function calculateTotalIncome(formData) {
    const nonTaxable = 800000;
    const formObject = {};

    // Extract form data into an object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Validate numeric fields
    const numberKeys = ['annualIncome', 'grossIncome', 'deduction'];
    for (const key of numberKeys) {
        if (!formObject[key] || !isNumeric(formObject[key])) {
            document.getElementById(errorIconIdByFieldName[key]).style.opacity = 1;
            return null;
        }
    }

    // Validate age field
    if (!formObject.age || !deductionPercentByAge.hasOwnProperty(formObject.age)) {
        document.getElementById(errorIconIdByFieldName['age']).style.opacity = 1;
        return null;
    }

    // Calculate total income and check if deduction is applied
    let totalIncome = Number(formObject.annualIncome) + Number(formObject.grossIncome) - Number(formObject.deduction);
    let isDeductionApplied = totalIncome > nonTaxable;
    if (isDeductionApplied) {
        const totalDeduction = (totalIncome - nonTaxable) * (deductionPercentByAge[formObject.age] / 100);
        totalIncome -= Math.round(totalDeduction);
    }

    return { totalIncome, isDeductionApplied };
}

// Function to display result on the page
function displayResult(totalIncome, isDeductionApplied) {
    document.getElementById('result').style.display = 'flex';
    document.getElementById('resultText').textContent = totalIncome;
    document.getElementById('deductionStatus').textContent = isDeductionApplied ? 'After tax deduction' : 'No tax';
}

// Function called on form submission
function incomeAfterTax(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = calculateTotalIncome(formData);
    if (result !== null) {
        displayResult(result.totalIncome, result.isDeductionApplied);
    }
}

// Function to reset form and hide result
function handleClose() {
    document.getElementById('result').style.display = 'none';
    const form = document.getElementById("myForm");
    form.reset();
}

// Function to handle change events and hide error icons
function onChangeHandler(errorIconId) {
    document.getElementById(errorIconId).style.opacity = 0;
}
