const fs = require("fs");
const filePath = "./tasks.json";

// Load tasks from file
const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

// Save tasks to file
const saveTasks = (tasks) => {
  const dataJSON = JSON.stringify(tasks);
  fs.writeFileSync(filePath, dataJSON);
};

// Add a new task
const addTask = (task, dueDate = "No due date") => {
  const tasks = loadTasks();
  tasks.push({ task, completed: false, due: dueDate });
  saveTasks(tasks);
  console.log(`Task added: "${task}" (Due: ${dueDate})`);
};

// List all tasks
const listTasks = () => {
  const tasks = loadTasks();
  tasks.forEach((task, index) => {
    const status = task.completed ? "[✔]" : "[ ]";
    console.log(`${index + 1} - ${status} ${task.task} (Due: ${task.due})`);
  });
};

// Remove a task
const removeTask = (index) => {
  let tasks = loadTasks();
  if (index < 1 || index > tasks.length) {
    console.log("Invalid task number!");
    return;
  }
  tasks.splice(index - 1, 1);
  saveTasks(tasks);
  console.log("Task removed successfully.");
};

// Mark a task as completed
const completeTask = (index) => {
  let tasks = loadTasks();
  if (index < 1 || index > tasks.length) {
    console.log("Invalid task number!");
    return;
  }
  tasks[index - 1].completed = true;
  saveTasks(tasks);
  console.log(`Task ${index} marked as completed.`);
};

// Edit a task
const editTask = (index, newTask) => {
  const tasks = loadTasks();
  if (!tasks.length) {
    console.log("No tasks found!");
    return;
  }
  if (!index || isNaN(index) || index < 1 || index > tasks.length) {
    console.log("Invalid task number! Please provide a valid number.");
    return;
  }
  tasks[index - 1].task = newTask;
  saveTasks(tasks);
  console.log(`Task ${index} updated to: "${newTask}"`);
};

// Clear all tasks
const clearTasks = () => {
  saveTasks([]);
  console.log("All tasks have been removed!");
};

// Handle CLI commands
const command = process.argv[2];
const argument = process.argv[3];

if (command === "add") {
  const dueIndex = process.argv.indexOf("--due");
  const dueDate = dueIndex !== -1 ? process.argv[dueIndex + 1] : "No due date";
  addTask(argument, dueDate);
} else if (command === "list") {
  listTasks();
} else if (command === "remove") {
  removeTask(parseInt(argument));
} else if (command === "complete") {
  completeTask(parseInt(argument));
} else if (command === "edit") {
  const newTask = process.argv.slice(4).join(" "); // Fix for handling multiple words
  editTask(parseInt(argument), newTask);
} else if (command === "clear") {
  clearTasks();
} else {
  console.log("Command not found!");
}