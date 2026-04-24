// components/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout({ inbox, pendingCount, repondreInbox, invitStatutStyle }) {
  return (
    <>
      <Navbar
        inbox={inbox}
        pendingCount={pendingCount}
        repondreInbox={repondreInbox}
        invitStatutStyle={invitStatutStyle}
      />
      <Outlet />
    </>
  );
}

export default MainLayout;