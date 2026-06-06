import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api from "../services/api.js";

const emptyForm = { name: "", mobile: "", address: "", openingDue: 0 };

export default function Mokams() {
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => api.get("/mokams").then((res) => setItems(res.data.data || []));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/mokams", form);
    setForm(emptyForm);
    setMessage("Mokam saved");
    load();
  };

  return (
    <section className="grid two">
      <form className="form-panel" onSubmit={submit}>
        <h2>Add Mokam</h2>
        {message && <div className="notice">{message}</div>}
        <div className="form-grid">
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Mobile<input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label>
          <label>Address<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label>Opening Due<input type="number" value={form.openingDue} onChange={(e) => setForm({ ...form, openingDue: Number(e.target.value) })} /></label>
          <button className="primary-btn"><Save size={16} /> Save Mokam</button>
        </div>
      </form>
      <div className="table-panel">
        <div className="table-title"><h2>Mokam List</h2></div>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Mobile</th><th>Address</th><th>Opening Due</th></tr></thead><tbody>
          {items.map((item) => <tr key={item._id}><td>{item.name}</td><td>{item.mobile}</td><td>{item.address}</td><td>{item.openingDue}</td></tr>)}
        </tbody></table></div>
        {items.length === 0 && <div className="empty">No mokams yet</div>}
      </div>
    </section>
  );
}
