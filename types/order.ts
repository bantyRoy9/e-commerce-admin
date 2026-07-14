export interface OrderItem {
  productId: string;

  name: string;

  quantity: number;

  price: number;
}

export interface Order {
  _id: string;

  orderNumber: string;

  customerName: string;

  customerMobile: string;

  totalAmount: number;

  paymentMethod: string;

  paymentStatus: string;

  transactionId: string;

  status: string;

  items: OrderItem[];

  address: {
    houseNo: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };

  createdAt: string;

  updatedAt: string;
}