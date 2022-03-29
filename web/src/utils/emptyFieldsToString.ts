export default function fillEmptyFields<T>(obj: T, fillValue: any): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      !value ? [key, fillValue] : [key, value]
    )
  ) as T;
}
