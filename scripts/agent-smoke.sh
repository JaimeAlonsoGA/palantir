#!/usr/bin/env bash
# Agent smoke checks against a Palantir base URL (default: live).
set -euo pipefail
BASE="${1:-https://palantir.grok.me}"
HDR=(-H 'Accept: application/json' -H 'Content-Type: application/json')
fail=0

check() {
  local name="$1" url="$2" expect_substr="${3:-}"
  local code body
  body="$(curl -sS "${HDR[@]}" -o /tmp/palantir-smoke.body -w '%{http_code}' "$url" || true)"
  code="$body"
  body="$(cat /tmp/palantir-smoke.body)"
  if [[ "$code" != 200 && "$code" != 201 ]]; then
    echo "FAIL $name HTTP $code — $url"
    echo "  body: ${body:0:200}"
    fail=1
    return
  fi
  if [[ "$body" == *"<!DOCTYPE"* ]] || [[ "$body" == *"<html"* ]]; then
    echo "FAIL $name returned HTML — $url"
    fail=1
    return
  fi
  if [[ -n "$expect_substr" && "$body" != *"$expect_substr"* ]]; then
    echo "FAIL $name missing '$expect_substr' — $url"
    fail=1
    return
  fi
  echo "OK   $name ($code)"
}

check catalog "$BASE/api/v1" '"endpoints"'
check dump "$BASE/api/v1/dump" '"entries"'
check search "$BASE/api/v1/search?q=handoff" 'slug'
check schema "$BASE/api/v1/schema" ''
check topics "$BASE/api/v1/topics" ''
check graph "$BASE/api/v1/graph" 'entries'
check llms "$BASE/llms.txt" 'topics'

if [[ $fail -ne 0 ]]; then
  echo "smoke: FAILED"
  exit 1
fi
echo "smoke: all passed against $BASE"
