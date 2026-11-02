# MANRA 231999 — AI service deployment

The portfolio is published as a static GitHub Pages site. GitHub Pages cannot run private server code or keep an API key secret. MANRA's server endpoint is therefore a Netlify Function, which can be deployed from this repository while the public portfolio remains on GitHub Pages.

## Required private configuration

In the Netlify site dashboard, set these environment variables:

- OPENAI_API_KEY: a private OpenAI API key. Store it only in Netlify environment variables. Never commit it to this repository or paste it into a public file.
- MANRA_ALLOWED_ORIGINS: https://manoj5520.github.io
- MANRA_MODEL (optional): defaults to gpt-6.1-sol.

Deploy the repository to Netlify with the included netlify.toml. The endpoint will be:

https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/manra

After deployment, set window.MANRA_API_ENDPOINT in the public portfolio to that endpoint. The endpoint accepts a question and recent conversation history; the authoritative professional dossier and role-assessment instructions stay on the server. The visitor-facing JavaScript contains no provider key.

## Important

The serverless function is deployment-ready code, not a live service until it has been deployed and the private environment variables are configured. OpenAI API usage is billed separately from a ChatGPT subscription. Use an API budget limit and monitor usage in the OpenAI platform.
