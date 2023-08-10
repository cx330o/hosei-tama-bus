import { ofetch } from "ofetch";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAll = async ({ cursor, limit } = {}) => {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", limit);
  const query = params.toString();
  const url = `${baseUrl}/api/messages${query ? `?${query}` : ""}`;
  const response = await ofetch(url);
  return response.data;
};

const create = async (formData) => {
  const response = await ofetch(`${baseUrl}/api/messages`, {
    method: "POST",
    body: formData,
  });
  return response.data;
};

export default { getAll, create };
