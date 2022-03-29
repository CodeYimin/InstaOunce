export function caseInsensitiveRegex(str: string): RegExp {
  const len = str.length;
  let exp = "^";
  for (let i = 0; i < len; i++) {
    exp += "[" + str[i].toLowerCase() + str[i].toUpperCase() + "]";
  }
  exp += "$";
  return new RegExp(exp);
}

export function caseInsensitivePrisma(str: string) {
  return {
    equals: str,
    mode: "insensitive" as const,
  };
}
