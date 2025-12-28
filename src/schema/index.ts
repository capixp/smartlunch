import { z } from "zod";

export const OrderSchema = z.object({
  name: z.string().min(1, "El código de famila es Obligatorio"),
  codigoFamilia: z.string().min(1, "El código de famila es Obligatorio"),
  total: z.number().min(1, "Hay errores en la orden"),
  order: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      //codigoFamilia: z.string(),
      price: z.number(),
      quantity: z.number(),
      subtotal: z.number(),
    })
  ),
});
