# Privacy-friendly analytics setup

AI Starter Hub is a static GitHub Pages site. This setup does not add a database, backend server, or account system.

## Enable Cloudflare Web Analytics

Analytics is **disabled by default**. The site will not load the Cloudflare beacon until a token is configured.

1. Open the Cloudflare dashboard and create a Web Analytics site for `https://starterhub-dev.github.io/ai-tools/` (follow the current dashboard instructions).
2. Copy the site's Web Analytics beacon token. Do not paste an API token, Global API Key, password, or other account credential.
3. In `analytics-config.js`, set `cloudflareBeaconToken` to the beacon token.
4. Commit the change to a branch, open a pull request, and verify that the site is deployed and analytics appears in the Cloudflare dashboard.

The configuration and loader are included on the homepage, tutorial directory, and generated tool-detail pages. Personal profile pages are not instrumented by this integration.

## Privacy and scope

- No database or custom event endpoint is used.
- With an empty token, no Cloudflare analytics script is loaded.
- The integration is intended for aggregate traffic and page-view metrics. It does not add tracking of search text, favorites, account identity, or form contents.
- Review Cloudflare's current analytics documentation and the site's applicable privacy requirements before enabling tracking.

## Feedback without a database

Visitors can use the GitHub issue forms to report a broken link or outdated information, or suggest a tool:

- [Website feedback](https://github.com/starterhub-dev/ai-tools/issues/new?template=bug_report.yml)
- [Suggest an AI tool](https://github.com/starterhub-dev/ai-tools/issues/new?template=tool_request.yml)
