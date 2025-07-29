document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const backToHomeButton = document.getElementById('back-to-home');
    const checklistPage = document.getElementById('checklist-page');
    const homePage = document.getElementById('home-page');
    const checklistTitle = document.getElementById('checklist-title');
    const checklistContainer = document.getElementById('checklist-container');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const totalTasksSpan = document.getElementById('total-tasks');
    const progressBar = document.querySelector('.progress-bar');

    let currentCategory = '';
    let checklists = {};

    // Fetch checklist data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            checklists = data;
        });

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageId) {
                btn.classList.add('active');
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showPage(button.dataset.page);
        });
    });

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            checklistTitle.textContent = `${currentCategory} Preparation`;
            loadChecklist(currentCategory);
            showPage('checklist-page');
        });
    });

    backToHomeButton.addEventListener('click', () => {
        showPage('home-page');
    });

    function loadChecklist(category) {
        const tasks = checklists[category] || [];
        checklistContainer.innerHTML = '';
        totalTasksSpan.textContent = tasks.length;
        let completedCount = 0;

        const savedState = JSON.parse(localStorage.getItem(`checklist_${category}`)) || {};

        tasks.forEach((task, index) => {
            const isCompleted = savedState[index] === true;
            if (isCompleted) {
                completedCount++;
            }
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            if (isCompleted) {
                taskElement.classList.add('completed');
            }
            taskElement.innerHTML = `
                <input type="checkbox" id="task-${index}" data-index="${index}" ${isCompleted ? 'checked' : ''}>
                <label for="task-${index}">${task.title}</label>
            `;
            checklistContainer.appendChild(taskElement);
        });

        updateProgress(completedCount, tasks.length);

        checklistContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                const isChecked = e.target.checked;
                const taskElement = e.target.parentElement;

                if (isChecked) {
                    taskElement.classList.add('completed');
                    completedCount++;
                } else {
                    taskElement.classList.remove('completed');
                    completedCount--;
                }

                const currentState = JSON.parse(localStorage.getItem(`checklist_${category}`)) || {};
                currentState[index] = isChecked;
                localStorage.setItem(`checklist_${category}`, JSON.stringify(currentState));

                updateProgress(completedCount, tasks.length);
            });
        });
    }

    function updateProgress(completed, total) {
        completedTasksSpan.textContent = completed;
        totalTasksSpan.textContent = total;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
    }

    const consultationForm = document.getElementById('consultation-form');
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real app, you'd send this to a server.
        // For now, we'll just show an alert.
        alert(`Thank you, ${name}! Your message has been sent. We will contact you at ${email}.`);
        consultationForm.reset();
    });

    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });
});
