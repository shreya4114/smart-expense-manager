# Smart Expense & Budget Manager

A full-stack web application designed to help users track daily expenses, manage monthly budgets, analyse spending patterns and maintain better financial discipline.

**Live Demo:** https://smart-expense-manager-blush.vercel.app

**Backend API:** https://smart-expense-manager-api-86lr.onrender.com

---

## 1. Project Overview

Smart Expense & Budget Manager is a web-based expense tracking application developed using React, Node.js, Express.js and MongoDB.

The application allows users to record, update and delete expenses, organise transactions by category, monitor monthly spending and compare expenses against a custom monthly budget.

It provides a dashboard with visual spending analysis, budget alerts, filtering options and CSV export functionality.

## 2. Key Features

- **Expense Management:** Add, view, edit and delete expenses.
- **MongoDB Integration:** Store expense records in MongoDB Atlas.
- **Monthly Budget Management:** Set and update a monthly spending limit.
- **Expense Tracking:** Calculate total monthly expenses and remaining budget.
- **Budget Alerts:** Display spending messages based on budget utilisation.
- **Category-wise Analysis:** Visualise expenses using a doughnut chart.
- **Expense Filters:** Filter transactions by category and month.
- **CSV Export:** Download expense records in CSV format.
- **Data Persistence:** Retrieve saved expenses after refreshing the application.
- **Input Validation:** Validate expense details before saving.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Programming Language | JavaScript |
| Styling | CSS |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Charts | Chart.js, react-chartjs-2 |
| API Communication | Fetch API |
| Version Control | Git and GitHub |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## 4. Application Architecture

The application follows a client-server architecture.

1. The React frontend provides the user interface.
2. The Fetch API sends HTTP requests to the Express backend.
3. Express handles API requests through expense routes.
4. Mongoose communicates with MongoDB Atlas.
5. MongoDB stores and retrieves expense records.
6. The backend returns JSON responses to the frontend.

**Architecture Flow:**

```text
        USER
          |
          v
   REACT FRONTEND
       (Vercel)
          |
          v
      FETCH API
          |
          v
   EXPRESS BACKEND
       (Render)
          |
          v
       MONGOOSE
          |
          v
    MONGODB ATLAS
```

## 5. Main Functional Modules

### Expense Management
Users can create new expenses, modify existing transactions and delete unwanted records.

### Budget Management
Users can define a monthly budget and monitor the percentage of their budget utilised.

### Spending Analysis
A doughnut chart presents category-wise spending to help users understand their expenditure patterns.

### Filtering and Export
Users can filter transactions by category and month and export expense records into CSV format.

## 6. Expense Categories

The application supports the following categories:

- Food
- Transport
- Shopping
- Entertainment
- Education
- Bills
- Healthcare
- Others

## 7. Project Structure

```text
smart-expense-manager/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── ...
│
├── server/
│   ├── models/
│   │   └── Expense.js
│   │
│   ├── routes/
│   │   └── expenseRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

*Note: The `.env` file is local and must not be uploaded to GitHub.*

## 8. Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Git

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd smart-expense-manager
```

### Step 2: Install frontend dependencies

```bash
npm install
```

### Step 3: Install backend dependencies

```bash
cd server
npm install
```

### Step 4: Configure environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the MongoDB URI with your own Atlas connection string.

### Step 5: Start the backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Step 6: Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

**Note:** For local development, configure the frontend API requests to use `http://localhost:5000/api/expenses`. The deployed frontend currently uses the Render backend URL.

## 9. API Endpoints

Base URL:

```text
https://smart-expense-manager-api-86lr.onrender.com/api/expenses
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all expenses |
| POST | `/` | Add a new expense |
| PUT | `/:id` | Update an existing expense |
| DELETE | `/:id` | Delete an expense |

### Sample Expense Object

```json
{
  "amount": 500,
  "category": "Food",
  "description": "Lunch at college",
  "date": "2026-11-03"
}
```

## 10. Database Design

The application uses MongoDB Atlas to store expense records.

Each expense document contains:

| Field | Description |
|---|---|
| `_id` | Unique MongoDB document ID |
| `amount` | Expense amount |
| `category` | Expense category |
| `description` | Expense details |
| `date` | Expense date |
| `createdAt` | Record creation timestamp |
| `updatedAt` | Record update timestamp |

The monthly budget is currently maintained in browser local storage.

## 11. Testing

The following functional tests were performed:

| Test Case | Expected Result |
|---|---|
| Add expense | Expense saved successfully |
| Edit expense | Existing expense updated |
| Delete expense | Expense removed |
| Refresh application | Saved expenses remain visible |
| Category filter | Matching expenses displayed |
| Month filter | Selected month's expenses displayed |
| Update budget | New budget value displayed |
| Budget alert | Appropriate spending message displayed |
| Category chart | Spending visualised by category |
| CSV export | Expense data downloaded |

All listed functional tests were successfully performed during development.

## 12. Deployment

The application is deployed using cloud hosting services.

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Live Application:

https://smart-expense-manager-blush.vercel.app

Backend:

https://smart-expense-manager-api-86lr.onrender.com

## 13. Future Enhancements

- User registration and authentication.
- Personalised dashboards for multiple users.
- Recurring expense management.
- Monthly and yearly financial reports.
- Advanced search and analytics.
- Downloadable PDF reports.
- Cloud-based budget synchronisation across devices.

## 14. Learning Outcomes

Through this project, practical experience was gained in:

- Developing frontend applications using React.
- Building RESTful APIs using Node.js and Express.js.
- Integrating MongoDB Atlas with a backend application.
- Implementing CRUD operations.
- Managing application state and data persistence.
- Validating user input.
- Visualising data using Chart.js.
- Using Git and GitHub for version control.
- Deploying full-stack applications using Vercel and Render.

## 15. Author

**Shreya Mittal**

B.Tech – Computer Science and Engineering

Guru Tegh Bahadur 4th Centenary Engineering College

Guru Gobind Singh Indraprastha University

---

*Developed as an individual academic project.*
