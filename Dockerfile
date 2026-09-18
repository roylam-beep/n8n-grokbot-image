FROM docker.io/n8nio/n8n:2.40.1

USER root
COPY patch-advanced-permissions.js /usr/local/bin/patch-advanced-permissions.js
RUN node /usr/local/bin/patch-advanced-permissions.js \
  && grep -q 'isAdvancedPermissionsLicensed() { return true; }' \
       /usr/local/lib/node_modules/n8n/node_modules/@n8n/backend-common/dist/license-state.js \
       /usr/local/lib/node_modules/n8n/dist/license.js \
  && grep -q 'advancedPermissions: true' \
       /usr/local/lib/node_modules/n8n/dist/services/frontend.service.js

USER node
