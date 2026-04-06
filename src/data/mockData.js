import { v4 as uuidv4 } from "uuid";

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Rent",
  "Groceries",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Dining",
];

const now = new Date();
const m = (offset) => {
  const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  return d;
};
const fmt = (d, day) => {
  const dt = new Date(d.getFullYear(), d.getMonth(), day);
  return dt.toISOString().slice(0, 10);
};

const defaultTransactions = [
  // Current month
  { id: uuidv4(), date: fmt(m(0), 1), description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: uuidv4(), date: fmt(m(0), 3), description: "Grocery Run", amount: 134.5, category: "Groceries", type: "expense" },
  { id: uuidv4(), date: fmt(m(0), 5), description: "Uber Rides", amount: 48.0, category: "Transport", type: "expense" },
  { id: uuidv4(), date: fmt(m(0), 8), description: "Netflix & Spotify", amount: 28.99, category: "Entertainment", type: "expense" },
  { id: uuidv4(), date: fmt(m(0), 10), description: "Rent Payment", amount: 1400, category: "Rent", type: "expense" },
  { id: uuidv4(), date: fmt(m(0), 15), description: "Freelance Project", amount: 850, category: "Freelance", type: "income" },
  { id: uuidv4(), date: fmt(m(0), 18), description: "Electric Bill", amount: 95.0, category: "Utilities", type: "expense" },
  { id: uuidv4(), date: fmt(m(0), 22), description: "Dinner Out", amount: 67.5, category: "Dining", type: "expense" },

  // 1 month ago
  { id: uuidv4(), date: fmt(m(1), 1), description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: uuidv4(), date: fmt(m(1), 4), description: "Online Shopping", amount: 245.0, category: "Shopping", type: "expense" },
  { id: uuidv4(), date: fmt(m(1), 7), description: "Groceries", amount: 112.3, category: "Groceries", type: "expense" },
  { id: uuidv4(), date: fmt(m(1), 10), description: "Rent Payment", amount: 1400, category: "Rent", type: "expense" },
  { id: uuidv4(), date: fmt(m(1), 14), description: "Doctor Visit", amount: 180.0, category: "Healthcare", type: "expense" },
  { id: uuidv4(), date: fmt(m(1), 20), description: "Freelance Gig", amount: 600, category: "Freelance", type: "income" },
  { id: uuidv4(), date: fmt(m(1), 25), description: "Concert Tickets", amount: 120.0, category: "Entertainment", type: "expense" },

  // 2 months ago
  { id: uuidv4(), date: fmt(m(2), 1), description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: uuidv4(), date: fmt(m(2), 6), description: "Gas Bill", amount: 72.0, category: "Utilities", type: "expense" },
  { id: uuidv4(), date: fmt(m(2), 10), description: "Rent Payment", amount: 1400, category: "Rent", type: "expense" },
  { id: uuidv4(), date: fmt(m(2), 12), description: "Lunch with Friends", amount: 44.5, category: "Dining", type: "expense" },
  { id: uuidv4(), date: fmt(m(2), 18), description: "New Sneakers", amount: 189.0, category: "Shopping", type: "expense" },

  // 3 months ago
  { id: uuidv4(), date: fmt(m(3), 1), description: "Monthly Salary", amount: 5000, category: "Salary", type: "income" },
  { id: uuidv4(), date: fmt(m(3), 10), description: "Rent Payment", amount: 1400, category: "Rent", type: "expense" },
  { id: uuidv4(), date: fmt(m(3), 15), description: "Groceries", amount: 156.8, category: "Groceries", type: "expense" },
  { id: uuidv4(), date: fmt(m(3), 20), description: "Taxi", amount: 35.0, category: "Transport", type: "expense" },
  { id: uuidv4(), date: fmt(m(3), 22), description: "Freelance Work", amount: 450, category: "Freelance", type: "income" },

  // 4 months ago
  { id: uuidv4(), date: fmt(m(4), 1), description: "Monthly Salary", amount: 5000, category: "Salary", type: "income" },
  { id: uuidv4(), date: fmt(m(4), 10), description: "Rent Payment", amount: 1400, category: "Rent", type: "expense" },
  { id: uuidv4(), date: fmt(m(4), 14), description: "Water Bill", amount: 45.0, category: "Utilities", type: "expense" },
  { id: uuidv4(), date: fmt(m(4), 18), description: "Movie Night", amount: 32.0, category: "Entertainment", type: "expense" },

  // 5 months ago
  { id: uuidv4(), date: fmt(m(5), 1), description: "Monthly Salary", amount: 5000, category: "Salary", type: "income" },
  { id: uuidv4(), date: fmt(m(5), 10), description: "Rent Payment", amount: 1350, category: "Rent", type: "expense" },
  { id: uuidv4(), date: fmt(m(5), 20), description: "Dental Checkup", amount: 210.0, category: "Healthcare", type: "expense" },
];

