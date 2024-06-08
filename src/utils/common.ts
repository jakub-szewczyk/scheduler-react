export const searchParam = (param: string, url: string) =>
  new URLSearchParams(new URL(url).search).get(param)
