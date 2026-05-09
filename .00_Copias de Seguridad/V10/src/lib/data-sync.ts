export const DATA_REFRESH_EVENT = "webinar:data-refresh";

export type DataRefreshDetail = { reason?: string };

export function notifyDataRefresh(detail?: DataRefreshDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DATA_REFRESH_EVENT, { detail: detail ?? {} }));
}

export function subscribeDataRefresh(handler: (detail: DataRefreshDetail) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (ev: Event) => {
    const ce = ev as CustomEvent<DataRefreshDetail>;
    handler(ce.detail ?? {});
  };
  window.addEventListener(DATA_REFRESH_EVENT, listener);
  return () => window.removeEventListener(DATA_REFRESH_EVENT, listener);
}
