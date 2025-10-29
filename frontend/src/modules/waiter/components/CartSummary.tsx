import React, { useState } from "react";
import useCartStore from "../../../stores/cartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../../services/orders";
import useAuthStore from "../../../stores/authStore";

const CartSummary: React.FC<{ table: string; setTable: (t: string) => void }> = ({ table, setTable }) => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clear = useCartStore((s) => s.clear);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation(createOrder, {
    onSuccess: () => {
      clear();
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["menu"]);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || "Error al crear pedido");
    }
  });

  const handleSubmit = () => {
    if (!table) {
      setError("Debes indicar la mesa o nombre");
      return;
    }
    if (items.length === 0) {
      setError("El carrito está vacío");
      return;
    }
    setError(null);
    const payload = {
      table,
      items: items.map((it) => ({
        menu_item_id: it.menuItemId,
        quantity: it.quantity,
        notes: it.notes || "",
        options: it.options || {}
      }))
    };
    mutation.mutate(payload);
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Carrito</h3>
      {items.length === 0 ? (
        <div className="text-sm text-gray-600">Carrito vacío</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.menuItemId} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">{it.quantity} x {it.price} €</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={it.quantity} onChange={(e) => updateQuantity(it.menuItemId, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
                <button onClick={() => removeItem(it.menuItemId)} className="text-red-500">Eliminar</button>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t">
            <div className="flex justify-between font-semibold">
              <div>Total</div>
              <div>{total().toFixed(2)} €</div>
            </div>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            <div className="mt-3 flex gap-2">
              <button onClick={() => clear()} className="px-3 py-2 bg-gray-200 rounded">Vaciar</button>
              <button onClick={handleSubmit} className="px-3 py-2 bg-indigo-600 text-white rounded">Enviar a caja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;