export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const backendOrigin = env.BACKEND_ORIGIN || "https://3000-iuccgpv2fr4er5ubjsagy-e27b01b9.us2.manus.computer";

    // Proxy API, tRPC, OAuth, and storage requests to the active Node/Manus backend
    if (
      url.pathname.startsWith("/api/") ||
      url.pathname.startsWith("/oauth/") ||
      url.pathname.startsWith("/manus-storage/")
    ) {
      const backendUrl = new URL(url.pathname + url.search, backendOrigin);
      const proxyHeaders = new Headers(request.headers);
      proxyHeaders.set("Host", backendUrl.host);
      
      const proxyRequest = new Request(backendUrl.toString(), {
        method: request.method,
        headers: proxyHeaders,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "follow",
      });

      try {
        const response = await fetch(proxyRequest);
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set("x-sgtb-worker-proxy", "active");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Backend proxy unreachable", details: err.message }), {
          status: 502,
          headers: { "content-type": "application/json" },
        });
      }
    }

    // Serve static assets for all other routes (handled by Cloudflare Workers assets binding)
    return env.ASSETS.fetch(request);
  },
};
