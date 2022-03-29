import { FieldError } from "../graphql/generated/graphql";

export default function toErrorMap(errors: FieldError[]) {
  return errors.reduce((prev, error) => {
    prev[error.field] = error.message;
    return prev;
  }, {} as Record<string, string>);
}
