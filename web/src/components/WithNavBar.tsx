import { ReactElement } from "react";
import NavBar from "./NavBar";

interface WithNavBarProps {
  children: ReactElement;
}

function WithNavBar({ children }: WithNavBarProps): ReactElement {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default WithNavBar;
