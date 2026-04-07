let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    const input = document.getElementById("taskInput");
    const type = document.getElementById("type").value;

    if (!input.value.trim()) return;

    tasks.push({
        text: input.value,
        type: type,
        done: false
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

    const priorityList = document.getElementById("priorityList");
    const weeklyList = document.getElementById("weeklyList");
    const monthlyList = document.getElementById("monthlyList");

    priorityList.innerHTML = "";
    weeklyList.innerHTML = "";
    monthlyList.innerHTML = "";

    tasks.forEach((task, i) => {

        const li = document.createElement("li");
        li.className = "item " + task.type;

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
        del.onclick = () => {
            tasks.splice(i, 1);
            save();
            render();
        };

        li.appendChild(left);
        li.appendChild(del);

        if (task.type === "priority") priorityList.appendChild(li);
        if (task.type === "weekly") weeklyList.appendChild(li);
        if (task.type === "monthly") monthlyList.appendChild(li);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

render();
