# Claude analysis provider — preparation only

This change prepares Claude as an optional provider for **document-wide PDF analysis** in Marijana AI Design Studio. It does not call Claude unless the Vercel environment variable `PDF_ANALYSIS_PROVIDER=claude` is explicitly configured.

## Current safe state

- Existing OpenAI remains the default provider.
- Per-page visual design continues to use the existing OpenAI Responses API.
- No Claude API key is included in source code.
- No Vercel environment variables are changed by this commit.
- No API requests or paid usage are triggered by deployment/build.
- Claude requests cannot be validated until the Anthropic account has API credits.

## Environment variables (do not set yet)

Only after deciding to fund API use and test in a preview environment:

- `PDF_ANALYSIS_PROVIDER=claude`
- `ANTHROPIC_API_KEY` — secret, add only in Vercel Project Settings → Environment Variables
- `CLAUDE_MODEL` — optional; defaults to `claude-sonnet-5-5`

Do not place API keys in browser JavaScript, commits, screenshots, or chat messages. Do not configure these variables in Production during preparation.

## Testing plan when credits are available

1. Add the secret and provider flag to **Preview only**.
2. Test with a short, non-sensitive PDF (2–3 pages).
3. Confirm the document plan contains a summary for every page.
4. Confirm the page-design stage still uses OpenAI and that the final project is replaced only after all pages succeed.
5. Review API usage before attempting a longer PDF.
6. Keep the default provider on OpenAI unless the test succeeds.

## Limitation

This is code preparation, not a verified live Claude integration. With no Anthropic API credits, the Claude request path cannot be tested end-to-end. Existing OpenAI behavior remains the default.
