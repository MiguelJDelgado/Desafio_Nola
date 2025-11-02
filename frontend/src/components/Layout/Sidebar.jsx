import styled from 'styled-components';
import { NavLink } from 'react-router-dom'; 
import Dashboard from '../../assets/dashboard.png';
import Clientes from '../../assets/clientes.png';
import Analytics from '../../assets/analytics.png';
import Produtos from '../../assets/produtos.png';
import Estoque from '../../assets/estoque.png';
import Lojas from '../../assets/lojas.png';
import sidebar from '../../assets/sidebar.png';
import profile from '../../assets/profile.png';

const opcoesMenu = [
  { texto: 'Dashboard', icone: Dashboard },
  { texto: 'Analytics', icone: Analytics },
  { texto: 'Produtos', icone: Produtos },
  { texto: 'Estoque', icone: Estoque},
  { texto: 'Lojas/Canais', icone: Lojas },
  { texto: 'Clientes', icone: Clientes }
];

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? "220px" : "80px")};
  background-color: #545454;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: ${({ isOpen }) => (isOpen ? "row" : "column")};
  align-items: center;
  justify-content: ${({ isOpen }) => (isOpen ? "space-between" : "center")};
  padding: 12px 15px;
  gap: ${({ isOpen }) => (isOpen ? "0" : "10px")};
`;

const UserIcon = styled.img`
  width: 35px;
  height: 35px;
`;

const UserInfo = styled.div`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  margin-left: 10px;
  color: white;
  font-size: 14px;

  strong { font-size: 15px; }
  span { font-size: 12px; color: #ccc; }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const ToggleButton = styled.img`
  width: 22px;
  height: 22px;
  cursor: pointer;
`;

const Opcoes = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const ItemLink = styled(NavLink)`
  width: 100%;
  display: block;
  text-decoration: none;

  &.active li {
    background-color: #545454;
    font-weight: bold;
  }
`;

const Opcao = styled.li`
  display: flex;
  align-items: center;
  justify-content: ${({ isOpen }) => (isOpen ? "flex-start" : "center")};
  padding: 12px 15px;
  color: white;
  transition: background 0.3s;
  font-size: 16px;

  &:hover { background-color: #666464ff; }
`;

const IconeOpcao = styled.img`
  width: 28px;
  height: 25px;
  margin-right: ${({ isOpen }) => (isOpen ? "10px" : "0")};
  flex-shrink: 0;
`;

const TextoOpcao = styled.span`
  display: ${({ isOpen }) => (isOpen ? "inline" : "none")};
  white-space: nowrap;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
`;

function Sidebar({ isOpen, onToggle }) {
  return (
    <SidebarContainer isOpen={isOpen}>
      <Header isOpen={isOpen}>
        <UserSection>
          <UserIcon src={profile} alt="Usuário" />
          <UserInfo isOpen={isOpen}>
            <strong>Maria</strong>
            <span>Administrador</span>
          </UserInfo>
        </UserSection>
        <ToggleButton src={sidebar} alt="Menu" onClick={onToggle} />
      </Header>
      <Opcoes>
        {opcoesMenu.map((opcao) => (
          <ItemLink
            key={opcao.texto}
            to={`/${opcao.texto.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Opcao isOpen={isOpen}>
              <IconeOpcao src={opcao.icone} alt={opcao.texto} isOpen={isOpen} />
              <TextoOpcao isOpen={isOpen}>{opcao.texto}</TextoOpcao>
            </Opcao>
          </ItemLink>
        ))}
      </Opcoes>
      <Footer>
      </Footer>
    </SidebarContainer>
  );
}
export default Sidebar;
2