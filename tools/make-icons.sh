#!/usr/bin/env bash
# Generates PWA PNG icons from icons/icon.svg using rsvg-convert + magick.
set -euo pipefail
cd "$(dirname "$0")/.."

rsvg-convert -w 192 -h 192 icons/icon.svg -o icons/icon-192.png
rsvg-convert -w 512 -h 512 icons/icon.svg -o icons/icon-512.png
rsvg-convert -w 180 -h 180 icons/icon.svg -o icons/apple-touch-icon.png

# Maskable icon: full-bleed background with content inside the central 80% safe zone
cat << 'EOF' > /tmp/ptp-maskable.svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0f766e"/>
  <g transform="translate(56,56) scale(0.78125)">
    <rect x="28" y="28" width="456" height="456" rx="86" fill="none" stroke="#99f6e4" stroke-width="12" stroke-opacity="0.4"/>
    <text x="68" y="132" fill="#ccfbf1" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="800">78</text>
    <text x="444" y="128" text-anchor="end" fill="#99f6e4" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700">195</text>
    <text x="256" y="330" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="220" font-weight="900">Pt</text>
    <text x="256" y="424" text-anchor="middle" fill="#ccfbf1" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="700" letter-spacing="2">PRACTICE</text>
  </g>
</svg>
EOF
rsvg-convert -w 512 -h 512 /tmp/ptp-maskable.svg -o icons/icon-maskable-512.png
rm -f /tmp/ptp-maskable.svg

if command -v magick >/dev/null 2>&1; then
  for f in icons/*.png; do magick "$f" -strip "$f"; done
fi
ls -lh icons/