// ── Helpers ──

export function getMonthlyTotals(txns) {
  const map = {};
  txns.forEach((t) => {
    const key = t.date.slice(0, 7); // "YYYY-MM"
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  // sort by key
  const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([month, vals]) => ({ month, ...vals, net: vals.income - vals.expense }));
}

export function getCategoryBreakdown(txns) {
  const map = {};
  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }));
}

export function getTotalBalance(txns) {
  return txns.reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);
}

export function getTotalIncome(txns) {
  return txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
}

export function getTotalExpenses(txns) {
  return txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
}

export function getHighestCategory(txns) {
  const bd = getCategoryBreakdown(txns);
  return bd.length ? bd[0] : { category: "N/A", total: 0 };
}

export function getMonthlyComparison(txns) {
  const totals = getMonthlyTotals(txns);
  if (totals.length < 2) return { current: totals[0] || {}, previous: {}, incomeChange: 0, expenseChange: 0 };
  const curr = totals[totals.length - 1];
  const prev = totals[totals.length - 2];
  const incomeChange = prev.income ? ((curr.income - prev.income) / prev.income) * 100 : 0;
  const expenseChange = prev.expense ? ((curr.expense - prev.expense) / prev.expense) * 100 : 0;
  return { current: curr, previous: prev, incomeChange: Math.round(incomeChange), expenseChange: Math.round(expenseChange) };
}

export function getAvgTransaction(txns) {
  if (!txns.length) return 0;
  const total = txns.reduce((s, t) => s + t.amount, 0);
  return Math.round((total / txns.length) * 100) / 100;
}

export function getTop5Expenses(txns) {
  return txns
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
}

export function generateInsightText(txns) {
  const comp = getMonthlyComparison(txns);
  const highest = getHighestCategory(txns);
  const totals = getMonthlyTotals(txns);
  const curr = totals.length ? totals[totals.length - 1] : null;
  const insights = [];

  if (comp.expenseChange > 10) {
    insights.push(`Your expenses rose ${comp.expenseChange}% compared to last month — consider reviewing discretionary spending.`);
  } else if (comp.expenseChange < -5) {
    insights.push(`Great job! You cut expenses by ${Math.abs(comp.expenseChange)}% compared to last month.`);
  }

  if (curr && curr.income > 0) {
    const savingsRate = Math.round(((curr.income - curr.expense) / curr.income) * 100);
    if (savingsRate > 0) {
      insights.push(`You saved ${savingsRate}% of your income this month — keep it up!`);
    } else {
      insights.push(`You spent more than you earned this month. Time to tighten the budget.`);
    }
  }

  if (highest.category !== "N/A") {
    insights.push(`Your highest spending category is "${highest.category}" at $${highest.total.toLocaleString()}.`);
  }

  return insights.length ? insights : ["Add more transactions to unlock spending insights."];
}

export { CATEGORIES };
export default defaultTransactions;
