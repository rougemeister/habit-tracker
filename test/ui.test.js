// ui.test.js - Tests for UI functionality

import { 
    renderHabitList, 
    renderDropdown, 
    renderTasks, 
    closeModal, 
    setupEmojiPicker, 
    initializeUI 
  } from '../src/scripts/ui.js';
  
  import { 
    habitList, 
    tasks, 
    saveTasksToLocalStorage, 
    saveHabits, 
    addToCategory, 
    deleteTask 
  } from '../src/scripts/storage.js';
  
  import { 
    currentEditIndex, 
    currentDate, 
    generateCalendar, 
    selectActive, 
    editTask 
  } from '../src/scripts/habitTracker.js';
  
  // Mock modules
  jest.mock('../src/scripts/storage.js');
  jest.mock('../src/scripts/habitTracker.js');
  
  describe('UI Module Tests', () => {
    // Setup DOM mocking before tests
    let mockElements = {};
    
    beforeEach(() => {
      // Mock DOM elements
      document.body.innerHTML = `
        <div id="selected-emoji">📝</div>
        <div id="emoji-picker"></div>
        <button class="create-list"></button>
        <button class="active-close"></button>
        <button class="close-create-list"></button>
        <button class="create-new-list"></button>
        <button class="close-task-btn"></button>
        <button class="create-task-btn"></button>
        <button class="save-changes-btn"></button>
        <ul class="list"></ul>
        <button id="prev-month"></button>
        <button id="next-month"></button>
        <select id="habit-category"></select>
        <form id="task-form">
          <input id="task-name" value="Test Task">
          <input id="start-date" value="2023-01-01">
          <input id="end-date" value="2023-01-31">
          <input id="task-time" value="12:00">
          <button type="submit"></button>
        </form>
        <div class="create-list-modal" style="display: none;"></div>
        <div class="task-modal" style="display: none;"></div>
        <div class="modal" style="display: none;"></div>
        <div id="myModal" style="display: none;"></div>
        <div id="editModal" style="display: none;"></div>
        <form id="editForm">
          <input id="editTaskName" value="Updated Task">
          <input id="editHabitCategory" value="Updated Category">
          <input id="editHabitIcon" value="📝">
          <input id="editStartDate" value="2023-02-01">
          <input id="editEndDate" value="2023-02-28">
          <input id="editTime" value="15:00">
          <button type="submit"></button>
        </form>
        <div id="habit-icon"></div>
        <div id="habit-name"></div>
        <div id="selected-habit-display" style="display: none;"></div>
        <div id="list-name" value="New Habit"></div>
        <div id="task-list"></div>
      `;
  
      // Set up mocks
      mockElements = {
        selectedEmoji: document.getElementById('selected-emoji'),
        emojiPicker: document.getElementById('emoji-picker'),
        createList: document.querySelector('.create-list'),
        closeSelectActiveModal: document.querySelector('.active-close'),
        closeCreateListBtn: document.querySelector('.close-create-list'),
        createNewListBtn: document.querySelector('.create-new-list'),
        closeTaskBtn: document.querySelector('.close-task-btn'),
        createTaskBtn: document.querySelector('.create-task-btn'),
        saveChangesBtn: document.querySelector('.save-changes-btn'),
        listElement: document.querySelector('.list'),
        prevMonthBtn: document.getElementById('prev-month'),
        nextMonthBtn: document.getElementById('next-month'),
        habitDropdown: document.getElementById('habit-category'),
        taskForm: document.getElementById('task-form'),
        editForm: document.getElementById('editForm')
      };
  
      // Mock global functions
      window.editTask = jest.fn();
      window.deleteTask = jest.fn();
  
      // Mock data
      habitList.length = 0;
      habitList.push(
        { name: 'Work', icon: '💼', task: [] },
        { name: 'Health', icon: '💪', task: [] }
      );
  
      tasks.length = 0;
      tasks.push(
        { 
          taskName: 'Meeting', 
          habitCategory: 'Work', 
          habitIcon: '💼', 
          startDate: '2023-01-10', 
          endDate: '2023-01-10', 
          time: '09:00' 
        },
        { 
          taskName: 'Workout', 
          habitCategory: 'Health', 
          habitIcon: '💪', 
          startDate: '2023-01-12', 
          endDate: '2023-01-12', 
          time: '18:00' 
        }
      );
  
      // Reset mock functions
      saveTasksToLocalStorage.mockClear();
      saveHabits.mockClear();
      addToCategory.mockClear();
      deleteTask.mockClear();
      generateCalendar.mockClear();
      selectActive.mockClear();
      editTask.mockClear();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('renderHabitList should display habits correctly', () => {
      renderHabitList(habitList);
      const listItems = document.querySelectorAll('.list-item');
      
      expect(listItems.length).toBe(2);
      expect(listItems[0].querySelector('.habit-icon').textContent).toBe('💼');
      expect(listItems[0].querySelector('.list-content-description span:nth-child(2)').textContent).toBe('Work');
      expect(listItems[0].querySelector('.habit-count').textContent).toBe('0');
      
      expect(listItems[1].querySelector('.habit-icon').textContent).toBe('💪');
      expect(listItems[1].querySelector('.list-content-description span:nth-child(2)').textContent).toBe('Health');
      expect(listItems[1].querySelector('.habit-count').textContent).toBe('0');
    });
  
    test('renderDropdown should populate the dropdown with habit options', () => {
      renderDropdown();
      const options = document.querySelectorAll('#habit-category option');
      
      expect(options.length).toBe(2);
      expect(options[0].textContent).toBe('💼 Work');
      expect(options[1].textContent).toBe('💪 Health');
    });
  
    test('renderTasks should display all tasks', () => {
      renderTasks();
      const taskItems = document.querySelectorAll('.task-item');
      
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].querySelector('.task-title').textContent).toBe('💼 Work');
      expect(taskItems[0].querySelector('.task-name').textContent).toBe('Meeting');
      expect(taskItems[0].querySelector('.start-date').textContent).toBe('2023-01-10');
      
      expect(taskItems[1].querySelector('.task-title').textContent).toBe('💪 Health');
      expect(taskItems[1].querySelector('.task-name').textContent).toBe('Workout');
      expect(taskItems[1].querySelector('.task-time').textContent).toBe('18:00');
    });
  
    test('closeModal should hide all modals', () => {
      // Set modals to visible first
      document.querySelector('.modal').style.display = 'block';
      document.getElementById('myModal').style.display = 'block';
      document.querySelector('.task-modal').style.display = 'block';
      
      closeModal();
      
      expect(document.querySelector('.modal').style.display).toBe('none');
      expect(document.getElementById('myModal').style.display).toBe('none');
      expect(document.querySelector('.task-modal').style.display).toBe('none');
    });
  
    test('setupEmojiPicker should create emoji items', () => {
      setupEmojiPicker();
      const emojiItems = document.querySelectorAll('.emoji-item');
      
      // There are 48 emojis in the list
      expect(emojiItems.length).toBe(48);
      
      // Test clicking on an emoji
      emojiItems[0].click();
      expect(document.getElementById('selected-emoji').textContent).toBe('📋');
      expect(document.getElementById('emoji-picker').classList.contains('active')).toBe(false);
    });
  
    test('initializeUI sets up event listeners correctly', () => {
      // Mock the event listeners
      const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
      
      initializeUI();
      
      // Check number of event listeners added
      expect(addEventListenerSpy).toHaveBeenCalledTimes(10);
      
      // Simulate click on createList button
      document.querySelector('.create-list').click();
      expect(document.querySelector('.create-list-modal').style.display).toBe('block');
      
      // Simulate click on closeCreateListBtn
      document.querySelector('.close-create-list').click();
      expect(document.querySelector('.create-list-modal').style.display).toBe('none');
      
      // Simulate click on createTaskBtn
      document.querySelector('.create-task-btn').click();
      expect(document.querySelector('.task-modal').style.display).toBe('block');
      
      // Clean up
      addEventListenerSpy.mockRestore();
    });
  
    test('habitDropdown change event updates the selected habit display', () => {
      initializeUI();
      
      // Simulate selecting a habit from the dropdown
      document.getElementById('habit-category').value = 0; // First option (Work)
      const changeEvent = new Event('change');
      document.getElementById('habit-category').dispatchEvent(changeEvent);
      
      expect(document.getElementById('habit-icon').textContent).toBe('💼');
      expect(document.getElementById('habit-name').textContent).toBe('Work');
      expect(document.getElementById('selected-habit-display').style.display).toBe('flex');
    });
  
    test('createNewListBtn click should add a new habit category', () => {
      // Mock getElementById to return an input with value
      document.getElementById = jest.fn().mockImplementation((id) => {
        if (id === 'list-name') {
          return { value: 'Reading' };
        } else if (id === 'selected-emoji') {
          return { textContent: '📚' };
        }
        return mockElements[id] || document.querySelector(`#${id}`);
      });
      
      initializeUI();
      
      // Create new list button event
      const createListEvent = new MouseEvent('click');
      Object.defineProperty(createListEvent, 'preventDefault', { value: jest.fn() });
      document.querySelector('.create-new-list').dispatchEvent(createListEvent);
      
      expect(addToCategory).toHaveBeenCalledWith('Reading', '📚');
      expect(saveHabits).toHaveBeenCalled();
      expect(saveTasksToLocalStorage).toHaveBeenCalled();
    });
  
    test('taskForm submission adds a new task', () => {
      habitList[0].task = [];
      
      initializeUI();
      
      // Set up form values and submit
      document.getElementById('habit-category').value = 0; // Select first habit
      
      const submitEvent = new Event('submit');
      Object.defineProperty(submitEvent, 'preventDefault', { value: jest.fn() });
      document.getElementById('task-form').dispatchEvent(submitEvent);
      
      // Check if task was added to habitList and tasks
      expect(habitList[0].task.length).toBe(1);
      expect(tasks.length).toBe(3); // Initial 2 + 1 new
      expect(saveHabits).toHaveBeenCalled();
      expect(saveTasksToLocalStorage).toHaveBeenCalled();
    });
  
    test('editForm submission updates an existing task', () => {
      // Set current edit index
      global.currentEditIndex = 0;
      
      initializeUI();
      
      // Submit edit form
      const submitEvent = new Event('submit');
      Object.defineProperty(submitEvent, 'preventDefault', { value: jest.fn() });
      document.getElementById('editForm').dispatchEvent(submitEvent);
      
      // Verify task was updated
      expect(tasks[0].taskName).toBe('Updated Task');
      expect(tasks[0].habitCategory).toBe('Updated Category');
      expect(tasks[0].startDate).toBe('2023-02-01');
      expect(localStorage.setItem).toHaveBeenCalledWith('tasks', expect.any(String));
    });
  
    test('month navigation buttons update currentDate and regenerate calendar', () => {
      // Mock currentDate
      const initialDate = new Date(2023, 0, 1); // January 1, 2023
      global.currentDate = initialDate;
      
      initializeUI();
      
      // Click previous month
      document.getElementById('prev-month').click();
      expect(global.currentDate.getMonth()).toBe(11); // Should be December (previous month)
      expect(global.currentDate.getFullYear()).toBe(2022);
      expect(generateCalendar).toHaveBeenCalledWith(global.currentDate);
      
      // Click next month (from December back to January)
      document.getElementById('next-month').click();
      expect(global.currentDate.getMonth()).toBe(0); // Should be January
      expect(global.currentDate.getFullYear()).toBe(2023);
      expect(generateCalendar).toHaveBeenCalledTimes(2);
    });
  });