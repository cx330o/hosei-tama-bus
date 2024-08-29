import { ofetch } from "ofetch"
import type { Message, MessagesResponse } from "../types"
import useAuthStore from "../stores/authStore"

const baseUrl = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

interface GetAllParams {
  cursor?: string
  limit?: number
}

const getAll = async ({ cursor, limit }: GetAllParams = {}): Promise<MessagesResponse> => {
  const params = new URLSearchParams()
  if (cursor) params.set("cursor", cursor)
  if (limit) params.set("limit", String(limit))
  const query = params.toString()
  const url = `${baseUrl}/api/messages${query ? `?${query}` : ""}`
  const response = await ofetch(url, { headers: getAuthHeaders() })
  return response.data
}

const create = async (formData: FormData): Promise<Message> => {
  const response = await ofetch(`${baseUrl}/api/messages`, {
    method: "POST",
    body: formData,
    headers: getAuthHeaders(),
  })
  return response.data
}

const deleteMessage = async (messageId: number): Promise<void> => {
  await ofetch(`${baseUrl}/api/messages/${messageId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
}

export default { getAll, create, deleteMessage }
