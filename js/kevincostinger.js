"use strict";
/*******************************************************
 *     kevincostinger.js - 100p.
 *
 *     This is Kevin. Kevin keeps track of your expenses
 *     and costs. To add an expense, pick a date, declare
 *     the amount and add a short description.
 *
 *     When you submit the form, all fields are validated.
 *     If Kevin is not happy with your inputs, the least
 *     he will do is, bring you back to the field where
 *     you made a mistake. But who knows? Maybe he can
 *     even provide some excellent User experience?
 *     (+5 Bonus points available)
 *
 *     These are the rules for the form validation:
 *      - Date is valid, if it's not empty.
 *      - Amount is valid, if it's at least 0.01.
 *      - Text is valid, if it's at least 3 letters long.
 *
 *     If everything is okay, Kevin adds a new table row,
 *     containing the expense. The table row also contains
 *     a button, which deletes the expense, once you click
 *     it. After adding a table row, the form is reset and
 *     ready for the next input.
 *
 *     At the bottom of the expense tracker, you can see
 *     a small number. It represents the sum of all expenses,
 *     which are currently tracked. It is always accurate!
 *
 *     Have a look at the pictures provided. They demonstrate
 *     how the software looks like. Notice the details, like
 *     the perfectly formatted currency! Isn't that great?
 *
 *     By the way...
 *     Kevin is a clean guy. He is free of code duplications.
 *     Kevin defines his quality by using functions and
 *     events, to keep his sourcecode clean af. He understands
 *     the scope of his variables and of course, makes use of
 *     event delegation, to keep his event listeners tidied up!
 *
 *     Srithi - 2026-04-14
 *******************************************************/
let sumExpenses = 0; //Use this variable to keep the sum up to date.

function validateExpense(date, amount, text) {
    // Date validation (date must be chosen)
    if (isEmpty(date)) {
        return {
            isValid: false,
            focusElement: 'date',
            errorMessage: 'Please select a date.'
        };
    }

    // Amount validation (at least 0.01)
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0.01) {
        return {
            isValid: false,
            focusElement: 'amount',
            errorMessage: 'Amount must be at least €0,01.'
        };
    }

    // Text validation (at least 3 char long)
    if (isEmpty(text) || text.trim().length < 3) {
        return {
            isValid: false,
            focusElement: 'expense',
            errorMessage: 'Expense description must be at least 3 characters long.'
        };
    }

    return {
        isValid: true,
        focusElement: null,
        errorMessage: null
    };
}


// Updates the displayed sum of all expenses
function updateSumDisplay() {
    const expenseSumSpan = document.getElementById('expenseSum');
    if (expenseSumSpan) {
        expenseSumSpan.textContent = formatEuro(sumExpenses);
    }
}

//Adds a new expense row to the table
function addExpenseToTable(date, amount, text) {
    const tbody = document.querySelector('#expenses tbody');
    if (!tbody) return;

    // Create new row
    const newRow = tbody.insertRow();

    // Date cell
    const dateCell = newRow.insertCell(0);
    dateCell.textContent = date;

    // Amount cell
    const amountCell = newRow.insertCell(1);
    amountCell.textContent = formatEuro(parseFloat(amount));
    amountCell.className = 'amount-cell';

    // Expense text cell
    const textCell = newRow.insertCell(2);
    textCell.textContent = text.trim();

    // Delete button cell
    const deleteCell = newRow.insertCell(3);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteCell.appendChild(deleteBtn);
}

// Resets the form fields to empty state
function resetFormFields(form) {
    if (!form) return;
    form.reset();
}

// Shows an error message
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remove any existing error message for this field
    removeFieldError(fieldId);

    // Create error message element
    const errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    errorSpan.style.color = '#ff0000';
    errorSpan.style.fontSize = '0.8em';
    errorSpan.style.marginLeft = '10px';
    errorSpan.textContent = message;

    // Add error styling to input field
    field.classList.add('input-error');
    field.style.borderColor = '#ff0000';
    field.style.backgroundColor = '#ffd8d8';

    // Insert error message after the field
    field.parentNode.insertBefore(errorSpan, field.nextSibling);
}

// Removes error message from a specific field
function removeFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remove error class and styles
    field.classList.remove('input-error');
    field.style.borderColor = '';
    field.style.backgroundColor = '';

    // Remove error message span if exists
    const nextSibling = field.nextSibling;
    if (nextSibling && nextSibling.className === 'field-error') {
        nextSibling.remove();
    }
}

