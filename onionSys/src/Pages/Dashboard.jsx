import { useEffect, useState } from "react";
import api from "../services/api.js";

const money = (value) => `৳ ${Number(value || 0).toLocaleString()}`;
const kg = (value) => `${Number(value || 0).toLocaleString()} kg`;

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reports/dashboard")
      .then((res) => setData(res.data.data || {}))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    ["Current Stock", kg(data.currentStock), "green"],
    ["Cash Balance", money(data.cashBalance), "green"],
    ["Bank Balance", money(data.bankBalance), "blue"],
    ["Net Profit", money(data.profit), Number(data.profit || 0) >= 0 ? "green" : "red"],
    ["Total Purchase", money(data.totalPurchase), "amber"],
    ["Total Sales", money(data.totalSales), "blue"],
    ["Total Expense", money(data.totalExpense), "red"],
    ["Supplier Due", money(data.supplierDue), "red"],
    ["Mokam Due", money(data.mokamDue), "amber"],
    ["Expense Due", money(data.expenseDue), "red"],
    ["Loan Due", money(data.loanDue), "amber"],
    ["Collections", money(data.totalCollection), "green"]
  ];

  return (
    <section className="grid">
      {loading && <div className="notice">Loading dashboard...</div>}
      <div className="cards">
        {cards.map(([label, value, tone]) => (
          <div className={`card ${tone}`} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
