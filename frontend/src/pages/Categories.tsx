import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import type { InventoryRecord } from "../lib/api";

export default function Categories() {
  const [items, setItems] = useState<InventoryRecord[]>([]);

  useEffect(() => {
    api.get<InventoryRecord[]>("/inventory").then((response) => setItems(response.data));
  }, []);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, number>>((accumulator, item) => {
      const key = item.category?.categoryName ?? "Unassigned";
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [items]);

  return (
    <div className="page-grid">
      <section className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Category overview</p>
            <h2>Inventory groupings</h2>
          </div>
        </div>

        <div className="tag-list">
          {Object.entries(grouped).length ? Object.entries(grouped).map(([name, count]) => (
            <span className="pill neutral" key={name}>{name} • {count} item(s)</span>
          )) : <div className="empty-state">No category data yet.</div>}
        </div>
      </section>
    </div>
  );
}