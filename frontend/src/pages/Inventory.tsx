import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import type { InventoryRecord } from "../lib/api";
import {useAuth} from "../context/AuthContext";

function stockBadge(item: InventoryRecord) {
  if (item.quantity <= item.minimumStock) {
    return { label: "Low stock", className: "danger" };
  }

  return { label: "Healthy", className: "success" };
}

export default function Inventory() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryRecord | null>(null);

  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "",
    quantity: 0,
    unit: "",
    minimumStock: 0,
  });

  type Category = {
      categoryId: number;
      categoryName: string;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();

  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [lowStock, setLowStock] = useState<InventoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const canManageInventory = 
    user?.role.roleName === "ADMINISTRATOR" || 
    user?.role.roleName === "MANAGER" || 
    user?.role.roleName === "CHEF";

  function editItem(item: InventoryRecord) {
      setEditingItem(item);

      setFormData({
        itemName: item.itemName,
        categoryId: String(item.categoryId),
        quantity: item.quantity,
        unit: item.unit,
        minimumStock: item.minimumStock,
      });

      setShowForm(true);
    }
  function saveItem() {
      if (editingItem) {
          api.put(`/inventory/${editingItem.itemId}`, formData)
              .then((response) => {
                  setItems((current) =>
                      current.map((item) =>
                          item.itemId === editingItem.itemId ? response.data : item
                      )
                  );
                  setShowForm(false);
              });
        } 
        else {
            api.post("/inventory", formData)
                .then((response) => {
                    setItems((current) => [response.data, ...current]);
                    setShowForm(false);
                });
        }
    }

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const categoriesResponse = await api.get("/categories");
        
        setCategories(categoriesResponse.data);

        const [allItems, lowStockItems] = await Promise.all([
          api.get<InventoryRecord[]>("/inventory"),
          api.get<InventoryRecord[]>("/inventory/low-stock"),
        ]);

        if (alive) {
          setItems(allItems.data);
          setLowStock(lowStockItems.data);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    load();


    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => {
      const haystack = `${item.itemName} ${item.category?.categoryName ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [items, search]);

  if (loading) {
    return <div className="card">Loading inventory...</div>;
  }

  return (
    
    <div className="page-grid">
      <section className="grid-3 page-grid">
        <div className="card stat">
          <span className="meta">Total items</span>
          <strong className="stat-value">{items.length}</strong>
          <span>Tracked ingredients and stock</span>
        </div>
        <div className="card stat">
          <span className="meta">Low stock</span>
          <strong className="stat-value">{lowStock.length}</strong>
          <span>Items that need attention</span>
        </div>
        <div className="card stat">
          <span className="meta">Categories</span>
          <strong className="stat-value">{new Set(items.map((item) => item.category?.categoryName ?? "Unassigned")).size}</strong>
          <span>Menu coverage by category</span>
        </div>
      </section>

      <section className="card">
          <div className="toolbar">
            <div>
              <p className="eyebrow">Inventory check</p>
              <h2>Fast food readiness view</h2>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                className="input"
                style={{ maxWidth: 320 }}
                placeholder="Search item or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {canManageInventory && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingItem(null);

                    setFormData({
                      itemName: "",
                      categoryId: "",
                      quantity: 0,
                      unit: "",
                      minimumStock: 0,
                    });

                    setShowForm(true);
                  }}
                >
                  Add Inventory
                </button>
              )}
            </div>
          </div>

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Minimum</th>
                <th>Status</th>
                {canManageInventory && (
                    <th>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((item) => {
                const badge = stockBadge(item);
                return (
                  <tr key={item.itemId}>
                    <td>{item.itemName}</td>
                    <td>{item.category?.categoryName ?? "Unassigned"}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>{item.minimumStock}</td>
                    <td><span className={`badge ${badge.className}`}>{badge.label}</span></td>
                    {canManageInventory && (
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => editItem(item)}
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={canManageInventory ? 6 : 5}>
                    <div className="empty-state">No inventory items match your search.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {showForm && (
  <section className="card">
    <div className="card-header">
      <div>
        <p className="eyebrow">
          {editingItem ? "Update Inventory" : "New Inventory Item"}
        </p>
        <h2>
          {editingItem ? "Edit Item" : "Add Inventory"}
        </h2>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        marginTop: "1rem",
      }}
    >
      <div>
        <label className="meta">Item Name</label>
            <input
              className="input"
              type="text"
              value={formData.itemName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  itemName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="meta">Category</label>
            <select
              className="input"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="meta">Quantity</label>
            <input
              className="input"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="meta">Unit</label>
            <input
              className="input"
              type="text"
              value={formData.unit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unit: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="meta">Minimum Stock</label>
            <input
              className="input"
              type="number"
              value={formData.minimumStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumStock: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={saveItem}
          >
            {editingItem ? "Update Item" : "Add Item"}
          </button>
        </div>
      </section>
    )}
  </div>
  );
}