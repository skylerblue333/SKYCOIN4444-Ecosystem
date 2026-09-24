export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Prefer the configured OAuth portal when it exists. Hosted betas without an
// OAuth provider use the server-validated invite flow at /signin.
export const getLoginUrl = (provider?: "google" | "github" | "email") => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    return "/signin";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");
  if (provider) url.searchParams.set("provider", provider);

  return url.toString();
};

export const getGoogleLoginUrl = () => getLoginUrl("google");
