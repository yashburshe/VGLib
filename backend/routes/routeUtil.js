export async function handleGenRequest(req, res, method) {
  try {
    return method();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Internal Servier Error: ${error}` });
  }
}
