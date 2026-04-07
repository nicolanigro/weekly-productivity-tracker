let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = false;

function addTask() {
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;

    if (!input.value.trim()) return;

    tasks.push({
        text: input.value,
        done: false,
        priority: priority
    });

    input.value = "";
    save();
    render();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    save();
    render();
}

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
    const list = document.getElementById("taskList");
    const empty = document.getElementById("emptyState");

    list.innerHTML = "";

    if (tasks.length === 0) {
        empty.style.display = "block";
    } else {
        empty.style.display = "none";
    }

    tasks.forEach((task, i) => {
        const li = document.createElement("li");
        li.className = "task";

        if (task.priority === "high") {
            li.classList.add("high");
        }

        const left = document.createElement("div");
        left.className = "left";

        const circle = document.createElement("div");
        circle.className = "circle";

        if (task.done) circle.innerHTML = "✓";

        circle.onclick = () => toggleTask(i);

        const text = document.createElement("div");
        text.textContent = task.text;

        if (task.done) text.classList.add("done");

        left.appendChild(circle);
        left.appendChild(text);

        const del = document.createElement("button");
        del.textContent = "x";
        del.style.background = "transparent";
        del.style.color = "gray";

        del.onclick = () => {
            tasks.splice(i, 1);
            save();
            render();
        };

        li.appendChild(left);
        li.appendChild(del);

        list.appendChild(li);
    });

    updateProgress();
}

function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;

    const percent = total ? Math.round((done / total) * 100) : 0;

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").textContent = percent + "%";
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark");
    localStorage.setItem("dark", darkMode);
}

function loadDarkMode() {
    darkMode = localStorage.getItem("dark") === "true";
    if (darkMode) document.body.classList.add("dark");
}

loadDarkMode();
render();
