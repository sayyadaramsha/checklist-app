const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

let data = JSON.parse(localStorage.getItem("items")) || [];

function save() {
  localStorage.setItem("items", JSON.stringify(data));
}

function render() {
  list.innerHTML = "";

  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";

    const date = document.createElement("input");
    date.type = "date";
    date.value = item.date;
    date.onchange = () => {
      data[index].date = date.value;
      save();
    };

    const text = document.createElement("input");
    text.type = "text";
    text.placeholder = "Enter text...";
    text.value = item.text;
    text.oninput = () => {
      data[index].text = text.value;
      save();
    };

    const right = document.createElement("input");
    right.type = "checkbox";
    right.checked = item.right;
    right.onclick = () => {
      data[index].right = true;
      data[index].wrong = false;
      save();
      render();
    };

    const wrong = document.createElement("input");
    wrong.type = "checkbox";
    wrong.checked = item.wrong;
    wrong.onclick = () => {
      data[index].wrong = true;
      data[index].right = false;
      save();
      render();
    };

    const checks = document.createElement("div");
    checks.className = "checks";
    checks.append("✅", right, "❌", wrong);

    div.append(date, text, checks);
    list.append(div);
  });
}

addBtn.onclick = () => {
  data.push({
    date: "",
    text: "",
    right: false,
    wrong: false
  });
  save();
  render();
};

render();
