import api from "./api";

export interface ProductPayload {
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image: string;
  imagePublicId: string;
  description: string;
}

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: ProductPayload
) => {
  const response = await api.post(
    "/products",
    data
  );

  return response.data;
};

export const updateProduct = async (
  id: string,
  data: ProductPayload
) => {
  const response = await api.put(
    `/products/${id}`,
    data
  );

  return response.data;
};

export const deleteProduct = async (
  id: string
) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};