import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../graphql/generated/graphql";
import toErrorMap from "../utils/toErrorMap";

interface RegisterProps {}

function Register({}: RegisterProps): ReactElement {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  return (
    <Center>
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ variables: values });
            const errors = response.data?.register.errors;
            if (errors) {
              setErrors(toErrorMap(errors));
              return;
            }

            navigate("/");
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack spacing={6}>
                <InputField
                  name="username"
                  label="Username"
                  placeholder="Enter username..."
                />
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Enter email..."
                  type="email"
                />
                <InputField
                  name="password"
                  label="Password"
                  placeholder="Enter password..."
                  type="password"
                />
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  color="teal"
                  variant="solid"
                >
                  Register
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Center>
  );
}

export default Register;
