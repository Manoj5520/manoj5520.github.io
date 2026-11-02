# MANRA 231999 — secure AI service deployment

## What is already in the repository

- `manra.js` — the assistant interface, browser speech input/output, conversation history, profile-grounded fallback and source display.
- `manra-widget.css` — the animated listening / thinking / speaking visual.
- `netlify/functions/manra.js` — the private intelligence endpoint. It holds the professional dossier and agent instructions server-side and calls the model through Netlify AI Gateway when available.
- `netlify.toml` — Netlify build and function configuration.

The public portfolio and ETHIC subsite remain on GitHub Pages. GitHub Pages only serves static files, so the intelligent service needs a serverless host.

## Recommended activation — Netlify AI Gateway

This route avoids placing an OpenAI key in GitHub and does not require a separate OpenAI API account/key. Netlify AI Gateway injects the OpenAI-compatible key and base URL into a deployed Netlify Function.

1. Sign in to Netlify.
2. Choose **Add new project → Import an existing project**.
3. Select GitHub and connect `Manoj5520/manoj5520.github.io`.
4. Set the production branch to `main`.
5. Keep publish directory `.`; the checked-in `netlify.toml` points to `netlify/functions`. No build command is required.
6. Deploy the site to production at least once. Netlify AI Gateway requires a production deploy before it activates.
7. In the Netlify team settings, ensure **AI Features / AI Gateway** are enabled. On a current credit-based plan, Netlify automatically injects `OPENAI_API_KEY` and `OPENAI_BASE_URL` (and the dedicated `NETLIFY_AI_GATEWAY_KEY` / `NETLIFY_AI_GATEWAY_BASE_URL`) for Functions. No secret needs to be added to GitHub or public files.
8. Trigger a fresh production deploy after enabling AI Gateway.

The backend is coded to use the Netlify-injected gateway URL and key. It can also use a separately configured direct OpenAI API key as a fallback, but that is not the recommended setup.

## Connect the public sites

After Netlify has deployed successfully, set this configuration in the public portfolio `index.html` before the `manra.js` script tag, replacing the example hostname with your actual Netlify site hostname:

```html
<script>
  window.MANRA_API_ENDPOINT = "https://YOUR-SITE.netlify.app/.netlify/functions/manra";
</script>
```

The ETHIC subsite loads the same shared assistant script from the portfolio domain, so it will use the same endpoint.

## Cost and safeguards

- Netlify AI Gateway converts model-token use into Netlify credits. It is not unlimited; monitor credit use in the Netlify dashboard and check the current plan/credit quota before sharing the assistant widely.
- GPT-6.1 Sol is the configured reasoning model for complex role assessments. MANRA requests higher reasoning effort for role-fit and comparison questions and uses web search for current company/vacancy/eligibility questions.
- The server function has request-size limits, a best-effort per-instance rate limit, and server-side origin checks. Add durable bot protection / rate-limiting before a high-traffic public launch.
- The browser never receives the provider API key. Never add a key to `index.html`, `manra.js`, GitHub Pages or any public repository file.

## Honest readiness status

The portfolio UI, ETHIC subsite, reasoning prompt, profile dossier and Netlify Function source are committed to GitHub. The intelligent service is **not live** until a Netlify production project exists, AI Gateway is enabled, and the function URL is configured in the public page. Until then, MANRA uses its profile-grounded preview and must not claim to be a fully generative agent.
