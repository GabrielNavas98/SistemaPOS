import { api } from "@/lib/axios";

export async function deleteCategory(id: string) {
  await api.delete(`/api/categories/${id}`)
}
