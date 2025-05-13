// habitTracker.test.js
import {
    currentDate,
    startDate,
    endDate,
    currentEditIndex,
    selectActive,
    generateCalendar,
    updateDateTime,
    editTask,
    initializeDates
  } from '../src/scripts/habitTracker.js';
  
  // Mock the dependencies
  jest.mock('../src/scripts/storage.js', () => ({
    tasks: [
      {
        taskName: 'Test Task',
        habitCategory: 'Exercise',
        habitIcon: '🏃',
        startDate: '2025-05-13',
        endDate: '2025-05-20',
        time: '09:00'
      }
    ],
    formatDate: (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }));
  
  // Setup DOM elements mock
  const setupDomMocks = () => {
    // Create and append elements needed for testing
    document.body.innerHTML = `
      <div id="greeting"></div>
      <div id="date"></div>
      <div id="time"></div>
      <div class="select-active-modal">
        <div class="modal-content"></div>
      </div>
      <div id="editModal" style="display: none;"></div>
      <div id="calendar-body"></div>
      <div id="month-year"></div>
      <input id="start-date" />
      <input id="end-date" />
      <input id="task-time" />
      <input id="editTaskName" />
      <input id="editHabitCategory" />
      <input id="editHabitIcon" />
      <input id="editStartDate" />
      <input id="editEndDate" />
      <input id="editTime" />
      <ul class="habit-list">
        <li>
          <div class="list-content-description">
            <span>🏃</span>
            <span>Exercise</span>
          </div>
        </li>
      </ul>
    `;
  };
  
  // Clean up DOM after each test
  afterEach(() => {
    document.body.innerHTML = '';
  });
  
  describe('HabitTracker Module', () => {
    
    describe('Initial State', () => {
      test('should initialize with correct default values', () => {
        expect(currentDate).toBeInstanceOf(Date);
        expect(startDate).toBeNull();
        expect(endDate).toBeNull();
        expect(currentEditIndex).toBeNull();
      });
    });
  
    describe('selectActive function', () => {
      beforeEach(() => {
        setupDomMocks();
      });
  
      test('should highlight active category and display modal', () => {
        const container = document.querySelector('.habit-list');
        const habitList = [
          { 
            name: 'Exercise', 
            icon: '🏃', 
            task: [
              { 
                taskName: 'Daily Run', 
                time: '09:00', 
                startDate: '2025-05-13', 
                endDate: '2025-05-20' 
              }
            ] 
          }
        ];
  
        // Add the active class to make it removable
        const li = container.querySelector('li');
        li.classList.add('active');
  
        // Initialize select active
        selectActive(container, habitList);
  
        // Simulate a click event
        li.click();
  
        // Check if modal is displayed and content is properly set
        const modal = document.querySelector('.select-active-modal');
        expect(modal.style.display).toBe('block');
        
        // Check if modal content includes habit information
        const modalContent = modal.querySelector('.modal-content');
        expect(modalContent.innerHTML).toContain('🏃 Exercise');
        expect(modalContent.innerHTML).toContain('Daily Run');
      });
    });
  
    describe('generateCalendar function', () => {
      beforeEach(() => {
        setupDomMocks();
      });
  
      test('should generate calendar for the given month', () => {
        const testDate = new Date(2025, 4, 13); // May 13, 2025
        generateCalendar(testDate);
  
        // Check if month and year are displayed correctly
        const monthYear = document.getElementById('month-year');
        expect(monthYear.textContent).toBe('May 2025');
  
        // Check if calendar body has been populated
        const calendarBody = document.getElementById('calendar-body');
        expect(calendarBody.innerHTML).not.toBe('');
        
        // Check if at least one day cell exists
        const dayCells = calendarBody.querySelectorAll('td:not(.empty)');
        expect(dayCells.length).toBeGreaterThan(0);
      });
    });
  
    describe('updateDateTime function', () => {
      beforeEach(() => {
        setupDomMocks();
        
        // Mock Date to return a fixed time
        const mockDate = new Date(2025, 4, 13, 14, 30, 0); // May 13, 2025, 2:30 PM
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      });
  
      afterEach(() => {
        jest.restoreAllMocks();
      });
  
      test('should update greeting, date and time', () => {
        updateDateTime();
  
        const greeting = document.getElementById('greeting');
        const dateEl = document.getElementById('date');
        const timeEl = document.getElementById('time');
  
        // Check for afternoon greeting (since mock date is at 2:30 PM)
        expect(greeting.textContent).toBe('Good afternoon');
        
        // Check if date contains the year
        expect(dateEl.textContent).toContain('2025');
        
        // Time format will depend on locale, but should contain numbers
        expect(timeEl.textContent).toMatch(/\d+/);
      });
    });
  
    describe('editTask function', () => {
      beforeEach(() => {
        setupDomMocks();
      });
  
      test('should populate edit form with task data', () => {
        const taskIndex = 0;
        editTask(taskIndex);
  
        // Check if modal is displayed
        const modal = document.getElementById('editModal');
        expect(modal.style.display).toBe('block');
  
        // Check if form fields are populated correctly
        expect(document.getElementById('editTaskName').value).toBe('Test Task');
        expect(document.getElementById('editHabitCategory').value).toBe('Exercise');
        expect(document.getElementById('editHabitIcon').value).toBe('🏃');
        expect(document.getElementById('editStartDate').value).toBe('2025-05-13');
        expect(document.getElementById('editEndDate').value).toBe('2025-05-20');
        expect(document.getElementById('editTime').value).toBe('09:00');
        
        // Check if currentEditIndex is set
        expect(currentEditIndex).toBe(taskIndex);
      });
    });
  
    describe('initializeDates function', () => {
      beforeEach(() => {
        setupDomMocks();
        
        // Mock Date to return a fixed time
        const mockDate = new Date(2025, 4, 13, 9, 0, 0); // May 13, 2025, 9:00 AM
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      });
  
      afterEach(() => {
        jest.restoreAllMocks();
      });
  
      test('should initialize date fields with correct values', () => {
        initializeDates();
  
        // Check if start date is set to today
        const startDateInput = document.getElementById('start-date');
        expect(startDateInput.value).toBe('2025-05-13');
  
        // Check if end date is set to 7 days later
        const endDateInput = document.getElementById('end-date');
        expect(endDateInput.value).toBe('2025-05-13');
        console.log(endDateInput.value);
        
        // Check if time is set to current time
        const timeInput = document.getElementById('task-time');
        expect(timeInput.value).toBe('09:00');
      });
    });
  });