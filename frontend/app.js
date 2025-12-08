const API_BASE = "http://localhost:3000/api";

const expenseForm = document.getElementById("expense-form");
const expenseTbody = document.getElementById("expense-tbody");
const totalAmountSpan = document.getElementById("total-amount");
const emptyState = document.getElementById("empty-state");
const expenseTable = document.getElementById("expense-table");

// Set default date to today
document.getElementById("date").valueAsDate = new Date();

// --- Chart.js Setup ---
let myChart = null; // Will hold the chart instance

function updateChart(expenses) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  
  // 1. Group amounts by category
  const categories = {};
  expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + Number(exp.amount);
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  // Destroy old chart if exists to prevent overlapping
  if (myChart) myChart.destroy();

  // Create new chart
  myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [{
              data: data,
              backgroundColor: [
                  '#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'
              ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: { position: 'bottom' }
          }
      }
  });
}

// --- Notification System (Toast) ---
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- Core Logic ---

async function fetchExpenses() {
  try {
    const res = await fetch(`${API_BASE}/expenses`);
    const data = await res.json();
    renderExpenses(data);
    updateChart(data); // Update chart when data loads
  } catch (err) {
    console.error("Error fetching expenses:", err);
    showToast("Error loading data");
  }
}

function renderExpenses(expenses) {
  expenseTbody.innerHTML = "";
  let total = 0;

  // Toggle Empty State
  if (expenses.length === 0) {
      emptyState.classList.remove("hidden");
      expenseTable.classList.add("hidden");
  } else {
      emptyState.classList.add("hidden");
      expenseTable.classList.remove("hidden");
  }

  expenses.forEach((exp) => {
    total += Number(exp.amount);
    const tr = document.createElement("tr");

    // Format date nicely
    const dateObj = new Date(exp.expense_date);
    const dateStr = dateObj.toLocaleDateString();

    tr.innerHTML = `
      <td><strong>${exp.title}</strong></td>
      <td><span class="badge">${exp.category || "Other"}</span></td>
      <td style="color: #6b7280; font-size: 0.85rem;">${dateStr}</td>
      <td style="font-weight: bold;">₹${Number(exp.amount).toFixed(2)}</td>
      <td><button class="delete-btn" data-id="${exp.id}">×</button></td>
    `;
    expenseTbody.appendChild(tr);
  });

  totalAmountSpan.textContent = total.toFixed(2);
}

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Gather data
  const formData = {
      title: document.getElementById("title").value.trim(),
      amount: document.getElementById("amount").value,
      category: document.getElementById("category").value,
      expense_date: document.getElementById("date").value
  };

  try {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        // Don't reset category or date, user might want to add multiple for same day
        fetchExpenses();
        showToast("Expense added successfully!");
    } else {
        showToast("Failed to add expense");
    }
  } catch (err) {
    console.error(err);
    showToast("Server Error");
  }
});

expenseTbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");

    // UX: Soft confirm (browsers native confirm is okay, but styled modal is better. 
    // Stick to native for simplicity but use Toast for success)
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
          fetchExpenses();
          showToast("Expense deleted");
      }
    } catch (err) {
      console.error(err);
    }
  }
});

// Initial load
fetchExpenses();