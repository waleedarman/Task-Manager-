const LS_KEY = "taskly:v1";

class Task {
  constructor(text, completed = false) {
    this.text = text.trim();
    this.completed = completed;
  }
}

let tasks = [];

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list  = document.getElementById("taskList");

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    tasks = arr.map(t => new Task(t.text, !!t.completed));
  } catch { tasks = []; }
};
const save = () => localStorage.setItem(LS_KEY, JSON.stringify(tasks));

const addTask = (text) => {
  const t = text.trim();
  if (!t) return;
  tasks.push(new Task(t));
  save(); render();
};
const toggleTask = (i) => {
  const t = tasks[i]; if (!t) return;
  t.completed = !t.completed;
  save(); render();
};
const removeTask = (i) => {
  tasks.splice(i, 1);
  save(); render();
};

const render = () => {
  list.innerHTML = "";
  const frag = document.createDocumentFragment();

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex align-items-center justify-content-between ${task.completed ? "completed" : ""}`;
    li.dataset.index = i;

    const left = document.createElement("div");
    left.className = "d-flex align-items-center gap-2";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "form-check-input m-0";
    check.checked = task.completed;

    const txt = document.createElement("span");
    txt.className = "task-text";
    txt.textContent = task.text;

    left.append(check, txt);

    const del = document.createElement("button");
    del.className = "btn btn-link btn-sm text-decoration-none btn-remove";
    del.innerHTML = `<i class="bi bi-x-lg"></i>`;

    li.append(left, del);
    frag.appendChild(li);
  });

  list.appendChild(frag);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const i = Number(li.dataset.index);
  if (e.target.closest(".btn-remove")) removeTask(i);
});

list.addEventListener("change", (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const li = e.target.closest("li");
    const i = Number(li.dataset.index);
    toggleTask(i);
  }
});

load();
render();
