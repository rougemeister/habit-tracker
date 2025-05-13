// storage.test.js
import {
    Category,
    Habit,
    tasks,
    habitList,
    saveTasksToLocalStorage,
    saveHabits,
    addHabit,
    createCategory,
    addToCategory,
    deleteTask,
    formatDate
  } from '../src/scripts/storage.js';
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      })
    };
  })();
  
  // Mock confirm function
  global.confirm = jest.fn(() => true);
  
  // Mock console.log (for debugging that exists in the code)
  global.console = {
    ...global.console,
    log: jest.fn()
  };
  
  describe('Storage Module', () => {
    beforeAll(() => {
      // Setup mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      });
    });
  
    beforeEach(() => {
      // Clear mocks before each test
      jest.clearAllMocks();
      localStorageMock.clear();
      
      // Clear tasks and habitList arrays
      tasks.length = 0;
      habitList.length = 0;
    });
  
    describe('Category Class', () => {
      test('should create a Category with correct properties', () => {
        const category = new Category('Exercise', '🏃');
        
        expect(category.name).toBe('Exercise');
        expect(category.icon).toBe('🏃');
        expect(category.count).toBe(0);
        expect(category.task).toEqual([]);
      });
  
      test('should increase count when increase method is called', () => {
        const category = new Category('Exercise', '🏃');
        category.increase();
        
        expect(category.count).toBe(1);
      });
  
      test('should decrease count when decrease method is called', () => {
        const category = new Category('Exercise', '🏃');
        category.count = 2;
        category.decrease();
        
        expect(category.count).toBe(1);
      });
    });
  
    describe('Habit Class', () => {
      test('should create a Habit with correct properties', () => {
        const habit = new Habit(
          'Morning Run', 
          '2025-05-13', 
          '2025-05-20', 
          'Exercise', 
          '09:00',
          '🏃'
        );
        
        expect(habit.name).toBe('Morning Run');
        expect(habit.startDate).toBe('2025-05-13');
        expect(habit.endDate).toBe('2025-05-20');
        expect(habit.category).toBe('Exercise');
        expect(habit.time).toBe('09:00');
        expect(habit.icon).toBe('🏃');
      });
    });
  
    describe('saveTasksToLocalStorage function', () => {
      test('should save tasks to localStorage', () => {
        // Add a task to the tasks array
        tasks.push({
          taskName: 'Test Task',
          habitCategory: 'Exercise',
          habitIcon: '🏃',
          startDate: '2025-05-13',
          endDate: '2025-05-20',
          time: '09:00'
        });
        
        // Call the function
        saveTasksToLocalStorage();
        
        // Check if localStorage.setItem was called with the right arguments
        expect(localStorageMock.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });
    });
  
    describe('saveHabits function', () => {
      test('should save habitList to localStorage', () => {
        // Add a habit to the habitList array
        habitList.push(new Category('Exercise', '🏃'));
        
        // Call the function
        saveHabits();
        
        // Check if localStorage.setItem was called with the right arguments
        expect(localStorageMock.setItem).toHaveBeenCalledWith('habitList', JSON.stringify(habitList));
      });
    });
  
  
    describe('addHabit function', () => {
      test('should add a habit and save it', () => {
        // Define a habit
        const habit = new Habit(
          'Morning Run', 
          '2025-05-13', 
          '2025-05-20', 
          'Exercise', 
          '09:00',
          '🏃'
        );
        
        // Call addHabit
        addHabit(habit);
        
        // Check if habit was added to habitList array
        expect(habitList).toContain(habit);
        
        // Check if saveHabits was called
        expect(localStorageMock.setItem).toHaveBeenCalledWith('habitList', JSON.stringify(habitList));
      });
    });
  
    describe('createCategory function', () => {
      test('should create and return a new Category', () => {
        const category = createCategory('Exercise', '🏃');
        
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe('Exercise');
        expect(category.icon).toBe('🏃');
      });
    });
  
    describe('addToCategory function', () => {
      test('should add a category to habitList and save it', () => {
        // Call addToCategory
        addToCategory('Exercise', '🏃');
        
        // Check if a category was added to habitList
        expect(habitList.length).toBe(1);
        expect(habitList[0].name).toBe('Exercise');
        expect(habitList[0].icon).toBe('🏃');
        
        // Check if both save functions were called
        expect(localStorageMock.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
        expect(localStorageMock.setItem).toHaveBeenCalledWith('habitList', JSON.stringify(habitList));
      });
    });
  
    describe('deleteTask function', () => {
      beforeEach(() => {
        // Setup task and category
        const task = {
          taskName: 'Test Task',
          habitCategory: 'Exercise',
          habitIcon: '🏃',
          startDate: '2025-05-13',
          endDate: '2025-05-20',
          time: '09:00'
        };
        
        // Create category and add task to it
        const category = new Category('Exercise', '🏃');
        category.task.push({
          taskName: 'Test Task',
          startDate: '2025-05-13',
          endDate: '2025-05-20',
          time: '09:00'
        });
        
        // Add to global arrays
        tasks.push(task);
        habitList.push(category);
      });
  
      test('should delete the task when confirmed', () => {
        // Call deleteTask
        deleteTask(0);
        
        // Check if task was removed from tasks array
        expect(tasks.length).toBe(0);
        
        // Check if task was removed from category
        expect(habitList[0].task.length).toBe(0);
        
        // Check if both save functions were called
        expect(localStorageMock.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
        expect(localStorageMock.setItem).toHaveBeenCalledWith('habitList', JSON.stringify(habitList));
      });
  
      test('should not delete the task if not confirmed', () => {
        // Override confirm to return false this time
        global.confirm = jest.fn(() => false);
        
        // Call deleteTask
        deleteTask(0);
        
        // Check if task was NOT removed
        expect(tasks.length).toBe(1);
        
        // Check if save functions were NOT called
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
      });
    });
  
    describe('formatDate function', () => {
      test('should format the date correctly', () => {
        const date = new Date(2025, 4, 13); // May 13, 2025
        const formattedDate = formatDate(date);
        
        expect(formattedDate).toBe('2025-05-13');
      });
  
      test('should pad single digit month and day with leading zeros', () => {
        const date = new Date(2025, 0, 1); // January 1, 2025
        const formattedDate = formatDate(date);
        
        expect(formattedDate).toBe('2025-01-01');
      });
    });
  });