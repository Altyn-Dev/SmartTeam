let tasks = [];
let currentFilter = "all";

// ===============================
// ЭЛЕМЕНТТЕР
// ===============================

const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const priorityInput = document.getElementById("priority-input");
const addTaskBtn = document.getElementById("add-task-btn");

const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

const taskCount = document.getElementById("task-count");

const totalTasks = document.getElementById("total-tasks");
const activeTasks = document.getElementById("active-tasks");
const completedTasks = document.getElementById("completed-tasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// ===============================
// ЖҮКТЕУ
// ===============================

try {
    const savedTasks = localStorage.getItem("smartteam_tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    if (!Array.isArray(tasks)) {
        tasks = [];
    }

} catch (error) {
    tasks = [];
}


// ===============================
// САҚТАУ
// ===============================

function saveTasks() {
    localStorage.setItem(
        "smartteam_tasks",
        JSON.stringify(tasks)
    );
}


// ===============================
// ТАПСЫРМА ҚОСУ
// ===============================

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Тапсырма атауын енгізіңіз!");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        date: dateInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";
    priorityInput.value = "medium";

    renderTasks();

    taskInput.focus();
}


// Қосу батырмасы
addTaskBtn.addEventListener("click", addTask);


// Enter
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }

});


// ===============================
// ТАПСЫРМАНЫ ОРЫНДАУ
// ===============================

function completeTask(id) {

    const task = tasks.find(function (item) {
        return item.id === id;
    });

    if (!task) {
        return;
    }

    task.completed = true;

    saveTasks();

    renderTasks();
}


// ===============================
// ОРЫНДАЛҒАН ТАПСЫРМАНЫ ЖОЮ
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();

    renderTasks();
}


// ===============================
// ТАПСЫРМА ЖАСАУ
// ===============================

function createTask(task) {

    const item = document.createElement("div");

    item.className = "task-item";

    if (task.completed) {
        item.classList.add("completed");
    }


    // Сол жақ бөлік
    const left = document.createElement("div");

    left.className = "task-left";


    // Мазмұн
    const content = document.createElement("div");

    content.className = "task-content";


    // Атауы
    const title = document.createElement("div");

    title.className = "task-title";
    title.textContent = task.title;


    // Ақпарат
    const meta = document.createElement("div");

    meta.className = "task-meta";


    // Күні
    const date = document.createElement("span");

    if (task.date) {

        const parts = task.date.split("-");

        date.textContent =
            "📅 " +
            parts[2] + "." +
            parts[1] + "." +
            parts[0];

    } else {

        date.textContent = "📅 Күні жоқ";
    }


    // Басымдық
    const priority = document.createElement("span");

    priority.className = "priority";


    if (task.priority === "low") {

        priority.classList.add("priority-low");
        priority.textContent = "Төмен";

    } else if (task.priority === "high") {

        priority.classList.add("priority-high");
        priority.textContent = "Жоғары";

    } else {

        priority.classList.add("priority-medium");
        priority.textContent = "Орташа";
    }


    // Ақпаратты жинау
    meta.appendChild(date);
    meta.appendChild(priority);

    content.appendChild(title);
    content.appendChild(meta);

    left.appendChild(content);


    // ===============================
    // ОҢ ЖАҚТАҒЫ БАТЫРМА
    // ===============================

    const actionButton = document.createElement("button");

    actionButton.type = "button";
    actionButton.className = "task-action";


    // Белсенді тапсырма
    if (!task.completed) {

        actionButton.textContent = "✓";
        actionButton.title = "Тапсырманы орындау";
        actionButton.classList.add("complete-action");

        actionButton.addEventListener("click", function () {
            completeTask(task.id);
        });

    }


    // Орындалған тапсырма
    else {

        actionButton.textContent = "×";
        actionButton.title = "Тапсырманы жою";
        actionButton.classList.add("delete-action");

        actionButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

    }


    // Тапсырманы жинау
    item.appendChild(left);
    item.appendChild(actionButton);

    taskList.appendChild(item);
}


// ===============================
// ТАПСЫРМАЛАРДЫ КӨРСЕТУ
// ===============================

function renderTasks() {

    // Тек ескі тапсырмаларды өшіреміз
    const oldTasks = taskList.querySelectorAll(".task-item");

    oldTasks.forEach(function (item) {
        item.remove();
    });


    // Сүзу
    let visibleTasks = tasks;


    if (currentFilter === "active") {

        visibleTasks = tasks.filter(function (task) {
            return !task.completed;
        });

    }


    if (currentFilter === "completed") {

        visibleTasks = tasks.filter(function (task) {
            return task.completed;
        });

    }


    // Бос тізім
    if (visibleTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

        visibleTasks.forEach(function (task) {
            createTask(task);
        });
    }


    updateStatistics();
}


// ===============================
// СТАТИСТИКА
// ===============================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const active = total - completed;


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;

    taskCount.textContent =
        "Барлық тапсырмалар: " + total;
}


// ===============================
// СҮЗГІЛЕР
// ===============================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter =
            button.getAttribute("data-filter");

        renderTasks();
    });

});


// ===============================
// ІСКЕ ҚОСУ
// ===============================

renderTasks();
