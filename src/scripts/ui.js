// ui.js - Handles UI elements and rendering

import { habitList, tasks, saveTasksToLocalStorage, saveHabits, addToCategory, deleteTask } from './storage.js';
import { currentEditIndex, currentDate, generateCalendar, selectActive, editTask } from './habitTracker.js';

// DOM Elements
const selectedEmoji = document.getElementById('selected-emoji');
const emojiPicker = document.getElementById('emoji-picker');
const createList = document.querySelector('.create-list');
const closeSelectActiveModal = document.querySelector('.active-close');
const closeCreateListBtn = document.querySelector('.close-create-list');
const createNewListBtn = document.querySelector('.create-new-list');
const closeTaskBtn = document.querySelector('.close-task-btn');
const createTaskBtn = document.querySelector('.create-task-btn');
const saveChangesBtn = document.querySelector('.save-changes-btn');
const listElement = document.querySelector('.list');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const habitDropdown = document.getElementById('habit-category');
const taskForm = document.getElementById('task-form');

// Function to render habit list
function renderHabitList(array) {
    // listElement.innerHTML = ''; // Clear existing items

    array.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `<div class="list-content">
                            <div class="list-content-description">
                                <span class="habit-icon">${habit.icon}</span>
                                <span>${habit.name}</span> 
                            </div>
                            <span class="habit-count">${habit.task.length}</span> 
                        </div>`;
        li.classList.add('list-item');
        listElement.appendChild(li);
    });
}

// Function to render dropdown
function renderDropdown() {
    const dropdown = document.getElementById('habit-category');
    dropdown.innerHTML = ''; // Clear existing options

    habitList.forEach((habit, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${habit.icon} ${habit.name}`;
        dropdown.appendChild(option);
    });
}

// Function to render tasks
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.innerHTML = `
        <div class="task-item">
            <div class="task-item-text">
                <h3 class="task-title">${task.habitIcon} ${task.habitCategory}</h3>
                <div class="task-name">${task.taskName}</div>
            </div>
            <div class="task-item-date">
                <div class="start-date">${task.startDate}</div>
                <div class="end-date">${task.endDate}</div>
                <div class="task-time">${task.time}</div>
            </div>
            <div class="task-item-btns">
                <button class="task-item-btn" onclick="editTask(${index})">Edit</button>
                <button class="task-item-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// Close modal function
function closeModal() {
    document.querySelector('.modal').style.display = 'none';
    document.getElementById('myModal').style.display = 'none';
    document.querySelector('.task-modal').style.display = 'none';
}

// Setup emoji picker
function setupEmojiPicker() {
    // Common emojis for lists
    const emojis = [
        '📋', '📝', '✅', '📌', '🔖', '📚', '🛒', '🎯',
        '💼', '🏆', '💡', '🎁', '🍽️', '✈️', '🏠', '💰',
        '🎬', '🎵', '📺', '📱', '🎮', '💪', '🧘', '🥗',
        '🍳', '🧹', '🔨', '🛠️', '📅', '⏰', '❤️', '🌟',
        '🌈', '🌱', '🌻', '🍎', '🥑', '🍕', '🍦', '☕',
        '🎨', '🎭', '🏛️', '🏝️', '🚗', '🚲', '📷', '🎒'
    ];

    // Populate emoji picker
    emojis.forEach(emoji => {
        const emojiItem = document.createElement('div');
        emojiItem.className = 'emoji-item';
        emojiItem.textContent = emoji;
        emojiItem.addEventListener('click', () => {
            selectedEmoji.textContent = emoji;
            emojiPicker.classList.remove('active');
        });
        emojiPicker.appendChild(emojiItem);
    });
}

// Initialize UI elements and event listeners
function initializeUI() {
    // Setup event listeners
    createList.addEventListener('click', () => {
        document.querySelector('.create-list-modal').style.display = 'block';
    });

    closeCreateListBtn.addEventListener('click', closeModal);
    closeSelectActiveModal.addEventListener('click', closeModal);
    closeTaskBtn.addEventListener('click', closeModal);

    createTaskBtn.addEventListener('click', function() {
        document.querySelector('.task-modal').style.display = 'block';
    });

    // Previous month button
    prevMonthBtn.addEventListener('click', function() {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        generateCalendar(currentDate);
    });

    // Next month button
    nextMonthBtn.addEventListener('click', function() {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        generateCalendar(currentDate);
    });

    // Handle habit selection
    habitDropdown.addEventListener('change', function() {
        const selectedHabit = habitList[this.value];
        if (selectedHabit) {
            const habitIcon = document.getElementById('habit-icon');
            const habitName = document.getElementById('habit-name');
            const habitDisplay = document.getElementById('selected-habit-display');
            
            habitIcon.textContent = selectedHabit.icon;
            habitName.textContent = selectedHabit.name;
            habitDisplay.style.display = 'flex';
        }
    });

    // Create new list button
    createNewListBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const listName = document.getElementById('list-name').value;
        const selectedEmojiText = document.getElementById('selected-emoji').textContent;
        addToCategory(listName, selectedEmojiText);
        saveHabits();
        renderHabitList(habitList);
        renderDropdown();
        saveTasksToLocalStorage();
        document.querySelector('.create-list-modal').style.display = 'none';
    });

    // Form submission
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const selectedHabitIndex = habitDropdown.value;
        const selectedHabit = habitList[selectedHabitIndex];
        
        const habitData = {
            taskName: document.getElementById('task-name').value,
            habitCategory: selectedHabit ? selectedHabit.name : '',
            habitIcon: selectedHabit ? selectedHabit.icon : '',
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            time: document.getElementById('task-time').value
        };

        // Push task to selected habit
        if (selectedHabit) {
            selectedHabit.task.push(habitData);
        }

        // Push to global tasks array
        tasks.push(habitData);

        // Save to localStorage
        saveHabits();
        saveTasksToLocalStorage();

        renderHabitList(habitList);
        renderTasks();
        document.querySelector('.task-modal').style.display = 'none'; // Close the task modal
    });

    // Edit form submission
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const updatedTask = {
            taskName: document.getElementById('editTaskName').value,
            habitCategory: document.getElementById('editHabitCategory').value,
            habitIcon: document.getElementById('editHabitIcon').value,
            startDate: document.getElementById('editStartDate').value,
            endDate: document.getElementById('editEndDate').value,
            time: document.getElementById('editTime').value,
        };

        tasks[currentEditIndex] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        document.getElementById('editModal').style.display = 'none'; // Close the edit modal
    });

    // Make functions globally available
    window.editTask = editTask;
    window.deleteTask = deleteTask;
    
    // Setup emoji picker
    setupEmojiPicker();
    
    // Setup the selectActive function
    selectActive(listElement, habitList);
}

export {
    renderHabitList,
    renderDropdown,
    renderTasks,
    closeModal,
    setupEmojiPicker,
    initializeUI
};