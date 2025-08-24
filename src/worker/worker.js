export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);

      // Define your backend service base URL
      const backendBaseUrl = 'https://Floods 2025 Backend-service.developer-9ce.workers.dev';

      // Construct the full backend URL
      const backendUrl = `${backendBaseUrl}${url.pathname}${url.search}`;
      console.log(`Forwarding request to backend: ${backendUrl}`);

      // Create a new request to forward to the backend
      const forwardedRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body ? request.body : null, // Include request body for POST/PUT
      });

      // Fetch response from backend
      const response = await fetch(forwardedRequest);

      // If backend responds successfully, forward the response
      if (response.ok) {
        return response;
      } else {
        console.error(`Backend error: ${response.status} ${response.statusText}`);
        return new Response(`Error from backend: ${response.statusText}`, { status: response.status });
      }
    } catch (err) {
      // Log errors and return a generic error response
      console.error('Error handling request:', err.message);
      return new Response('Internal Worker Error', { status: 500 });
    }
  },
};
