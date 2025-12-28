"use client";

import { useStore } from "@/src/store";
import React, { useMemo, useState } from "react";
import ProductDetails from "./ProductDetails";
import { formatCurrency } from "@/app/uitls";
import { createOrder } from "@/actions/create-order-action";
import { OrderSchema } from "@/src/schema";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function OrderSummary() {
  const order = useStore((state) => state.order);
  const clearOrder = useStore((state) => state.clearOrder);

  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order]
  );

  const [showCodigo, setShowCodigo] = useState(false);

  const handleCreateOrder = async (formData: FormData) => {
    const data = {
      name: "Removed", //formData.get("codigoFamilia"),
      codigoFamilia: formData.get("codigoFamilia"),
      total,
      order,
    };

    const result = OrderSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message));
      return;
    }

    const response = await createOrder(data);
    /* if (response?.errors) {
      response.errors.forEach((issue) => toast.error(issue.message));
    } */

    if (response?.errors?.length) {
      const uniqueMessages = new Set(response.errors.map((e) => e.message));

      uniqueMessages.forEach((message) => {
        toast.error(message);
      });
    }

    toast.success("Pedido Realizado Correctamente");
    clearOrder();
  };

  return (
    <aside className="md:h-screen md:overflow-y-scroll md:w-64 lg:w-96 p-5">
      <h1 className="text-4xl text-center font-black">Mi pedido</h1>

      {order.length === 0 ? (
        <p className="text-center my-10">El pedido esta vacio</p>
      ) : (
        <div className="mt-5">
          {order.map((item) => (
            <ProductDetails key={item.id} item={item} />
          ))}

          <p className="text-2xl mt-20 text-center">
            Total a pagar:{" "}
            <span className="font-bold">{formatCurrency(total)}</span>
          </p>

          <form className="w-full mt-10 space-y-5" action={handleCreateOrder}>
            {/* Input con ojo */}
            <div className="relative">
              <input
                type={showCodigo ? "text" : "password"}
                placeholder="Tu código de familia"
                className="bg-white border border-gray-100 p-2 w-full pr-10"
                name="codigoFamilia"
              />

              <button
                type="button"
                onClick={() => setShowCodigo((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showCodigo ? "Ocultar código" : "Mostrar código"}
              >
                {showCodigo ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <input
              type="submit"
              className="py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer font-bold"
              value="Confirmar Pedido"
            />
          </form>
        </div>
      )}
    </aside>
  );
}
