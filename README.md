# Smart Task Manager

A powerful, responsive, and beautifully designed Task Manager built with React, TypeScript, and Tailwind CSS. This application emphasizes productivity through a clean, glassmorphism UI and a unique "Smart Syntax" feature that allows for lightning-fast task entry.

## 🚀 Features

### 🧠 Smart Syntax Task Creation
Automate your workflow and save time! You can assign priority levels or categories directly from the input box by appending `/priority` or `/Category` to your task description.
- **Example:** `"Buy groceries /1 /Home"` will create a task named "Buy groceries" with a Priority of 1 (Critical) and categorize it under "Home".

### 📊 Priority Levels
Organize your tasks by urgency using a 5-tier priority system:
- 🔴 **1: Critical**
- 🟠 **2: High**
- 🟡 **3: Medium**
- 🟢 **4: Low**
- ⚪ **5: Very Low**

### 🗂️ Grouping and Filtering
Take control of large lists by organizing how you view them:
- **Group Tasks:** Group your active tasks by Priority, Category, or Creation Date to get a structured overview.
- **Filter Tasks:** Focus on what matters most by filtering out everything except a specific priority level.

### ✍️ Post-Creation Editing (Item Menu)
Made a mistake or need to update a task? Click the 3-dot menu on any active task to:
- **Assign Category:** Opens an inline input to quickly tag the task with a one-word category.
- **Change Priority:** Select a new priority level from the dropdown.
- **Delete:** Remove the task entirely.

### 📜 Task History
Keep track of what you've accomplished. Checking off an active task automatically moves it to the **History** tab, sorted by completion time.

### 💾 Local Persistence
Your tasks are automatically saved to your browser's `localStorage`. You can close the tab or refresh the page, and your data will be right where you left it.

### 🎨 Modern UI/UX
- **Glassmorphism Design:** Beautiful translucent panels with a dark-mode aesthetic.
- **Fully Responsive:** Adapts perfectly to desktop, tablet, and mobile screens.
- **Accessible & Semantic:** Structured with proper semantic HTML for screen readers and search engines.

## 🛠️ Technology Stack
- **React** (Hooks, Functional Components)
- **TypeScript** (Strong typing for interfaces and components)
- **Tailwind CSS** (Utility-first styling, responsive design)
- **Headless UI & Heroicons** (Accessible interactive menus and icons)
- **Vite** (Next-generation frontend tooling)

## 📦 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📝 License
This project is open source and available for personal or commercial use.
