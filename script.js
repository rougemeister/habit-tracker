
const selectedEmoji = document.getElementById('selected-emoji');
const emojiPicker = document.getElementById('emoji-picker');
const createList = document.querySelector('.create-list');
const closeSelectActiveModal = document.querySelector('.active-close');
const closeCreateListBtn = document.querySelector('.close-create-list');
const createNewListBtn = document.querySelector('.create-new-list');
const closeTaskBtn = document.querySelector('.close-task-btn')
const createTaskBtn = document.querySelector('.create-task-btn');
const saveChangesBtn = document.querySelector('.save-changes-btn')
const listElement = document.querySelector('.list');


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



// Function to save tasks to local storage
function saveTasksToLocalStorage () {
    localStorage.setItem('tasks', JSON.stringify(tasks));

}
  
  // Function to save habits to local storage
  function saveHabits() {
    localStorage.setItem('habitList', JSON.stringify(habitList));
  }
  
  // Example of adding a new task
  function addTask(task) {
    tasks.push(task);
    saveTasks();
  }
  
  // Example of adding a new habit
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
    renderHabitList(habitList); 
    renderTasks()
    // Re-render after adding
    
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const habitList = JSON.parse(localStorage.getItem('habitList')) || [];





function selectActive(container) {
    container.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('li');
      if (!clickedItem || !container.contains(clickedItem)) return;
  
      container.querySelector('.active')?.classList.remove('active');
        document.querySelector('.select-active-modal').style.display = 'block';

      clickedItem.classList.add('active');
    });
    
  }
  
  function renderHabitList(array) {
    listElement.innerHTML = ''; // Clear existing items

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

renderHabitList(habitList);




selectActive(listElement);


            
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

createList.addEventListener('click', () => {

    document.querySelector('.create-list-modal').style.display = 'block';
})


function saveChanges (){
    
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
    document.getElementById('myModal').style.display = 'none';
    document.querySelector('.task-modal').style.display = 'none';
}
closeCreateListBtn.addEventListener('click', closeModal);
closeSelectActiveModal.addEventListener('click', closeModal);
closeTaskBtn.addEventListener('click', closeModal);

createTaskBtn.addEventListener('click', function() {
    document.querySelector('.task-modal').style.display = 'block';
})



const habitDropdown = document.getElementById('habit-category');
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

renderDropdown();

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

createNewListBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const listName = document.getElementById('list-name').value;
    const selectedEmoji = document.getElementById('selected-emoji').textContent;
    addToCategory(listName, selectedEmoji);
    saveHabits();
    renderHabitList(habitList);
    renderDropdown();
    saveTasksToLocalStorage();
    document.querySelector('.create-list-modal').style.display = 'none';
})

// Initialize date variables
let currentDate = new Date();
let startDate = null;
let endDate = null;

// Calendar elements
const calendarBody = document.getElementById('calendar-body');
const monthYearElement = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

// Form elements
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskTimeInput = document.getElementById('task-time');

// Close button
const closeBtn = document.querySelector('.close');

// Helper to format date as YYYY-MM-DD
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1)
        .padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Generate calendar
function generateCalendar(date) {
    // Clear calendar
    calendarBody.innerHTML = '';
    
    // Set month and year in header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Get first day of month and total days in month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    let dayCounter = 1;
    const today = new Date();
    
    // Create calendar rows
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        
        // Create calendar cells
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            if (i === 0 && j < firstDay.getDay()) {
                // Empty cells before first day of month
                cell.classList.add('empty');
            } else if (dayCounter <= lastDay.getDate()) {
                // Valid day cells
                cell.textContent = dayCounter;
                const cellDate = new Date(date.getFullYear(), date.getMonth(), dayCounter);
                cell.dataset.date = formatDate(cellDate);
                
                // Check if this is today
                if (dayCounter === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear()) {
                    cell.classList.add('today');
                }
                
                // Check if this is the start date
                if (startDate && 
                    dayCounter === startDate.getDate() && 
                    date.getMonth() === startDate.getMonth() && 
                    date.getFullYear() === startDate.getFullYear()) {
                    cell.classList.add('selected', 'start-date');
                }
                
                // Add click event
                cell.addEventListener('click', function() {
                    // Remove selected class from all cells
                    document.querySelectorAll('.calendar td.selected').forEach(td => {
                        td.classList.remove('selected', 'start-date');
                    });
                    
                    // Add selected class to clicked cell
                    this.classList.add('selected', 'start-date');
                    
                    // Update start date
                    startDate = new Date(date.getFullYear(), date.getMonth(), dayCounter);
                    startDateInput.value = this.dataset.date;
                    
                    // Update end date min attribute
                    endDateInput.min = this.dataset.date;
                    
                    // If end date is before start date, update it
                    if (endDateInput.value && endDateInput.value < startDateInput.value) {
                        endDateInput.value = startDateInput.value;
                    }
                });
                
                dayCounter++;
            } else {
                // Empty cells after last day of month
                cell.classList.add('empty');
            }
            
            row.appendChild(cell);
        }
        
        calendarBody.appendChild(row);
        
        // Stop creating rows if we've reached the end of the month
        if (dayCounter > lastDay.getDate()) {
            break;
        }
    }
}

