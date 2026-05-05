export default async (req, res) => {
  try {
    // Load the server module - use require.resolve to find it at runtime
    const server = await import("../dist/server/server.js").then((m) => m.default);

    // Create a Request object compatible with Fetch API
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    // Collect body for non-GET/HEAD requests
    let body = undefined;
    if (!["GET", "HEAD"].includes(req.method)) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }

    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body,
    });

    // Call the server handler
    const response = await server.fetch(request);

    // Set response status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response body using arrayBuffer (buffer() doesn't exist on standard Response)
    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
