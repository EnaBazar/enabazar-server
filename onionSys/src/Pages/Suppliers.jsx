import { useEffect, useState } from "react";

import api from "../services/api.js";
import { BiSave } from "react-icons/bi";
import { UsersIcon } from "@heroicons/react/24/solid";
import { postData } from "../utils/api.js";

const emptyForm = {
  name: "",
  mobile: "",
  address: "",
  openingDue: 0,
};

export default function Suppliers() {
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const load = () =>
    api
      .get("/suppliers")
      .then((res) => setItems(res.data.data || []));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
 
    await postData("/suppliers/create", form);

    setForm(emptyForm);
    setMessage("Supplier Saved Successfully");

    setTimeout(() => {
      setMessage("");
    }, 3000);

    load();
  };

  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.mobile?.includes(search)
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 p-6">
      <div className="max-w-[1700px] mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <UsersIcon className="text-blue-600" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Supplier Management
              </h1>

              <p className="text-slate-500">
                Add and manage all suppliers
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-3xl shadow-sm p-5">
            <p className="text-slate-500 text-sm">
              Total Suppliers
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {items.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-5">
            <p className="text-slate-500 text-sm">
              Total Due
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              ৳{" "}
              {items
                .reduce(
                  (sum, item) =>
                    sum + Number(item.openingDue || 0),
                  0
                )
                .toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-5">
            <p className="text-slate-500 text-sm">
              Active Records
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {filteredItems.length}
            </h2>
          </div>

        </div>

        <div className="grid xl:grid-cols-12 gap-6">

          {/* Add Supplier Form */}
          <div className="xl:col-span-4">

            <form
              onSubmit={submit}
              className="bg-white rounded-3xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Add Supplier
              </h2>

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5">
                  {message}
                </div>
              )}

              <div className="space-y-4">

                <div>
                  <label className="text-sm font-medium">
                    Supplier Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="w-full h-12 border border-slate-200 rounded-xl px-4 mt-2 focus:border-blue-500 outline-none"
                    placeholder="Enter supplier name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Mobile Number
                  </label>

                  <input
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mobile: e.target.value,
                      })
                    }
                    className="w-full h-12 border border-slate-200 rounded-xl px-4 mt-2 focus:border-blue-500 outline-none"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Opening Due
                  </label>

                  <input
                    type="number"
                    value={form.openingDue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        openingDue: Number(e.target.value),
                      })
                    }
                    className="w-full h-12 border border-slate-200 rounded-xl px-4 mt-2 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Address
                  </label>

                  <textarea
                    rows="4"
                    value={form.address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none"
                    placeholder="Supplier address"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <BiSave size={18} />
                  Save Supplier
                </button>

              </div>
            </form>

          </div>

          {/* Supplier Table */}
          <div className="xl:col-span-8">

            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h2 className="text-xl font-semibold">
                  Supplier List
                </h2>

                <div className="relative w-full md:w-[320px]">
                  <search
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Search supplier..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-xl"
                  />
                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="bg-slate-100">
                      <th className="p-4 text-left">
                        Name
                      </th>
                      <th className="p-4 text-left">
                        Mobile
                      </th>
                      <th className="p-4 text-left">
                        Address
                      </th>
                      <th className="p-4 text-left">
                        Opening Due
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredItems.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-4 font-medium">
                          {item.name}
                        </td>

                        <td className="p-4">
                          {item.mobile}
                        </td>

                        <td className="p-4">
                          {item.address}
                        </td>

                        <td className="p-4 font-semibold text-red-600">
                          ৳{" "}
                          {Number(
                            item.openingDue || 0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  No Suppliers Found
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}