// Initialize calendar
generateCalendar(currentDate);

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

// Set today as default start date
const todayDate = new Date();
startDate = todayDate;
startDateInput.value = formatDate(todayDate);

// Set end date default and min
endDateInput.value = formatDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 7)); // Default 1 week
endDateInput.min = formatDate(todayDate);

// Set current time as default
const now = new Date();
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
taskTimeInput.value = `${hours}:${minutes}`;

// Close button functionality
closeBtn.addEventListener('click', function() {
    console.log('Modal would close here');
});

// Form submission
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const selectedHabitIndex = habitDropdown.value;
    const selectedHabit = habitList[selectedHabitIndex];
    
    const habitData = {
        taskName: taskNameInput.value,
        habitCategory: selectedHabit ? selectedHabit.name : '',
        habitIcon: selectedHabit ? selectedHabit.icon : '',
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        time: taskTimeInput.value
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
    renderTasks()
    document.querySelector('.task-modal').style.display = 'none'; // Close the task modal
 // Close the modal
});

function updateDateTime() {
    const now = new Date();
    
    // Get current hour to determine greeting
    const hour = now.getHours();
    let greeting;
    
    if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    
    // Format date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString(undefined, options);
    
    // Format time
    const timeStr = now.toLocaleTimeString();
    
    // Update DOM
    document.getElementById('greeting').textContent = greeting;
    document.getElementById('date').textContent = dateStr;
    document.getElementById('time').textContent = timeStr;
}

// Update immediately and then every second
updateDateTime();
setInterval(updateDateTime, 1000);


let currentEditIndex = null;

// Function to render task list
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

// Function to open modal and prefill form
function editTask(index) {
  const task = tasks[index];
  currentEditIndex = index;

  document.getElementById('editTaskName').value = task.taskName;
  document.getElementById('editHabitCategory').value = task.habitCategory;
  document.getElementById('editHabitIcon').value = task.habitIcon;
  document.getElementById('editStartDate').value = task.startDate;
  document.getElementById('editEndDate').value = task.endDate;
  document.getElementById('editTime').value = task.time;

  document.getElementById('editModal').style.display = 'block';
}

// Function to handle form submission
document.getElementById('editForm').addEventListener('submit', function (e) {
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

// Delete function
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
      const taskToDelete = tasks[index];
  
      // Step 1: Remove from global tasks array
      tasks.splice(index, 1);
  
      // Step 2: Remove from the correct category's task array
      const category = habitList.find(habit => habit.name === taskToDelete.habitCategory);
  
      if (category) {
        const taskIndexInCategory = category.task.findIndex(task =>
          task.taskName === taskToDelete.taskName &&
          task.startDate === taskToDelete.startDate &&
          task.endDate === taskToDelete.endDate &&
          task.time === taskToDelete.time
        );
  
        if (taskIndexInCategory !== -1) {
          category.task.splice(taskIndexInCategory, 1);
          category.decrease(); // optional: update count
        }
      }
  
      // Step 3: Save updates
      saveTasksToLocalStorage();
      saveHabits();
  
      // Step 4: Re-render
      renderTasks();
      renderHabitList(habitList);
    }
  }
  




renderTasks();

console.log(tasks)  