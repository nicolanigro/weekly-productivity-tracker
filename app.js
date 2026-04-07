let db = JSON.parse(localStorage.getItem("db")) || {};
let dark = localStorage.getItem("dark") === "true";

let selectedDay = 0;

const currentWeek = getWeekKey();

// WEEK KEY
function getWeekKey() {
    const now = new Date();
    const year = now.getFullYear();

    const firstJan = new Date(year, 0, 1);
    const days = Math.floor((now - firstJan) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + firstJan.getDay() + 1) / 7);

    return `${year}-W${week}`;
}

// INIT WEEK
function initWeek() {
    if (!db[currentWeek]) {
        db[currentWeek] = {
            0: [], 1: [], 2: [], 3: [],
            4: [], 5: [], 6: []
        };
    }
}

// SET DAY
function setDay(day) {
    selectedDay = day;
    render();
}

// ADD TASK
function addTask() {
    const input = document.getElementById("taskInput");
    const type = document.getElementById("type").value;

    if (!input.value.trim()) return;

    initWeek();

    db[currentWeek][selectedDay].push({
        text: input.value,
        type: type,
        done: false
    });

    input.value = "";
    save();
    render();
}

// TOGGLE TASK
function toggleTask(index) {
    db[currentWeek][selectedDay][index].done =
        !db[currentWeek][selectedDay][index].done;

    save();
    render();
}

// SAVE
function save() {
    localStorage.setItem("db", JSON.stringify(db));
    localStorage.setItem("dark", dark);
}

// RENDER
function render() {
    const priorityList = document.getElementById("priorityList");
    const weeklyList = document.getElementById("weeklyList");
    const monthlyList = document.getElementById("monthlyList");

    priorityList.innerHTML = "";
    weeklyList.innerHTML = "";
    monthlyList.innerHTML = "";

    const tasks = db[currentWeek]?.[selectedDay] || [];

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
        li.appendChild(left);

        if (task.type === "priority") priorityList.appendChild(li);
        if (task.type === "weekly") weeklyList.appendChild(li);
        if (task.type === "monthly") monthlyList.appendChild(li);
    });

    renderArchive();
    updateProgress();
}

// ARCHIVE
function renderArchive() {
    const archive = document.getElementById("archive");
    archive.innerHTML = "";

    Object.keys(db)
        .filter(k => k !== currentWeek)
        .sort((a, b) => b.localeCompare(a))
        .forEach(week => {

            const box = document.createElement("div");
            box.className = "archive-box";

            const title = document.createElement("div");
            title.textContent = week;

            const del = document.createElement("button");
            del.textContent = "Delete Week";
            del.className = "delete-btn";

            del.onclick = () => {
                delete db[week];
                save();
                render();
            };

            box.appendChild(title);
            box.appendChild(del);

            archive.appendChild(box);
        });
}

// DARK MODE
function toggleDarkMode() {
    dark = !dark;
    document.body.classList.toggle("dark");
    save();
}

// PROGRESS
function updateProgress() {

    const tasks = db[currentWeek]?.[selectedDay] || [];

    const text = document.getElementById("progressText");
    const fill = document.getElementById("progressFill");

    if (!tasks.length) {
        text.innerText = "0% completed";
        fill.style.width = "0%";
        return;
    }

    const done = tasks.filter(t => t.done).length;
    const percent = Math.round((done / tasks.length) * 100);

    text.innerText = percent + "% completed";
    fill.style.width = percent + "%";
}

// START
document.addEventListener("DOMContentLoaded", () => {
    initWeek();

    if (dark) document.body.classList.add("dark");

    render();
});
