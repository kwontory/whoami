export const buttonClass = "min-h-11 rounded-lg border border-fg px-5 text-sm font-medium text-fg transition-colors hover:bg-panel-deep disabled:cursor-not-allowed disabled:opacity-50";
export const panelClass = "mt-8 rounded-xl border border-line-strong bg-panel p-5 sm:p-7";
export const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-sm text-fg outline-none focus:border-fg";

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR");
}
