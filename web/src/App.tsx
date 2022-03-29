import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ReactElement, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UpdateProfile from "./pages/UpdateProfile";

export default function App(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const errorLink = useMemo(
    () =>
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, extensions: { code } }) => {
            if (
              code === "UNAUTHENTICATED" &&
              message.includes("Not logged in")
            ) {
              navigate(`login?redirect=${location.pathname}${location.search}`);
            }
          });
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
    [navigate, location]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          errorLink,
          new HttpLink({
            uri: "http://localhost:4000/graphql",
            credentials: "include",
          }),
        ]),
      }),
    [errorLink]
  );

  return (
    <ApolloProvider client={client}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
      </Routes>
    </ApolloProvider>
  );
}
