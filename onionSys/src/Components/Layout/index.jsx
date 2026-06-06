// Components/Layout.js
import React, { useContext, useState } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { MyContext } from "../../App";

const Layout = ({ children }) => {
  const { isToggleSidebar } = useContext(MyContext);
  const context = useContext(MyContext);
  

  return (
    <section >
      <Header />
      <div className="main d-flex">
        <div
          className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : '' } transition-all`}
        >
          <Sidebar/>
        </div>

        <div
          className={`content p-3 pt-20 ${isToggleSidebar === true ? 'toggle' : '' } transition-all`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default Layout;
