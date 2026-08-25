export type StoreConfig = {
  storeName: string;
  whatsappNumber: string;
  whatsappLabel: string;
  paymentProvider: string;
};

export function getStoreConfig(): StoreConfig {
  return {
    storeName: process.env.STORE_NAME || "Paulo Suculentas",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "5521970151689",
    whatsappLabel: process.env.WHATSAPP_LABEL || "(21) 97015-1689",
    paymentProvider: (process.env.PAYMENT_PROVIDER || "whatsapp").toLowerCase(),
  };
}

export function whatsappGeneralUrl(cfg: StoreConfig) {
  const text = encodeURIComponent(
    `Olá! Vi o site ${cfg.storeName} e quero saber quais suculentas estão disponíveis.`
  );
  return `https://wa.me/${cfg.whatsappNumber}?text=${text}`;
}
