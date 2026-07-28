import assert from "node:assert/strict";
import test from "node:test";

import {
  isPublicEndpoint,
  isUnauthenticatedAuthRequest,
} from "../src/lib/api-request-policy.ts";

test("public content endpoints do not require a stored access token", () => {
  assert.equal(isPublicEndpoint("/services/?is_active=true"), true);
  assert.equal(
    isPublicEndpoint(
      "https://api.beautifulbrowsandhenna.com/api/blog/post-name/"
    ),
    true
  );
  assert.equal(isPublicEndpoint("/api/gallery/12/"), true);
  assert.equal(isPublicEndpoint("/appointments/"), false);
});

test("only known authentication POST requests bypass auth redirects", () => {
  assert.equal(
    isUnauthenticatedAuthRequest("/auth/users/reset_password/", "post"),
    true
  );
  assert.equal(
    isUnauthenticatedAuthRequest(
      "/api/auth/users/reset_password_confirm/",
      "POST"
    ),
    true
  );
  assert.equal(
    isUnauthenticatedAuthRequest("/auth/users/reset_password/", "get"),
    false
  );
  assert.equal(
    isUnauthenticatedAuthRequest("/appointments/create/", "post"),
    false
  );
});
