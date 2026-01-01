let checklists = JSON.parse(localStorage.getItem("checklists")) || {};
let currentDate = null;

function save() {
  localStorage.setItem("checklists", JSON.stringify(checklists));
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === "history") renderHistory();
}

function openNewChecklist() {
  showTab("checklist");
  document.getElementById("checklistDate").value = "";
  document.getElementById("checklistLabel").value = "";
  document.getElementById("items").innerHTML = "";
  updateSummary();
  currentDate = null;
}

document.getElementById("checklistDate").addEventListener("change", e => {
  currentDate = e.target.value;

  if (!checklists[currentDate]) {
    checklists[currentDate] = { label: "", items: [] };
  }

  document.getElementById("checklistLabel").value =
    checklists[currentDate].label;

  renderItems();
});

document.getElementById("checklistLabel").addEventListener("input", e => {
  if (!currentDate) return;
  checklists[currentDate].label = e.target.value;
  save();
});

function addItem() {
  if (!currentDate) {
    alert("Please select a date first");
    return;
  }

  checklists[currentDate].items.push({
    text: "",
    right: false,
    wrong: false
  });

  save();
  renderItems();
}

function renderItems() {
  const container = document.getElementById("items");
  container.innerHTML = "";

  checklists[currentDate].items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "item";

    const text = document.createElement("input");
    text.type = "text";
    text.value = item.text;
    text.oninput = () => {
      item.text = text.value;
      save();
    };

    const right = document.createElement("input");
    right.type = "checkbox";
    right.checked = item.right;
    right.onclick = () => {
      item.right = true;
      item.wrong = false;
      save();
      renderItems();
    };

    const wrong = document.createElement("input");
    wrong.type = "checkbox";
    wrong.checked = item.wrong;
    wrong.onclick = () => {
      item.wrong = true;
      item.right = false;
      save();
      renderItems();
    };

    div.append(text, "✅", right, "❌", wrong);
    container.appendChild(div);
  });

  updateSummary();
}

function updateSummary() {
  if (!currentDate || !checklists[currentDate]) {
    document.getElementById("rightPercent").innerText = "0%";
    document.getElementById("wrongPercent").innerText = "0%";
    return;
  }

  const items = checklists[currentDate].items;
  if (items.length === 0) {
    document.getElementById("rightPercent").innerText = "0%";
    document.getElementById("wrongPercent").innerText = "0%";
    return;
  }

  const rightCount = items.filter(i => i.right).length;
  const wrongCount = items.filter(i => i.wrong).length;
  const total = items.length;

  document.getElementById("rightPercent").innerText =
    Math.round((rightCount / total) * 100) + "%";

  document.getElementById("wrongPercent").innerText =
    Math.round((wrongCount / total) * 100) + "%";
}

function renderHistory() {
  const history = document.getElementById("historyList");
  history.innerHTML = "";

  const dates = Object.keys(checklists);
  if (dates.length === 0) {
    history.innerText = "No checklists yet.";
    return;
  }

  dates.forEach(date => {
    const items = checklists[date].items || [];
    const right = items.filter(i => i.right).length;
    const wrong = items.filter(i => i.wrong).length;
    const total = items.length || 1;

    const div = document.createElement("div");
    div.style.padding = "8px";
    div.style.background = "#fff";
    div.style.borderRadius = "8px";
    div.style.marginBottom = "8px";

    div.innerHTML = `
      <strong>${date}</strong><br>
      ${checklists[date].label || "No label"}<br>
      ✅ ${Math.round((right / total) * 100)}% |
      ❌ ${Math.round((wrong / total) * 100)}%
    `;

    div.onclick = () => {
      showTab("checklist");
      currentDate = date;
      document.getElementById("checklistDate").value = date;
      document.getElementById("checklistLabel").value =
        checklists[date].label;
      renderItems();
    };

    history.appendChild(div);
  });
}
