import { PrismaClient } from "@prisma/client";
import { categories } from "./data/categories";
import { products } from "./data/products";

const prisma = new PrismaClient();

async function main() {
  // Categorías
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    });
  }

  // Productos
  // Productos
  for (const p of products as any[]) {
    const category = p.categorySlug
      ? await prisma.category.findUnique({
          where: { slug: p.categorySlug },
          select: { id: true },
        })
      : await prisma.category.findUnique({
          where: { id: p.categoryId },
          select: { id: true },
        });

    if (!category) {
      throw new Error(
        `Category not found for product "${p.name}". ` +
          `categorySlug=${p.categorySlug ?? "N/A"} categoryId=${
            p.categoryId ?? "N/A"
          }`
      );
    }

    await prisma.product.upsert({
      where: {
        name_categoryId: {
          name: p.name,
          categoryId: category.id,
        },
      },
      update: {
        price: p.price,
        image: p.image,
      },
      create: {
        name: p.name,
        price: p.price,
        image: p.image,
        categoryId: category.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
