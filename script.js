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

const listElement = document.querySelector('.list');

function selectActive(container) {
    container.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('li');
      if (!clickedItem || !container.contains(clickedItem)) return;
  
      container.querySelector('.active')?.classList.remove('active');
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




const prince = {
    name: "Prince",
}

let anotherObject = prince


anotherObject.name = "John"
console.log(prince.name)