export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (!error?.response) return error?.message || "Unable to connect to the server.";
  const data = error.response.data;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) return data.errors[0].msg;
  return fallback;
}
