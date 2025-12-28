"use server";
import { prisma } from "@/lib/prisma";
import { OrderSchema } from "@/src/schema";
//import { create } from "zustand";

export async function createOrder(data: unknown) {
  const result = OrderSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.issues,
    };
  }

  try {
    await prisma.order.create({
      data: {
        name: result.data.name,
        codigoFamilia: result.data.codigoFamilia,
        total: result.data.total,
        orderProducts: {
          create: result.data.order.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
        },
      },
    });
  } catch (error) {
    console.log(result);
  }
}
