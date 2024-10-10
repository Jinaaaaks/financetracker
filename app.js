// Initialize transactions and goals arrays
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Elements
const transactionForm = document.getElementById('transaction-form');
const goalForm = document.getElementById('goal-form');
const transactionsList = document.getElementById('transactions');
const goalsList = document.getElementById('goals');
const currentBalanceEl = document.getElementById('current-balance');

// Add a transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    // Validate input
    if (!description || isNaN(amount) || !date || !type) {
        alert('Please fill out all fields.');
        return;
    }

    const transaction = {
        description,
        amount,
        date,
        type
    };

    transactions.push(transaction);
    updateTransactions();
    updateBalance();
    saveData();

    transactionForm.reset();
});

// Set a financial goal
goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = document.getElementById('goal-description').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);
    const date = document.getElementById('goal-date').value;

    if (!description || isNaN(amount) || !date) {
        alert('Please fill out all fields.');
        return;
    }

    const goal = {
        description,
        amount,
        targetDate: date,
        currentSavings: 0
    };

    goals.push(goal);
    updateGoals();
    saveData();

    goalForm.reset();
});

// Update the transaction list
function updateTransactions() {
    transactionsList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.textContent = `${transaction.type}: $${transaction.amount} on ${transaction.date} - ${transaction.description}`;
        transactionsList.appendChild(li);
    });
}

// Calculate and update the balance
function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    currentBalanceEl.textContent = `$${balance.toFixed(2)}`;
}

// Update the goals list
function updateGoals() {
    goalsList.innerHTML = '';
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.textContent = `${goal.description}: Save $${goal.amount} by ${goal.targetDate} (Current Savings: $${goal.currentSavings})`;
        goalsList.appendChild(li);
    });
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('goals', JSON.stringify(goals));
}

// Load existing data on page load
window.onload = function () {
    updateTransactions();
    updateBalance();
    updateGoals();
};
