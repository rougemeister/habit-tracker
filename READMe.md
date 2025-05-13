Here’s a complete, well-structured `README.md` documentation tailored for your [Habit Tracker](https://rougemeister.github.io/habit-tracker/) app:

---

# 🧠 Habit Tracker

A simple and interactive **habit tracking app** to help users build and maintain productive routines.
Create habit categories, assign tasks, visualize them on a calendar, and manage your goals effectively.

🔗 **Live Demo**: [rougemeister.github.io/habit-tracker](https://rougemeister.github.io/habit-tracker)
📦 **Source Code**: [GitHub Repo](https://github.com/rougemeister/habit-tracker)

---

## ✨ Features

* ✅ **Create Habit Categories** with custom icons and task lists
* 🗓️ **Interactive Calendar** with clickable dates
* 📅 **Date Range Selection** for start and end of tasks
* ⏰ **Task Time Input** with time picker
* 📝 **Edit & Delete Tasks**
* 📊 **Modal Popups** for task overviews by category
* 🌙 **Real-Time Date, Time & Greeting Display**

---

## 📸 Screenshots

![Habit Tracker UI](https://raw.githubusercontent.com/rougemeister/habit-tracker/main/screenshot.png) <!-- Replace with your actual image path if needed -->

---

## 🧰 Tech Stack

* **Vanilla JavaScript** (ES Modules)
* **HTML5 + CSS3**
* **DOM Manipulation**
* **Jest** for testing
* **LocalStorage** for persistent state

---

## 🚀 Getting Started

### 🛠️ Prerequisites

* Node.js v16+ (for testing)
* Git (for cloning the repo)

### 📦 Installation

```bash
git clone https://github.com/rougemeister/habit-tracker.git
cd habit-tracker
npm install
```

### 🔧 Run Locally

You can open the app in your browser by opening `index.html` directly or using a local server like:

```bash
npx serve .
```

---

## 🧪 Running Tests

The project uses **Jest** for testing core logic.

### 🧰 Setup

Make sure you have:

* `jest`
* `babel-jest`
* `@babel/preset-env`

### 🔍 Run Tests

```bash
npm test
```

> Make sure `.babelrc` is set up correctly with:

```json
{
  "presets": ["@babel/preset-env"]
}
```

---

## 📁 Project Structure

```
habit-tracker/
├── src/
│   ├── css/
│   │   └── styles.css             # Styling
│   └── scripts/
│       ├── habitTracker.js        # Core logic (calendar, modal, date logic)
│       ├── script.js              # Main entry (DOM/event bindings)
│       ├── storage.js             # LocalStorage utilities
│       └── ui.js                  # UI helper functions
├── test/
│   ├── habitTrack.test.js         # Tests for habitTracker.js
│   ├── storage.test.js            # Tests for storage.js
├── index.html                     # Main HTML file
├── .babelrc                       # Babel configuration
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

```

---

## ✍️ Author

**Rougemeister**
🔗 GitHub: [@rougemeister](https://github.com/rougemeister)

---

## 📄 License
None

---

## 💡 Future Improvements

* 📱 Responsive design
* 📈 Habit progress analytics
* 🔔 Notifications/reminders
* 🧩 Drag-and-drop calendar interface

