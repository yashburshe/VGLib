//general util functions to simplify API fetch handling

export async function makeAuthReq(endpoint, method = "GET", body = null) {
  //Handle Authorization
  const headers = {};
  const fetchOptions = { method, headers };
  if (body) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, fetchOptions);
    const data = await response.json();
    if (!response.ok) {
      console.error("Session invalid: ", data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
