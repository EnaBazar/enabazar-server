import { useEffect, useState } from "react";
import {
  Package,
  Wallet,
  Landmark,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Receipt,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import api from "../services/api.js";

const money = (value) => `৳ ${Number(value || 0).toLocaleString()}`;
const kg = (value) => `${Number(value || 0).toLocaleString()} kg`;

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/reports/dashboard")
      .then((res) => setData(res.data.data || {}))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Current Stock",
      value: kg(data.currentStock),
      icon: Package,
      color: "green",
    },
    {
      title: "Cash Balance",
      value: money(data.cashBalance),
      icon: Wallet,
      color: "emerald",
    },
    {
      title: "Bank Balance",
      value: money(data.bankBalance),
      icon: Landmark,
      color: "blue",
    },
    {
      title: "Net Profit",
      value: money(data.profit),
      icon: TrendingUp,
      color: Number(data.profit || 0) >= 0 ? "green" : "red",
    },
    {
      title: "Total Purchase",
      value: money(data.totalPurchase),
      icon: ShoppingCart,
      color: "amber",
    },
    {
      title: "Total Sales",
      value: money(data.totalSales),
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Total Expense",
      value: money(data.totalExpense),
      icon: Receipt,
      color: "red",
    },
    {
      title: "Supplier Due",
      value: money(data.supplierDue),
      icon: CreditCard,
      color: "rose",
    },
    {
      title: "Mokam Due",
      value: money(data.mokamDue),
      icon: AlertCircle,
      color: "orange",
    },
    {
      title: "Expense Due",
      value: money(data.expenseDue),
      icon: Receipt,
      color: "red",
    },
    {
      title: "Loan Due",
      value: money(data.loanDue),
      icon: Landmark,
      color: "yellow",
    },
    {
      title: "Collections",
      value: money(data.totalCollection),
      icon: Wallet,
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Business Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of stock, finance and business performance
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white shadow animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">
                      {card.value}
                    </h3>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center
                    ${
                      card.color === "green"
                        ? "bg-green-100 text-green-600"
                        : card.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : card.color === "red"
                        ? "bg-red-100 text-red-600"
                        : card.color === "amber"
                        ? "bg-amber-100 text-amber-600"
                        : card.color === "orange"
                        ? "bg-orange-100 text-orange-600"
                        : card.color === "rose"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full
                    ${
                      card.color === "green"
                        ? "bg-green-500"
                        : card.color === "blue"
                        ? "bg-blue-500"
                        : card.color === "red"
                        ? "bg-red-500"
                        : card.color === "amber"
                        ? "bg-amber-500"
                        : card.color === "orange"
                        ? "bg-orange-500"
                        : card.color === "rose"
                        ? "bg-rose-500"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-slate-400">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}