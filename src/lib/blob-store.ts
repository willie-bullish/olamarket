import { getStore, type Store } from "@netlify/blobs";

export const PAYMENT_FILES_STORE = "payment-files";

export function getPaymentFilesStore(): Store {
  return getStore({
    name: PAYMENT_FILES_STORE,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN,
  });
}

export function buildPublicFileUrl(key: string): string {
  return `/api/files/${encodeURIComponent(key)}`;
}
