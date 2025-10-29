import React, { useState } from "react";

type Props = {
  item: {
    id: number;
    name: string;
    description?: string;
    price: string;
    options?: Record<string, any>;
  };
  onAdd: (quantity: number, options?: Record<string, any>, notes?: string) => void;
  onClose: () => void;
};

const OrderForm: React.FC<Props> = ({ item, onAdd, onClose }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});

  const renderOptions = () => {
    if (!item.options || Object.keys(item.options).length === 0) return null;
    return (
      <div className="space-y-3">
        {Object.entries(item.options).map(([optKey, optVal]) => {
          const values = Array.isArray(optVal) ? optVal : [optVal];
          return (
            <div key={optKey}>
              <label className="block text-sm font-medium mb-1">{optKey}</label>
              <select
                value={selectedOptions[optKey] ?? values[0]}
                onChange={(e) => setSelectedOptions((s) => ({ ...s, [optKey]: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              >
                {values.map((v: any) => (
                  <option key={String(v)} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow w-full max-w-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Añadir {item.name}</h3>
          <button onClick={onClose} className="text-gray-600">Cerrar</button>
        </div>
        <div className="space-y-3">
          {renderOptions()}
          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-28 border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} placeholder="Ej: sin cebolla..." />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
            <button
              onClick={() => {
                onAdd(quantity, selectedOptions, notes);
              }}
              className="px-4 py-2 rounded bg-indigo-600 text-white"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;