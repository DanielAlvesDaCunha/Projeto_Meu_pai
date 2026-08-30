"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { discountPercent, installmentText, money, type ProductDTO } from "@/lib/money";

export function ProductCard({
  product,
  preview = false,
}: {
  product: ProductDTO;
  preview?: boolean;
}) {
  const { addItem, whatsappNumber } = useCart();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const current = images[photoIndex] || product.image;
  const hasGallery = images.length > 1;
  const off = discountPercent(product.price, product.oldPrice);
  const outOfStock = product.stock != null && product.stock <= 0;
  const onPromo =
    product.featured || (product.oldPrice != null && product.oldPrice > product.price);

  function prevPhoto(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((i) => (i - 1 + images.length) % images.length);
  }

  function nextPhoto(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((i) => (i + 1) % images.length);
  }

  function onNotify(e: React.FormEvent) {
    e.preventDefault();
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

  const Wrap = preview ? "div" : "article";

  return (
    <Wrap className={`product${outOfStock ? " is-soldout" : ""}${onPromo && !outOfStock ? " is-promo" : ""}`}>
      <div className="product-gallery">
        <div className="product-media">
          {onPromo && !outOfStock && <span className="badge-promo">Promoção</span>}
          {off != null && !outOfStock && <span className="badge-off">{off}% OFF</span>}
          {outOfStock && <span className="badge-soldout">Esgotado</span>}
          {preview ? (
            current ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current} alt="" />
            ) : (
              <div className="no-photo">Sem foto</div>
            )
          ) : (
            <Link href={`/produto/${product.id}`} className="product-media-link">
              {current ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current} alt={product.name} loading="lazy" />
              ) : (
                <div className="no-photo">Sem foto</div>
              )}
            </Link>
          )}
          {hasGallery && !preview ? (
            <>
              <button type="button" className="gallery-side is-prev" onClick={prevPhoto} aria-label="Foto anterior">
                ‹
              </button>
              <button type="button" className="gallery-side is-next" onClick={nextPhoto} aria-label="Próxima foto">
                ›
              </button>
            </>
          ) : null}
          {hasGallery ? (
            <span className="gallery-dots" aria-hidden>
              {images.map((_, i) => (
                <span key={i} className={i === photoIndex ? "is-active" : undefined} />
              ))}
            </span>
          ) : null}
        </div>
      </div>

      <div className="product-body">
        <h3>
          {preview ? product.name : <Link href={`/produto/${product.id}`}>{product.name}</Link>}
        </h3>
        <p className="price">
          {product.oldPrice != null && product.oldPrice > product.price && (
            <span className="price-old">{money(product.oldPrice)}</span>
          )}
          {money(product.price)}
        </p>
        {!outOfStock && <p className="installments">{installmentText(product.price)}</p>}
        {preview ? null : (
        <div className="product-actions">
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
                    onChange={(e) => setEmail(e.target.value)}
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
        )}
      </div>
    </Wrap>
  );
}
