// index.js - Main entry point to connect all modules

import { habitList, tasks } from './storage.js';
import { generateCalendar, updateDateTime, initializeDates } from './habitTracker.js';
import { renderHabitList, renderDropdown, renderTasks, initializeUI } from './ui.js';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components and event listeners
    initializeUI();
    
    // Initialize dates and calendar
    initializeDates();
    generateCalendar(new Date());
    
    // Start datetime updating
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initial render of data
    renderHabitList(habitList);
    renderDropdown();
    renderTasks();
});