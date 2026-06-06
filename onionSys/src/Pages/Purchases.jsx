import { useEffect, useState } from "react";
import api from "../services/api";
import { BiSave, BiSearch } from "react-icons/bi";

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  date: today,
  supplier: "",
  lotNo: "",
  kg: 0,
  rate: 0,
  paidAmount: 0,
  note: ""
};

export default function Purchases() {
  const [form, setForm] = useState(emptyForm);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const total = Number(form.kg || 0) * Number(form.rate || 0);
  const due = total - Number(form.paidAmount || 0);

  const load = async () => {
    const [s, p] = await Promise.all([
      api.get("/suppliers"),
      api.get("/purchases")
    ]);

    setSuppliers(s.data.data || []);
    setItems(p.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/purchases", form);

    setForm({
      ...emptyForm,
      supplier: suppliers[0]?._id || ""
    });

    load();
  };

  const filteredItems = items.filter(
    (item) =>
      item?.supplier?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item?.lotNo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 p-6">
      <div className="max-w-[1700px] mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Purchase Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage supplier purchases and inventory entries
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Purchase Amount
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              ৳ {total.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Paid Amount
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ৳ {Number(form.paidAmount).toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Due Amount
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              ৳ {due.toLocaleString()}
            </h2>
          </div>

        </div>

        <div className="grid xl:grid-cols-12 gap-6">

          {/* FORM */}
          <div className="xl:col-span-4">

            <form
              onSubmit={submit}
              className="bg-white rounded-3xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Purchase Entry
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="text-sm font-medium">
                    Date
                  </label>

                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value
                      })
                    }
                    className="w-full h-12 border rounded-xl px-4 mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Supplier
                  </label>

                  <select
                    required
                    value={form.supplier}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        supplier: e.target.value
                      })
                    }
                    className="w-full h-12 border rounded-xl px-4 mt-2"
                  >
                    <option value="">
                      Select Supplier
                    </option>

                    {suppliers.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Lot Number
                  </label>

                  <input
                    required
                    value={form.lotNo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lotNo: e.target.value
                      })
                    }
                    className="w-full h-12 border rounded-xl px-4 mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium">
                      KG
                    </label>

                    <input
                      type="number"
                      value={form.kg}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          kg: Number(e.target.value)
                        })
                      }
                      className="w-full h-12 border rounded-xl px-4 mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Rate
                    </label>

                    <input
                      type="number"
                      value={form.rate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          rate: Number(e.target.value)
                        })
                      }
                      className="w-full h-12 border rounded-xl px-4 mt-2"
                    />
                  </div>

                </div>

                <div>
                  <label className="text-sm font-medium">
                    Paid Amount
                  </label>

                  <input
                    type="number"
                    value={form.paidAmount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paidAmount: Number(e.target.value)
                      })
                    }
                    className="w-full h-12 border rounded-xl px-4 mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium">
                      Total
                    </label>

                    <input
                      readOnly
                      value={total}
                      className="w-full h-12 bg-slate-100 rounded-xl px-4 mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Due
                    </label>

                    <input
                      readOnly
                      value={due}
                      className="w-full h-12 bg-red-50 text-red-600 rounded-xl px-4 mt-2"
                    />
                  </div>

                </div>

                <div>
                  <label className="text-sm font-medium">
                    Note
                  </label>

                  <textarea
                    rows="4"
                    value={form.note}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        note: e.target.value
                      })
                    }
                    className="w-full border rounded-xl p-4 mt-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                >
                  <BiSave size={20} />
                  Save Purchase
                </button>

              </div>
            </form>

          </div>

          {/* TABLE */}
          <div className="xl:col-span-8">

            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-semibold">
                  Purchase History
                </h2>

                <div className="relative w-[300px]">
                  <BiSearch className="absolute left-3 top-3 text-slate-500" />

                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full h-11 pl-10 pr-4 border rounded-xl"
                  />
                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="bg-slate-100">
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Supplier</th>
                      <th className="p-3 text-left">Lot</th>
                      <th className="p-3 text-left">KG</th>
                      <th className="p-3 text-left">Rate</th>
                      <th className="p-3 text-left">Total</th>
                      <th className="p-3 text-left">Paid</th>
                      <th className="p-3 text-left">Due</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredItems.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-3">
                          {String(item.date).slice(0, 10)}
                        </td>

                        <td className="p-3">
                          {item.supplier?.name}
                        </td>

                        <td className="p-3">
                          {item.lotNo}
                        </td>

                        <td className="p-3">
                          {item.kg}
                        </td>

                        <td className="p-3">
                          {item.rate}
                        </td>

                        <td className="p-3 font-semibold text-blue-600">
                          ৳ {item.totalAmount}
                        </td>

                        <td className="p-3 font-semibold text-green-600">
                          ৳ {item.paidAmount}
                        </td>

                        <td className="p-3 font-semibold text-red-600">
                          ৳ {item.dueAmount}
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  No Purchases Found
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}