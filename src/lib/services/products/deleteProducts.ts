import { api } from "@/lib/axios";

export async function deleteProduct(id: string) {
  await api.delete(`/api/products/${id}`)
}
