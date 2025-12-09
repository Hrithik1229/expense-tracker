# Personal Expense Tracker

A simple full-stack personal expense tracker web application that allows users to record, view, and manage daily expenses.

Built using:
- HTML, CSS, JavaScript (Frontend)
- Node.js + Express (Backend)
- MySQL (Database)

---

## Features

- Add new expenses
- View expense list
- Delete expenses
- Automatic total expense calculation
- Data stored permanently in MySQL
- Indian date format display
- Backend API using Express

---

## Project Structure

```
EXPENSE_TRACKER/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env (ignored)
│   └── node_modules/ (ignored)
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── Schema.sql
├── .gitignore
└── README.md
```
The database schema is provided in `Schema.sql`.  
Run this file in MySQL before starting the backend server.
