
const selectedEmoji = document.getElementById('selected-emoji');
const emojiPicker = document.getElementById('emoji-picker');
const createList = document.querySelector('.create-list');
const closeSelectActiveModal = document.querySelector('.active-close');
const closeCreateListBtn = document.querySelector('.close-create-list');

class Category {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.count = 0;
        this.increase = function() {
            this.count++;
        };
        this.decrease = function() {
            this.count--;
        };
    }
}


function createCategory(name, icon) {
    return new Category(name, icon);
}

function addToCategory(name, icon) {
    habitList.push(createCategory(name, icon));
}


const habitList = [
    {
        name: 'Exercise',
        count: 0,
        icon: '🏋️',
        increase(){
            this.count++
        },
        decrease(){
            this.count--
        }
    },
    {
        name: 'Cook',
        count: 0,
        icon: '🍳',
        increase(){
            this.count++
        },
        decrease(){
            this.count--
        }
    },
    {
        name: 'Vacation',
        count: 0,
        icon: '🏖️' ,
        increase(){
            this.count++
        },
        decrease(){
            this.count--
        }
    }
    
]


addToCategory('Bobba', '🏋️');

const listElement = document.querySelector('.list');

function selectActive(container) {
    container.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('li');
      if (!clickedItem || !container.contains(clickedItem)) return;
  
      container.querySelector('.active')?.classList.remove('active');
        document.querySelector('.select-active-modal').style.display = 'block';

      clickedItem.classList.add('active');
    });
    
  }
  
function renderHabitList(){
    habitList.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `<div class="list-content">
                            <div class="list-content-description">
                                <span class="habit-icon">${habit.icon}</span>
                                <span>${habit.name}</span> 
                            </div>
                            <span class="habit-count">${habit.count}</span> 
                        </div>`;
        li.classList.add('list-item');
        listElement.appendChild(li);
    })
}

renderHabitList();

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
    console.log(emoji);
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


function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}
closeCreateListBtn.addEventListener('click', closeModal);
closeSelectActiveModal.addEventListener('click', closeModal);