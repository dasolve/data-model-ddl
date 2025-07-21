export const snakeToCamel = (s: string) =>
  s.toLowerCase().replace(/(_\w)/g, (m) => m[1].toUpperCase());
