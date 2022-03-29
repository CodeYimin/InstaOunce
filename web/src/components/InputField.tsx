import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import { InputHTMLAttributes, ReactElement } from "react";

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  name: string;
  label: string;
};

function InputField({ label, ...htmlProps }: InputFieldProps): ReactElement {
  const [field, { error }] = useField(htmlProps);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...htmlProps} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}

export default InputField;