// Clears all field errors in the form
function clearAllFieldErrors() {
    const fields = ['date', 'amount', 'expense'];
    fields.forEach(fieldId => removeFieldError(fieldId));
}

// Handles form submission - validates, adds expense, updates sum
function submitForm(e){
    //TODO: Prevent the default behavior of the submit button.
    e.preventDefault();

    // Get form values
    const dateInput = document.getElementById('date');
    const amountInput = document.getElementById('amount');
    const expenseInput = document.getElementById('expense');

    const date = dateInput ? dateInput.value : '';
    const amount = amountInput ? amountInput.value : '';
    const text = expenseInput ? expenseInput.value : '';

    // Clear any previous error messages
    clearAllFieldErrors();

    //TODO: Validate the form. If everything is fine, add the expense to the tracker and reset the form.
    const validation = validateExpense(date, amount, text);

    // If validation fails, show error and highlight the problematic field
    if (!validation.isValid) {
        if (validation.focusElement) {
            showFieldError(validation.focusElement, validation.errorMessage);
        }
        return;
    }

    // All valid
    const amountNum = parseFloat(amount);

    // Update the total sum
    sumExpenses += amountNum;

    // Add new row to the table
    addExpenseToTable(date, amountNum, text);

    // Update the sum display
    updateSumDisplay();

    // Reset the form for next input
    const form = document.querySelector('form');
    resetFormFields(form);
}

// Handles deletion of expenses using event delegation
function handleDeleteExpense(e) {
    // Event delegation: check if the clicked element is a delete button
    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;

    // Get the row containing the delete button
    const row = deleteBtn.closest('tr');
    if (!row) return;

    // Get the amount cell
    const amountCell = row.cells[1];
    if (!amountCell) return;

    // Extract the numeric amount from the formatted currency text
    const amountText = amountCell.textContent;
    // Remove '€', replace '.' and convert ',' to '.'
    const cleanAmount = amountText.replace('€', '').trim();
    // Handle thousand separators and decimal comma
    let numericValue;
    if (cleanAmount.includes(',') && cleanAmount.includes('.')) {
        // Format like "1.234,56" - remove dots, replace comma with dot
        numericValue = parseFloat(cleanAmount.replace(/\./g, '').replace(',', '.'));
    } else if (cleanAmount.includes(',')) {
        // Format like "10,50"
        numericValue = parseFloat(cleanAmount.replace(',', '.'));
    } else {
        numericValue = parseFloat(cleanAmount);
    }

    if (!isNaN(numericValue)) {
        // Subtract the expense amount from the total sum
        sumExpenses -= numericValue;
        updateSumDisplay();
    }

    // Remove the row from the table
    row.remove();
}

// Set up event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the form and attach submit event listener
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', submitForm);
    }

    // Use event delegation for delete buttons on the expenses table
    const expensesTable = document.getElementById('expenses');
    if (expensesTable) {
        expensesTable.addEventListener('click', handleDeleteExpense);
    }

    // Initialize sum display
    updateSumDisplay();

    // Add focus event listeners to clear errors when user starts typing
    const dateField = document.getElementById('date');
    const amountField = document.getElementById('amount');
    const expenseField = document.getElementById('expense');

    // For amount field, also provide better UX: ensure at least 0.01 on blur
    if (amountField) {
        amountField.addEventListener('blur', function() {
            let value = parseFloat(this.value);
            if (!isNaN(value) && value > 0 && value < 0.01) {
                showFieldError('amount', 'Amount must be at least €0.01.');
            } else if (!isEmpty(this.value) && (isNaN(value) || value < 0.01)) {
                // Only show error if there's some input but invalid
                if (!isEmpty(this.value)) {
                    showFieldError('amount', 'Amount must be at least €0.01.');
                }
            } else {
                removeFieldError('amount');
            }
        });
    }
});

/*****************************
 * DO NOT CHANGE CODE BELOW.
 * USE IT.
 ****************************/


/*******************************************************
 *     Checks if variable is empty
 *     @param {any} variable - Variable which you want to check.
 *     @return {Boolean} Empty or not.
 ******************************************************/
let isEmpty = function(variable) {
    if(Array.isArray(variable))
        return (variable.length === 0);
    else if(typeof variable === "object")
        return (Object.entries(variable).length === 0);
    else
        return (typeof variable === "undefined" || variable == null || variable === "");
};

/*******************************************************
 *     Converts number into currency string.
 *     @param {Number} number - Any numeric value.
 *     @return {String} Well formatted currency string.
 ******************************************************/
function formatEuro(number) {
    return number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}
