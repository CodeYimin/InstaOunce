import { ReactElement } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";

export default function Header(): ReactElement {
  const [cookies, setCookie, removeCookie] = useCookies(["username"]);

  function handleLogout(): void {
    removeCookie("username");
  }

  return (
    <Container>
      <Greeting>Hello {cookies.username}</Greeting>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Container>
  );
}

const Container = styled.div`
  height: max-content;
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
`;

const Greeting = styled.p`
  font-size: 1.5rem;
  width: max-content;
  margin: 0;
`;

const LogoutButton = styled.button`
  font-size: 1.5rem;
  font-weight: 300;
  height: max-content;
  margin-left: auto;
  border-radius: 100rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
