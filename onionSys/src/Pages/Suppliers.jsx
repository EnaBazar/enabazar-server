import { useEffect, useState } from "react";

import api from "../services/api.js";
import { BiSave } from "react-icons/bi";
import { UsersIcon } from "@heroicons/react/24/solid";
import { postData } from "../utils/api.js";
import { FaSearch } from "react-icons/fa";

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
  const [isLoading, setIsLoading] = useState(false);

  const load = () =>
    api.get("/suppliers").then((res) => setItems(res.data.data || []));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await postData("/suppliers/create", form);

      if (res?.error === false || res?.success === true) {
        setForm(emptyForm);

        setMessage(res?.message || "Supplier Saved Successfully");

        load();

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage(res?.message || "Failed to save supplier");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      setMessage("Server Error");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
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
              <UsersIcon className="text-blue-600" />
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
            <p className="text-slate-500 text-sm">Total Suppliers</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {items.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-5">
            <p className="text-slate-500 text-sm">Total Due</p>
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
            <p className="text-slate-500 text-sm">Active Records</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {filteredItems.length}
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
                Add Supplier
              </h2>

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5">
                  {message}
                </div>
              )}

              <div className="space-y-4">

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Supplier Name"
                  className="w-full h-12 border rounded-xl px-4"
                />

                <input
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                  placeholder="Mobile"
                  className="w-full h-12 border rounded-xl px-4"
                />

                <input
                  type="number"
                  value={form.openingDue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      openingDue: Number(e.target.value),
                    })
                  }
                  placeholder="Opening Due"
                  className="w-full h-12 border rounded-xl px-4"
                />

                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Address"
                  className="w-full border rounded-xl p-4"
                  rows="4"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <BiSave />
                  {isLoading ? "Saving..." : "Save Supplier"}
                </button>

              </div>
            </form>
          </div>

          {/* TABLE */}
          <div className="xl:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex justify-between mb-5">
                <h2 className="text-xl font-semibold">
                  Supplier List
                </h2>

                <div className="relative w-72">
                  <FaSearch className="absolute top-3 left-3 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-11 pl-10 border rounded-xl"
                  />
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Mobile</th>
                    <th className="p-3 text-left">Address</th>
                    <th className="p-3 text-left">Due</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.mobile}</td>
                      <td className="p-3">{item.address}</td>
                      <td className="p-3 text-red-600 font-semibold">
                        ৳ {Number(item.openingDue || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredItems.length === 0 && (
                <div className="text-center py-10 text-gray-500">
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