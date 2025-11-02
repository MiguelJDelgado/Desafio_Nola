import { useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const LayoutContainer = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.main`
  margin-left: ${({ isOpen }) => (isOpen ? "220px" : "80px")};
  transition: margin-left 0.3s ease;
  padding: 20px 20px 20px 0;
`;


function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <LayoutContainer>
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(v => !v)} />
      <MainContent isOpen={isOpen}>{children}</MainContent>

    </LayoutContainer>
  );
}

export default Layout;
