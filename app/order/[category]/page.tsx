import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

async function getProducts(category: string) {
  console.log(category);
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
    },
  });
  return products;
}
export default async function OrderCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    // Si no existe el slug en BD, caerá en 404
    // (también puedes usar notFound() si quieres)
    return <div className="p-6">Categoría no encontrada</div>;
  }

  const products = await getProducts(params.category);

  return (
    <>
      <h1 className="text-2xl my-10">
        Elige y personaliza tu pedido a continuación
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 items-start">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
