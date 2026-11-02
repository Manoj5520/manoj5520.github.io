# MANRA 231999 — secure AI service deployment

## What is already in this repository

- `manra.js` — the voice/chat interface, browser speech input/output, profile-grounded fallback and conversation handling.
- `manra-widget.css` — the animated MANRA listening / thinking / speaking visual.
- `netlify/functions/manra.js` — the private server endpoint. The detailed professional dossier and agent instructions stay on the server; provider credentials are never placed in public JavaScript.
- `netlify.toml` — Netlify build and function configuration.

The public portfolio and the ETHIC subsite remain hosted on GitHub Pages. The server function needs a separate serverless host because GitHub Pages only serves static files.

## Deploy the function on Netlify

1. Sign in to Netlify and choose **Add new project → Import an existing project**.
2. Select GitHub and choose `Manoj5520/manoj5520.github.io`.
3. Set the production branch to `main`.
4. Keep the publish directory as `.` and use the function directory `netlify/functions` from the checked-in `netlify.toml`. No build command is required.
5. Deploy the project. Netlify will provide a site hostname such as `https://YOUR-SITE.netlify.app`.
6. In the Netlify site dashboard, open **Project configuration → Environment variables** and add:
   - `OPENAI_API_KEY` — create an API key in the OpenAI API platform and paste it only into this private Netlify environment variable.
   - `MANRA_ALLOWED_ORIGINS` — `https://manoj5520.github.io`
   - `MANRA_MODEL` — optional; defaults to `gpt-6.1-sol`.
7. Ensure the `OPENAI_API_KEY` variable is available to Functions, then trigger a fresh production deploy.

The endpoint URL will be:

`https://YOUR-SITE.netlify.app/.netlify/functions/manra`

## Connect the public sites

After Netlify has deployed successfully, add this configuration to the public portfolio `index.html` before the `manra.js` script tag, replacing the example host with the actual Netlify site hostname:

```html
<script>
  window.MANRA_API_ENDPOINT = "https://YOUR-SITE.netlify.app/.netlify/functions/manra";
</script>
```

The ETHIC subsite loads the same shared assistant script from the portfolio domain, so it will use the same configured endpoint.

## Cost and key safety

- A ChatGPT subscription does not include OpenAI API usage. API usage is billed separately.
- The current default, `gpt-6.1-sol`, is a reasoning model. The API model listing currently shows $2 per 1M input tokens and $10 per 1M output tokens; web-search tool calls may add their own usage charge.
- Set an API budget/usage alert in the OpenAI platform and review usage after initial testing.
- Never put the API key in `index.html`, `manra.js`, GitHub Pages, a public repository variable, or a message to the assistant.
- The backend has request-size limits and a best-effort per-instance rate limit. A production deployment should also enable a durable rate-limit / bot-protection layer before promoting the assistant widely.

## Honest readiness status

The UI and backend source code are committed to GitHub. The intelligent service is **not live** until the Netlify function is deployed, the private key is configured, and the endpoint is added to the public page. Before that point, MANRA uses its local profile-grounded fallback and must not claim to be fully generative.
