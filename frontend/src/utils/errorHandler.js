export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (!error?.response) {
    return error?.message || "Unable to connect to the server.";
  }

  const data = error.response.data;

  // Backend validation errors
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((err) => err.message || err.msg)
      .filter(Boolean)
      .join(", ");
  }

  // Normal API error
  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallback;
}