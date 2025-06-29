//  Dark Mode Toggle
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

//  State Initialization
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

//  Add Transaction
document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const desc = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    const transaction = { id: Date.now(), desc, amount, date, type };
    transactions.push(transaction);

    saveTransactions();
    renderTransactions();
    updateBalance();
    e.target.reset();
});

//  Set Finance Goal
document.getElementById('goal-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const desc = document.getElementById('goal-description').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);
    const date = document.getElementById('goal-date').value;

    const goal = {
        id: Date.now(),
        desc,
        target: amount,
        date,
        saved: 0
    };

    goals.push(goal);
    saveGoals();
    renderGoals();
    e.target.reset();
});

//  Save to Local Storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

//  Update Current Balance
function updateBalance() {
    const balance = transactions.reduce((acc, item) => {
        return item.type === 'income' ? acc + item.amount : acc - item.amount;
    }, 0);
    document.getElementById('current-balance').textContent = `Rs${balance.toFixed(2)}`;
}

//  Render Transactions
function renderTransactions() {
    const list = document.getElementById('transactions');
    list.innerHTML = ''; 

    transactions.forEach(item => {
        const li = document.createElement('li');
        li.classList.add(item.type);

        li.innerHTML = `
            <div>
                <strong>${item.desc}</strong><br/>
                <small>${item.date}</small><br/>
                <span>Rs${item.amount.toFixed(2)}</span>
            </div>
            <button onclick="deleteTransaction(${item.id})">🗑</button>
        `;
        list.appendChild(li);
    });
}

// Delete a Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    saveTransactions();
    renderTransactions();
    updateBalance();
}

// Render Goals + Progress Bars
function renderGoals() {
    const list = document.getElementById('goals');
    list.innerHTML = '';

    goals.forEach(goal => {
        const li = document.createElement('li');
        const percent = Math.min((goal.saved / goal.target) * 100, 100).toFixed(1);

        li.innerHTML = `
            <div>
                <strong>${goal.desc}</strong><br/>
                <small>Target: Rs${goal.target} by ${goal.date}</small>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percent}%"></div>
                </div>
                <small>${percent}% saved</small>
                <div class="savings-update">
                    <input type="number" placeholder="Add Rs" min="0" />
                    <button onclick="addSaving(${goal.id}, this)">➕</button>
                </div>
                ${percent >= 100 ? `<div class="badge">Goal Reached 🎉</div>` : ''}
            </div>
        `;
        list.appendChild(li);
    });
}

//  Add Savings to Goal
function addSaving(goalId, btn) {
    const input = btn.previousElementSibling;
    const value = parseFloat(input.value);

    if (isNaN(value) || value <= 0) return; //

    const goal = goals.find(g => g.id === goalId);
    goal.saved += value;

    saveGoals();
    renderGoals();
}

//  Clear All Data
document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Clear all data?')) {
        localStorage.removeItem('transactions');
        localStorage.removeItem('goals');
        transactions = [];
        goals = [];
        renderTransactions();
        renderGoals();
        updateBalance();
    }
});

//  Initial Load
renderTransactions();
renderGoals();
updateBalance();
