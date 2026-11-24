// Stands in for @openchamber/sdk in preview bundles. connectHost() returns the
// mock host the preview page put on window before the bundle loaded.
// @openchamber/sdk/ui (applyHostReady and friends) stays real.
export class HostRequestError extends Error {
  constructor(public code: string, message: string) { super(message); }
}
export const connectHost = () => (window as unknown as { __mockHost: unknown }).__mockHost;
