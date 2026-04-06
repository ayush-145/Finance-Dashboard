export function exportCSV(transactions, filename = "transactions.csv") {
  if (!transactions.length) return;
  const headers = ["Date", "Description", "Amount", "Category", "Type"];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    t.category,
    t.type,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

export function exportJSON(transactions, filename = "transactions.json") {
  if (!transactions.length) return;
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, filename, "application/json");
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
