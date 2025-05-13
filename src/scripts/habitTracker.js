// habitTracker.js - Core functionality for habit tracking

import { habitList, tasks, saveHabits, saveTasksToLocalStorage, formatDate } from './storage.js';
import { renderHabitList, renderTasks, renderDropdown } from './ui.js';

// Initialize date variables
let currentDate = new Date();
let startDate = null;
let endDate = null;
let currentEditIndex = null;

// Function to select active category
function selectActive(container, habitList) {
    container.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('li');
        if (!clickedItem || !container.contains(clickedItem)) return;
  
        // Highlight active category
        container.querySelector('.active')?.classList.remove('active');
        clickedItem.classList.add('active');
  
        // Get category name (assumes it's in a span inside .list-content-description)
        const categoryName = clickedItem.querySelector('.list-content-description span:last-child').textContent;
  
        // Find the matching category object from habitList
        const selectedCategory = habitList.find(h => h.name === categoryName);
        if (!selectedCategory) return;
  
        // Show the modal
        const modal = document.querySelector('.select-active-modal');
        const modalContent = modal.querySelector('.modal-content');
  
        // Populate modal with selected category's tasks
        modalContent.innerHTML = `
            <span id="closeModalBtn" class="active-close close">&times;</span>
            <h2>${selectedCategory.icon} ${selectedCategory.name}</h2>
            <p>Total tasks: ${selectedCategory.task.length}</p>
            <ul>
                ${selectedCategory.task.map(task => `
                    <li>
                        <strong>${task.taskName}</strong> - ${task.time} <br>
                        ${task.startDate} → ${task.endDate}
                    </li>
                `).join('')}
            </ul>
        `;
  
        // Show modal
        modal.style.display = 'block';
  
        // Handle modal close
        document.getElementById('closeModalBtn').onclick = function () {
            modal.style.display = 'none';
        };
    });
}

// Generate calendar
function generateCalendar(date) {
    // Clear calendar
    const calendarBody = document.getElementById('calendar-body');
    const monthYearElement = document.getElementById('month-year');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
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

// Function to update date and time
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

// Edit task function
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

// Initialize calendar and dates
function initializeDates() {
    // Set today as default start date
    const todayDate = new Date();
    startDate = todayDate;
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const taskTimeInput = document.getElementById('task-time');
    
    startDateInput.value = formatDate(todayDate);

    // Set end date default and min
    endDateInput.value = formatDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 7)); // Default 1 week
    endDateInput.min = formatDate(todayDate);

    // Set current time as default
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    taskTimeInput.value = `${hours}:${minutes}`;
}

export {
    currentDate,
    startDate,
    endDate,
    currentEditIndex,
    selectActive,
    generateCalendar,
    updateDateTime,
    editTask,
    initializeDates
};