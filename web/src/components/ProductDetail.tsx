"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { discountPercent, installmentText, money, type ProductDTO } from "@/lib/money";

type Props = {
  product: ProductDTO;
  categoryName?: string;
};

export function ProductDetail({ product, categoryName }: Props) {
  const { addItem, whatsappNumber } = useCart();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const current = images[photoIndex] || product.image;
  const off = discountPercent(product.price, product.oldPrice);
  const outOfStock = product.stock != null && product.stock <= 0;
  const onPromo =
    product.featured || (product.oldPrice != null && product.oldPrice > product.price);

  function onNotify(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      alert("Informe um e-mail válido.");
      return;
    }
    const text = encodeURIComponent(
      `Olá! Quero ser avisado quando "${product.name}" voltar ao estoque.\nMeu e-mail: ${trimmed}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <article className={`product-detail${outOfStock ? " is-soldout" : ""}`}>
      <div className="product-detail-gallery">
        <div className="product-detail-main">
          {onPromo && !outOfStock && <span className="badge-promo">Promoção</span>}
          {off != null && !outOfStock && <span className="badge-off">{off}% OFF</span>}
          {outOfStock && <span className="badge-soldout">Esgotado</span>}
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt={product.name} />
          ) : (
            <div className="no-photo">Sem foto</div>
          )}
        </div>
        {images.length > 1 ? (
          <div className="product-detail-thumbs">
            {images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                className={index === photoIndex ? "is-active" : undefined}
                onClick={() => setPhotoIndex(index)}
                aria-label={`Ver foto ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-detail-info">
        {categoryName && product.categorySlug ? (
          <Link className="product-detail-category" href={`/${product.categorySlug}`}>
            {categoryName}
          </Link>
        ) : null}
        <h1>{product.name}</h1>
        {product.sku ? <p className="product-detail-sku">Código: {product.sku}</p> : null}
        <p className="price product-detail-price">
          {product.oldPrice != null && product.oldPrice > product.price && (
            <span className="price-old">{money(product.oldPrice)}</span>
          )}
          {money(product.price)}
        </p>
        {!outOfStock && <p className="installments">{installmentText(product.price)}</p>}
        {product.stock != null && product.stock > 0 ? (
          <p className="product-detail-stock">{product.stock} unidade(s) em estoque</p>
        ) : null}
        {product.description ? (
          <div className="product-detail-description">
            <h2>Descrição</h2>
            <p>{product.description}</p>
          </div>
        ) : null}
        <div className="product-detail-actions">
          {outOfStock ? (
            <form className="notify-form" onSubmit={onNotify}>
              <p className="notify-hint">Avise-me quando voltar</p>
              {sent ? (
                <p className="notify-ok">Pronto! Abra o WhatsApp e envie a mensagem.</p>
              ) : (
                <>
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    aria-label="E-mail para aviso de estoque"
                  />
                  <button type="submit" className="btn-notify">
                    Quero ser avisado
                  </button>
                </>
              )}
            </form>
          ) : (
            <button
              type="button"
              className="btn-buy"
              onClick={() =>
                addItem({
                  id: String(product.id),
                  name: product.name,
                  price: product.price,
                  image: current || product.image,
                  sku: product.sku,
                })
              }
            >
              Pedir no WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
