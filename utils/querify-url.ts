// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function querifyUrl(params: Record<string, any>): string {
  return new URLSearchParams(params).toString();
}
