import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../graphql/generated/graphql";
import toErrorMap from "../utils/toErrorMap";

interface LoginProps {}

function Login({}: LoginProps): ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const redirect = searchParams.get("redirect") || "/";

  return (
    <Center>
      <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({ variables: values });
            const errors = response.data?.login.errors;
            if (errors) {
              setErrors(toErrorMap(errors));
              return;
            }

            navigate(redirect);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack spacing={6}>
                <InputField
                  name="usernameOrEmail"
                  label="Username or Email"
                  placeholder="Enter username or email..."
                />
                <InputField
                  name="password"
                  label="Password"
                  placeholder="Enter password..."
                  type="password"
                />
                <Button type="submit" isLoading={isSubmitting} color="teal">
                  Login
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Center>
  );
}

export default Login;
