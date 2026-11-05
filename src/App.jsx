import { useEffect, useState } from "react";
import "./App.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = "http://localhost:5000/api/expenses";
const CATEGORY_ICONS = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Education: "📚",
  Bills: "🧾",
  Healthcare: "💊",
  Others: "💳",
};

const normalizeExpense = (expense) => ({
  ...expense,
  id: expense._id,
  date: expense.date ? String(expense.date).slice(0, 10) : "",
});

const getSavedBudget = () => {
  try {
    const saved = Number(localStorage.getItem("monthlyBudget"));
    return saved > 0 ? saved : 10000;
  } catch {
    return 10000;
  }
};

function App() {
  // ---------- State (all hooks at the top) ----------
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(getSavedBudget);
  const [budgetInput, setBudgetInput] = useState(String(getSavedBudget()));

  // ---------- Fetch expenses ----------
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const fetchExpenses = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        setExpenses(data.map(normalizeExpense));
        setError("");
      } catch (err) {
        if (err.name === "AbortError") {
          setError("Server took too long to respond. Is the backend running?");
        } else {
          console.error("Error fetching expenses:", err);
          setError("Unable to load expenses. Please check your server connection.");
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchExpenses();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // ---------- Persist budget ----------
  useEffect(() => {
    try {
      localStorage.setItem("monthlyBudget", String(monthlyBudget));
    } catch {
      // ignore storage errors
    }
  }, [monthlyBudget]);

  // ---------- Derived data ----------
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
    if (!expense.date) return false;
    const expenseDate = new Date(expense.date + "T00:00:00");
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const totalExpenses = monthlyExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const categoryTotals = {};
  monthlyExpenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + Number(expense.amount);
  });

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#6366f1",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
          "#ec4899",
          "#64748b",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const actualBudgetPercentage = (totalExpenses / monthlyBudget) * 100;
  const budgetPercentage = Math.min(actualBudgetPercentage, 100);

  const budgetMessage =
    actualBudgetPercentage >= 100
      ? "You have exceeded your monthly budget!"
      : actualBudgetPercentage >= 80
      ? "Warning: You have used most of your monthly budget."
      : actualBudgetPercentage >= 50
      ? "You have used more than half of your monthly budget."
      : "Your spending is within the budget.";

  // ---------- Handlers ----------
  const updateBudget = (e) => {
    e.preventDefault();
    const newBudget = Number(budgetInput);

    if (!budgetInput || !(newBudget > 0)) {
      alert("Please enter a valid budget greater than zero.");
      return;
    }

    setMonthlyBudget(newBudget);
  };

  const addExpense = async (expense) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date,
        }),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      const savedExpense = await response.json();
      setExpenses((prev) => [...prev, normalizeExpense(savedExpense)]);
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Unable to save expense. Please try again.");
    }
  };

  const updateExpense = async (updatedExpense) => {
    try {
      const response = await fetch(`${API_URL}/${updatedExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: updatedExpense.amount,
          category: updatedExpense.category,
          description: updatedExpense.description,
          date: updatedExpense.date,
        }),
      });

      if (!response.ok) throw new Error("Failed to update expense");

      const savedExpense = await response.json();

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === updatedExpense.id ? normalizeExpense(savedExpense) : expense
        )
      );

      setExpenseToEdit(null);
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Unable to update expense. Please try again.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));

      if (expenseToEdit?.id === id) {
        setExpenseToEdit(null);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Unable to delete expense. Please try again.");
    }
  };

  const exportToCSV = () => {
    if (expenses.length === 0) {
      alert("No expenses available to export.");
      return;
    }

    const headers = ["Date", "Description", "Category", "Amount"];
    const rows = expenses.map((e) => [e.date, e.description, e.category, e.amount]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smart-expense-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ---------- Render ----------
  if (loading) {
    return <div className="loading-message">Loading expenses...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Smart Expense Manager</h1>
          <p>Track your spending and manage your budget</p>
        </div>

        <div className="profile">
          <span>👤</span>
          <span>My Account</span>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      <main className="container">
        <section className="summary-grid">
          <div className="summary-card">
            <p>Total Expenses</p>
            <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
            <span>This month</span>
          </div>

          <div className="summary-card">
            <p>Monthly Budget</p>
            <h2>₹{monthlyBudget.toLocaleString("en-IN")}</h2>

            <form onSubmit={updateBudget}>
              <input
                type="number"
                min="1"
                placeholder="Enter monthly budget"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
              <button type="submit">Update Budget</button>
            </form>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>

            <span>{budgetPercentage.toFixed(1)}% used</span>
            <p className="budget-message">{budgetMessage}</p>
          </div>

          <div className="summary-card">
            <p>Remaining</p>
            <h2>₹{(monthlyBudget - totalExpenses).toLocaleString("en-IN")}</h2>
            <span>Budget remaining</span>
          </div>
        </section>

        <section className="content-grid">
          <ExpenseForm
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            expenseToEdit={expenseToEdit}
            onCancelEdit={() => setExpenseToEdit(null)}
          />

          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
            onEdit={setExpenseToEdit}
            onExport={exportToCSV}
          />
        </section>

        <section className="card category-card">
          <div className="card-header">
            <h2>Spending by Category</h2>
            <p>See where your money is going</p>
          </div>

          {Object.keys(categoryTotals).length === 0 ? (
            <p className="no-data">No category data available yet.</p>
          ) : (
            <div className="category-chart">
              <div className="chart-container">
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>

              <div className="category-list">
                {Object.entries(categoryTotals).map(([category, amount]) => (
                  <div className="category-row" key={category}>
                    <strong>{category}</strong>
                    <strong>₹{amount.toLocaleString("en-IN")}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ExpenseForm({ onAddExpense, onUpdateExpense, expenseToEdit, onCancelEdit }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const isEditing = expenseToEdit !== null;

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(String(expenseToEdit.amount));
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description);
      setDate(expenseToEdit.date);
      return;
    }

    setAmount("");
    setCategory("Food");
    setDescription("");
    setDate("");
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !description || !date) {
      alert("Please fill all fields");
      return;
    }

    const expense = {
      id: expenseToEdit?.id,
      amount,
      category,
      description,
      date,
    };

    if (isEditing) {
      onUpdateExpense(expense);
    } else {
      onAddExpense(expense);
      setAmount("");
      setDescription("");
      setDate("");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>
        <p>{isEditing ? "Update the selected expense" : "Record a new expense"}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.keys(CATEGORY_ICONS).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label>Description</label>
        <input
          type="text"
          placeholder="e.g. Lunch at college"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <div className="form-actions">
          <button type="submit">{isEditing ? "Save Changes" : "+ Add Expense"}</button>

          {isEditing && (
            <button className="cancel-btn" type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ExpenseList({ expenses, onDelete, onEdit, onExport }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredExpenses = sortedExpenses.filter((expense) => {
    const categoryMatch =
      selectedCategory === "All" || expense.category === selectedCategory;

    const monthMatch =
      selectedMonth === "All" || (expense.date || "").startsWith(selectedMonth);

    return categoryMatch && monthMatch;
  });

  const availableMonths = [
    ...new Set(expenses.filter((e) => e.date).map((e) => e.date.slice(0, 7))),
  ]
    .sort()
    .reverse();

  return (
    <div className="card">
      <div className="card-header expense-header">
        <div>
          <h2>Recent Expenses</h2>
          <p>Your latest transactions</p>
        </div>

        <button className="export-btn" onClick={onExport} type="button">
          Export CSV
        </button>
      </div>

      <div className="expense-filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {Object.keys(CATEGORY_ICONS).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="All">All Months</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {new Date(month + "-01T00:00:00").toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={() => {
            setSelectedCategory("All");
            setSelectedMonth("All");
          }}
        >
          Clear Filters
        </button>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty">
          <div>💸</div>
          <p>No matching expenses found.</p>
          <span>Try changing your category or month filters.</span>
        </div>
      ) : (
        <div className="expense-list">
          {filteredExpenses.map((expense) => (
            <div className="expense-item" key={expense.id}>
              <div className="expense-icon">
                {CATEGORY_ICONS[expense.category] || "💳"}
              </div>

              <div className="expense-info">
                <h3>{expense.description}</h3>
                <p>
                  {expense.category} • {expense.date}
                </p>
              </div>

              <strong>₹{expense.amount}</strong>

              <div className="expense-actions">
                <button className="edit-btn" onClick={() => onEdit(expense)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(expense.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
