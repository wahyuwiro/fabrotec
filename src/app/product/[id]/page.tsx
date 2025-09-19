import Link from "next/link";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
      >
        ← Back to Product List
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-64 h-64 object-cover rounded border"
        />

        {/* Main Info */}
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600">Category: {product.category}</p>
          <p className="text-xl font-semibold text-green-600">
            ${product.price}{" "}
            <span className="text-sm text-red-500">
              ({product.discountPercentage}% OFF)
            </span>
          </p>
          <p className="text-sm">
            ⭐ {product.rating} | Stock: {product.stock} (
            {product.availabilityStatus})
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      {product.images?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Gallery</h2>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} ${i + 1}`}
                className="w-32 h-32 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Description & Metadata */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p>{product.description}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p><b>Brand:</b> {product.brand}</p>
          <p><b>SKU:</b> {product.sku}</p>
          <p><b>Weight:</b> {product.weight} kg</p>
          <p>
            <b>Dimensions:</b> {product.dimensions.width} ×{" "}
            {product.dimensions.height} × {product.dimensions.depth} cm
          </p>
          <p><b>Warranty:</b> {product.warrantyInformation}</p>
          <p><b>Shipping:</b> {product.shippingInformation}</p>
          <p><b>Return Policy:</b> {product.returnPolicy}</p>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
          <div className="space-y-3">
            {product.reviews.map(
              (
                review: {
                  reviewerName: string;
                  comment: string;
                  rating: number;
                  date: string;
                },
                i: number
              ) => (
                <div
                  key={i}
                  className="border rounded p-3 bg-gray-50 shadow-sm"
                >
                  <p className="font-semibold">
                    {review.reviewerName} – ⭐ {review.rating}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p>{review.comment}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
