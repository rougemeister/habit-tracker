// storage.js - Handles data persistence and management

// Class Definitions
class Category {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.count = 0;
        this.task = [];
        this.increase = function() {
            this.count++;
        };
        this.decrease = function() {
            this.count--;
        };
    }
}

class Habit {
    constructor(name, startDate, endDate, category, time, icon){
        this.name = name,
        this.startDate = startDate,
        this.endDate = endDate,
        this.category = category,
        this.time = time,
        this.icon = icon
    }
}

// Data initialization
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const habitList = JSON.parse(localStorage.getItem('habitList')) || [];

// Storage Functions
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveHabits() {
    localStorage.setItem('habitList', JSON.stringify(habitList));
}

function addTask(task) {
    tasks.push(task);
    saveTasks();
}

function addHabit(habit) {
    habitList.push(habit);
    saveHabits();
}

function createCategory(name, icon) {
    return new Category(name, icon);
}

function addToCategory(name, icon) {
    habitList.push(createCategory(name, icon));
    saveTasksToLocalStorage();
    saveHabits();
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        const taskToDelete = tasks[index];
  
        // Step 1: Remove from global tasks array
        tasks.splice(index, 1);
  
        // Step 2: Remove from the correct category's task array
        console.l
        const category = habitList.find(habit => habit.name === taskToDelete.habitCategory);
        console.log(category);
        if (category) {
            const taskIndexInCategory = category.task.findIndex(task =>
                task.taskName === taskToDelete.taskName &&
                task.startDate === taskToDelete.startDate &&
                task.endDate === taskToDelete.endDate &&
                task.time === taskToDelete.time
            );
  
            if (taskIndexInCategory !== -1) {
                category.task.splice(taskIndexInCategory, 1);
                ; // optional: update count
            }
        }
  
        // Step 3: Save updates
        saveTasksToLocalStorage();
        saveHabits();
    }
}

// Helper function for dates
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1)
        .padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Export all the necessary functions and data
export {
    Category,
    Habit,
    tasks,
    habitList,
    saveTasksToLocalStorage,
    saveHabits,
    addTask,
    addHabit,
    createCategory,
    addToCategory,
    deleteTask,
    formatDate
};