/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    CONTACT_FORM_EMAIL_RECIPIENT: process.env.CONTACT_FORM_EMAIL_RECIPIENT,
    CONTACT_FORM_EMAIL_PASSKEY: process.env.CONTACT_FORM_EMAIL_PASSKEY,
    CONTACT_FORM_EMAIL_HOST: process.env.CONTACT_FORM_EMAIL_HOST,
    CONTACT_FORM_EMAIL_HOST_PORT: process.env.CONTACT_FORM_EMAIL_HOST_PORT,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
    WEB_CLIENT_SECRET: process.env.WEB_CLIENT_SECRET,
    WEB_CLIENT_GRANT_TYPE: process.env.WEB_CLIENT_GRANT_TYPE,
    WEB_CLIENT_SCOPE: process.env.WEB_CLIENT_SCOPE,
    WEB_CLIENT_RESOURCE: process.env.WEB_CLIENT_RESOURCE,
  },
  publicRuntimeConfig: {
    PAG_BANK_PUBLIC_KEY: process.env.PAG_BANK_PUBLIC_KEY,
    AUTHNZ_SERVER_URL: process.env.AUTHNZ_SERVER_URL,
  },
};

module.exports = nextConfig;
