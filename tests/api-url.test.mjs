import assert from "node:assert/strict";
import test from "node:test";

import {
  CANONICAL_API_BASE_URL,
  LOCAL_API_BASE_URL,
  selectApiBaseUrl,
} from "../src/lib/api-url.ts";

test("production uses the canonical API only when configuration is unset", () => {
  assert.equal(selectApiBaseUrl(undefined, true), CANONICAL_API_BASE_URL);
});

test("production fails clearly for insecure or malformed API overrides", () => {
  assert.throws(
    () => selectApiBaseUrl("http://localhost:8000/api/", true),
    /Invalid VITE_API_BASE_URL/
  );
  assert.throws(
    () => selectApiBaseUrl("//untrusted.example/api/", true),
    /Invalid VITE_API_BASE_URL/
  );
  assert.throws(
    () => selectApiBaseUrl("https://", true),
    /Invalid VITE_API_BASE_URL/
  );
});

test("production accepts HTTPS and same-origin API URLs", () => {
  assert.equal(
    selectApiBaseUrl("https://api.example.com/api/", true),
    "https://api.example.com/api/"
  );
  assert.equal(selectApiBaseUrl("/api/", true), "/api/");
});

test("development preserves local and explicit API configuration", () => {
  assert.equal(selectApiBaseUrl(undefined, false), LOCAL_API_BASE_URL);
  assert.equal(
    selectApiBaseUrl("http://localhost:9000/api/", false),
    "http://localhost:9000/api/"
  );
});
