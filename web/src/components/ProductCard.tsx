"use client";

import { useCart } from "@/lib/cart";
import { discountPercent, installmentText, money, type ProductDTO } from "@/lib/money";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const off = discountPercent(product.price, product.oldPrice);

  return (
    <article className="product">
      <div className="product-media">
        {off != null && <span className="badge-off">{off}% OFF</span>}
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="no-photo">Sem foto</div>
        )}
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="price">
          {product.oldPrice != null && product.oldPrice > product.price && (
            <span className="price-old">{money(product.oldPrice)}</span>
          )}
          {money(product.price)}
        </p>
        <p className="installments">{installmentText(product.price)}</p>
        <div className="product-actions">
          <button
            type="button"
            className="btn-buy"
            onClick={() =>
              addItem({
                id: String(product.id),
                name: product.name,
                price: product.price,
                image: product.image,
                sku: product.sku,
              })
            }
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}
