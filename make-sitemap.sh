#!/bin/sh
# 사용법: sh make-sitemap.sh https://내도메인.com
# 도메인이 바뀌면 이 스크립트로 sitemap.xml 과 robots.txt 를 다시 만든다.
URL="${1%/}"
DATE=$(date +%Y-%m-%d)
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for p in "" salary/ severance/ loan/ rent/ area/ hourly/ vat/ age/ dday/ discount/ about.html privacy.html; do
    echo "  <url><loc>$URL/$p</loc><lastmod>$DATE</lastmod></url>"
  done
  echo '</urlset>'
} > sitemap.xml
printf 'User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' "$URL" > robots.txt
echo "done: $URL"
