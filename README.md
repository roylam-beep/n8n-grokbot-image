# n8n-grokbot custom image

Based on `n8nio/n8n:2.37.11`.

Unlocks `feat:advancedPermissions` (multi Admin + removes Community upsell for additional admins) by patching compiled feature-flag checks.

Does **not** use a pirated license key.

Build:

```bash
docker build -t n8n-grokbot:2.37.11-admin .
```
