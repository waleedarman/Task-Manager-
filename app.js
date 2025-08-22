class Task {
  constructor(text, completed = false) {
    this.text = text;
    this.completed = completed;
  }
}

class TaskManager {
  constructor(listElementId, formElementId, inputElementId) {
    this.tasks = JSON.parse(localStorage.getItem("tasks"))?.map(
      t => new Task(t.text, t.completed)
    ) || [];
    this.taskList = document.getElementById(listElementId);
    this.taskForm = document.getElementById(formElementId);
    this.taskInput = document.getElementById(inputElementId);

    this.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTask(this.taskInput.value);
      this.taskInput.value = "";
      this.taskInput.focus();
    });

    this.renderTasks();
  }

  saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  renderTasks = () => {
    this.taskList.innerHTML = "";
    this.tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2";
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <input type="checkbox" class="form-check-input complete-checkbox" ${task.completed ? "checked" : ""}>
          <span class="task-text">${task.text}</span>
        </div>
        <button class="btn btn-sm btn-link delete-btn text-danger" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      `;

      li.querySelector(".complete-checkbox").addEventListener("change", () => {
        this.toggleTask(index);
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        this.deleteTask(index);
      });

      this.taskList.appendChild(li);
    });
  }

  addTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.tasks.push(new Task(trimmed));
    this.saveTasks();
    this.renderTasks();
  }

  toggleTask = (index) => {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.saveTasks();
    this.renderTasks();
  }

  deleteTask = (index) => {
    this.tasks.splice(index, 1);
    this.saveTasks();
    this.renderTasks();
  }
}

const manager = new TaskManager("taskList", "taskForm", "taskInput");
