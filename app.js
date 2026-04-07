let tasks = [];

function addTask() {
    const input = document.getElementById("taskInput");

    if (input.value.trim() === "") return;

    tasks.push({
        text: input.value,
        done: false
    });

    input.value = "";
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task";

        const circle = document.createElement("div");
        circle.className = "circle";

        if (task.done) {
            circle.innerHTML = "✓";
        }

        circle.onclick = () => toggleTask(index);

        const text = document.createElement("div");
        text.textContent = task.text;

        if (task.done) {
            text.classList.add("done");
        }

        li.appendChild(circle);
        li.appendChild(text);

        list.appendChild(li);
    });

    updateProgress();
}

function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").textContent = percent + "%";
}
