import { ReactElement, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["username"]);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  function handleUsernameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setUsernameInput(event.target.value);
  }

  async function handleUsernameSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (usernameInput === "") {
      setUsernameInput("");
      setAlert("Please enter a username");
      return;
    }

    const userInfo = await fetch(
      `http://localhost:4000/user?username=${usernameInput}`
    );
    const user = await userInfo.json();

    if (!user) {
      setUsernameInput("");
      setAlert("Username not found");
      return;
    }

    console.log(user);
    setCookies("username", usernameInput);
    navigate("/");
  }

  return (
    <Container>
      <form onSubmit={handleUsernameSubmit}>
        <LoginLabel>Login with username:</LoginLabel>
        <UsernameInput onChange={handleUsernameInput} value={usernameInput} />
      </form>
      {alert && <Alert>{alert}</Alert>}
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  height: 100vh;
  display: flex;
  padding-top: 40vh;
  flex-direction: column;
  width: max-content;
  margin: auto;
`;

const LoginLabel = styled.label`
  display: block;
  font-size: 2rem;
`;

const UsernameInput = styled.input`
  width: 20rem;
  font-size: 1.5rem;
  font-weight: 300;
  border-bottom: 0.1rem solid;
  padding: 0.5rem;
  margin: 0 auto;
  text-align: center;
`;

const Alert = styled.p`
  font-size: 1.5rem;
  color: red;
`;
