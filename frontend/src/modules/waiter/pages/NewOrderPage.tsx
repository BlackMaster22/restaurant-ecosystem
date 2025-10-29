import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";
import useCartStore from "../../../stores/cartStore";
import CartSummary from "../components/CartSummary";
import OrderForm from "../components/OrderForm";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: string;
  image?: string | null;
  category: { id: number; name: string };
  options?: Record<string, any>;
};

const fetchMenu = async (): Promise<MenuItem[]> => {
  const res = await api.get("/menu/items/");
  return res.data;
};

const NewOrderPage: React.FC = () => {
  const { data: items = [], isLoading } = useQuery(["menu"], fetchMenu);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const cart = useCartStore();
  const [table, setTable] = useState<string>("");

  useEffect(() => {
    // reset on mount if needed
  }, []);

  const handleAddToCart = (it: MenuItem, quantity = 1, options?: Record<string, any>, notes?: string) => {
    cart.addItem({
      menuItemId: it.id,
      name: it.name,
      price: Number(it.price),
      quantity,
      options,
      notes
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tomar pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mesa / Nombre</label>
            <input value={table} onChange={(e) => setTable(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Ej: 12 / Terraza 1" />
          </div>

          {isLoading ? (
            <div>Cargando menú...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((it) => (
                <div key={it.id} className="bg-white rounded shadow p-4 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold">{it.name}</h3>
                    <p className="text-sm text-gray-600">{it.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold">{it.price} €</span>
                    <button
                      onClick={() => {
                        setSelected(it);
                      }}
                      className="text-indigo-600"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <CartSummary table={table} setTable={setTable} />
        </div>
      </div>

      {selected && <OrderForm item={selected} onAdd={(qty, options, notes) => { handleAddToCart(selected, qty, options, notes); setSelected(null); }} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default NewOrderPage;