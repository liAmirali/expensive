import { FC, PropsWithChildren } from "react";
import Navbar from "./Navbar";

type Props = {} & PropsWithChildren;

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="bg-onyx-500 h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
