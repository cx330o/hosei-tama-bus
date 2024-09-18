import { ofetch } from "ofetch"
import useAuthStore from "../stores/authStore"

const baseUrl = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export const summarize = async (messageId: number): Promise<string> => {
  const response = await ofetch(`${baseUrl}/api/ai/summarize`, {
    method: "POST",
    body: { messageId },
    headers: getAuthHeaders(),
  })
  return response.data.summary
}

export const translate = async (messageId: number, targetLang: string = "en"): Promise<string> => {
  const response = await ofetch(`${baseUrl}/api/ai/translate`, {
    method: "POST",
    body: { messageId, targetLang },
    headers: getAuthHeaders(),
  })
  return response.data.translation
}
export const describeImage = async (fileName: string): Promise<string> => {
  const response = await ofetch(`${baseUrl}/api/ai/describe-image`, {
    method: "POST",
    body: { fileName },
    headers: getAuthHeaders(),
  })
  return response.data.description
}
