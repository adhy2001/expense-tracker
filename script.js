const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const addBtn = document.getElementById("add");
const transactionsDiv = document.getElementById("transactions");

const balanceEl = document.getElementById("balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netEl = document.getElementById("net");
const clearBtn = document.getElementById("clear");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Chart.js setup
const ctx = document.getElementById("lineChart");
let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Expenses",
        data: [],
        borderColor: "#36d1dc",
        backgroundColor: "rgba(54, 209, 220, 0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#aaa" }, grid: { display: false } },
      y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  },
});

function updateUI() {
  transactionsDiv.innerHTML = "";
  let income = 0,
    expense = 0;

  transactions.forEach((t) => {
    const div = document.createElement("div");
    div.className = `transaction ${t.type}`;
    div.innerHTML = `<span>${t.desc}</span><span>${t.type === "income" ? "+" : "-"}$${t.amount}</span>`;
    transactionsDiv.appendChild(div);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const balance = income - expense;
  balanceEl.textContent = `$${balance.toFixed(2)}`;
  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
  netEl.textContent = `$${balance.toFixed(2)}`;

  chart.data.labels = transactions.map((t) => t.desc);
  chart.data.datasets[0].data = transactions.map((t) => (t.type === "expense" ? t.amount : 0));
  chart.update();

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

addBtn.addEventListener("click", () => {
  const d = desc.value.trim();
  const a = parseFloat(amount.value);
  const t = type.value;

  if (!d || isNaN(a) || a <= 0) return alert("Enter valid details!");

  transactions.push({ desc: d, amount: a, type: t });
  desc.value = "";
  amount.value = "";
  updateUI();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    updateUI();
  }
});

updateUI();
