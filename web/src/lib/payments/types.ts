export type PixLineItem = {
  productId: number;
  name: string;
  sku: string;
  unitPrice: number;
  qty: number;
};

export type CreatePixInput = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocument?: string;
  value: number;
  description: string;
  items: PixLineItem[];
};

export type CreatePixResult = {
  paymentId: string;
  checkoutUrl?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
};
