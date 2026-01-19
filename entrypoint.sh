#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  API_URL: "${API_URL}"
}
EOF

echo "Injected env:"
cat /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"
