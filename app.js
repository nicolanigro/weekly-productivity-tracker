function addTask(type) {
    let input, list;

    if (type === "weekly") {
        input = document.getElementById("weeklyInput");
        list = document.getElementById("weeklyList");
    } else {
        input = document.getElementById("monthlyGoalInput");
        list = document.getElementById("monthlyGoalList");
    }

    const text = input.value;
    if (text === "") return;

    const li = document.createElement("li");

    const btn = document.createElement("span");
    btn.textContent = "⭕ ";
    btn.onclick = function () {
        li.classList.toggle("completed");
        btn.textContent = li.classList.contains("completed") ? "✅ " : "⭕ ";
        updateProgress();
    };

    li.appendChild(btn);
    li.appendChild(document.createTextNode(text));

    list.appendChild(li);
    input.value = "";

    updateProgress();
}

function updateProgress() {
    const weekly = document.querySelectorAll("#weeklyList li");
    const weeklyDone = document.querySelectorAll("#weeklyList .completed");

    const monthly = document.querySelectorAll("#monthlyGoalList li");
    const monthlyDone = document.querySelectorAll("#monthlyGoalList .completed");

    const weeklyPercent = weekly.length ? Math.round((weeklyDone.length / weekly.length) * 100) : 0;
    const monthlyPercent = monthly.length ? Math.round((monthlyDone.length / monthly.length) * 100) : 0;

    document.getElementById("weeklyProgress").textContent = weeklyPercent + "%";
    document.getElementById("monthlyProgress").textContent = monthlyPercent + "%";
}
