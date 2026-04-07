let db = JSON.parse(localStorage.getItem("db")) || {};
let dark = localStorage.getItem("dark") === "true";

let selectedDay = 0;

const currentWeek = getWeekKey();

// =========================
// WEEK KEY
// =========================
function getWeekKey() {
    const now = new Date();
    const year = now.getFullYear();

    const firstJan = new Date(year, 0, 1);
    const days = Math.floor((now - firstJan) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + firstJan.getDay() + 1) / 7);

    return `${year}-W${week}`;
}

// =========================
// INIT WEEK STRUCTURE
// =========================
function initWeek() {
    if (!db[currentWeek]) {
        db[currentWeek] = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };
    }

    for (let i = 0; i < 7; i++) {
        if (!db[currentWeek][i]) {
            db[currentWeek][i] = [];
        }
    }

    save();
}

// =========================
// CHANGE DAY
// =========================
function setDay(day) {
    selectedDay = day;
    render();
    updateProgress(); // IMPORTANT FIX
}
}

// =========================
// ADD TASK
// =========================
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
    updateProgress();
}

// =========================
// TOGGLE TASK COMPLETE
// =========================
function toggleTask(index) {
    db[currentWeek][selectedDay][index].done =
        !db[currentWeek][selectedDay][index].done;

    save();
    render();
    updateProgress();
}

// =========================
// SAVE DATA
// =========================
function save() {
    localStorage.setItem("db", JSON.stringify(db));
    localStorage.setItem("dark", dark);
}

// =========================
// RENDER TASKS
// =========================
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

// =========================
// ARCHIVE
// =========================
function renderArchive() {
    const archive = document.getElementById("archive");
    archive.innerHTML = "";

    Object.keys(db)
        .filter(key => key !== currentWeek)
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

// =========================
// DARK MODE
// =========================
function toggleDarkMode() {
    dark = !dark;
    document.body.classList.toggle("dark");
    save();
}

// =========================
// PROGRESS BAR
// =========================
function updateProgress() {

    const tasks = db[currentWeek]?.[selectedDay] || [];

    const textEl = document.getElementById("progressText");
    const fillEl = document.getElementById("progressFill");

    if (!textEl || !fillEl) return;

    if (tasks.length === 0) {
        textEl.innerText = "0% completed";
        fillEl.style.width = "0%";
        return;
    }

    const completed = tasks.filter(t => t.done).length;
    const percent = Math.round((completed / tasks.length) * 100);

    textEl.innerText = percent + "% completed";
    fillEl.style.width = percent + "%";
}

// =========================
// START APP
// =========================
document.addEventListener("DOMContentLoaded", () => {
    initWeek();

    if (dark) document.body.classList.add("dark");

    render();
});
