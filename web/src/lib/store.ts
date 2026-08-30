export type StoreConfig = {
  storeName: string;
  whatsappNumber: string;
  whatsappLabel: string;
  paymentProvider: string;
};

const STORE_WHATSAPP_NUMBER = "5521988162338";
const STORE_WHATSAPP_LABEL = "(21) 98816-2338";
const RETIRED_WHATSAPP_DIGITS = "970151689";

function onlyDigits(value?: string) {
  return (value || "").replace(/\D/g, "");
}

function isRetiredWhatsapp(value?: string) {
  const digits = onlyDigits(value);
  return !digits || digits.includes(RETIRED_WHATSAPP_DIGITS);
}

function normalizeWhatsappNumber(value: string) {
  const digits = onlyDigits(value);
  if (digits.startsWith("55")) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function getStoreConfig(): StoreConfig {
  const envNumber = process.env.WHATSAPP_NUMBER;
  const envLabel = process.env.WHATSAPP_LABEL;

  return {
    storeName: process.env.STORE_NAME || "Paulo Suculentas",
    whatsappNumber: isRetiredWhatsapp(envNumber)
      ? STORE_WHATSAPP_NUMBER
      : normalizeWhatsappNumber(envNumber || STORE_WHATSAPP_NUMBER),
    whatsappLabel: isRetiredWhatsapp(envLabel) ? STORE_WHATSAPP_LABEL : envLabel!.trim(),
    paymentProvider: (process.env.PAYMENT_PROVIDER || "whatsapp").toLowerCase(),
  };
}

export function whatsappGeneralUrl(cfg: StoreConfig) {
  const text = encodeURIComponent(
    `Olá! Vi o site ${cfg.storeName} e quero saber quais suculentas estão disponíveis.`
  );
  return `https://wa.me/${cfg.whatsappNumber}?text=${text}`;
}
