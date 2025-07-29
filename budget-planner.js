document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');
    const incomeTableBody = document.getElementById('income-table-body');
    const expenseTableBody = document.getElementById('expense-table-body');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    }

    function addTransactionDOM(transaction) {
        const item = document.createElement('tr');
        item.innerHTML = `
            <td>${transaction.description}</td>
            <td>${formatCurrency(transaction.amount)}</td>
            <td><button class="delete-btn" data-id="${transaction.id}">X</button></td>
        `;

        if (transaction.type === 'income') {
            incomeTableBody.appendChild(item);
        } else {
            expenseTableBody.appendChild(item);
        }
    }

    function updateValues() {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        const balance = income - expenses;

        totalIncomeEl.textContent = formatCurrency(income);
        totalExpensesEl.textContent = formatCurrency(expenses);
        balanceEl.textContent = formatCurrency(balance);
    }

    function init() {
        incomeTableBody.innerHTML = '';
        expenseTableBody.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
    }

    function addTransaction(e) {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = +document.getElementById('amount').value;
        const type = document.getElementById('type').value;

        if (description.trim() === '' || amount === 0) {
            alert('Please add a description and amount');
            return;
        }

        const transaction = {
            id: generateID(),
            description,
            amount,
            type
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    }

    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }

    function removeTransaction(id) {
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        init();
    }

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    transactionForm.addEventListener('submit', addTransaction);

    incomeTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            removeTransaction(Number(e.target.dataset.id));
        }
    });

    expenseTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            removeTransaction(Number(e.target.dataset.id));
        }
    });

    init();
});
