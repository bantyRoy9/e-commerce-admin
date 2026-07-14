import api from "./api";

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getUserOrders = async (userId: string) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string
) => {
  const response = await api.put(
    `/orders/${id}/status`,
    { status }
  );

  return response.data;
};

export const cancelOrder = async (id: string) => {
  const response = await api.put(
    `/orders/${id}/cancel`
  );

  return response.data;
};