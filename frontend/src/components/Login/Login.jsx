import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/profile.png';

const Container = styled.div`
  background-color: #f9f8fb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  overflow-x: hidden;
`;

const Card = styled.div`
  background-color: #545454;
  padding: 40px;
  border-radius: 10px;
  display: flex;
  width: 800px;
  max-width: 90%;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
    padding: 20px;
    gap: 20px;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const LogoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f0d9b5;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;

  img {
    width: 120px;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    img {
      width: 80px;
    }
  }
`;

const Titulo = styled.h2`
  color: #fff;
  margin-bottom: 20px;
  margin-left: 65px;
  font-size: 35px;

  @media (max-width: 768px) {
    text-align: center;
    font-size: 1.5rem;
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #201f1fff;
  color: #ffffff;

  &::placeholder {
    color: #979595ff;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  color: #d3d3d3;
  font-size: 0.9rem;
`;

const Botao = styled.button`
  background-color: #545454;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;

  &:hover {
    background-color: rgba(101, 106, 107, 1);
  }
`;

const Erro = styled.p`
  color: red;
  margin-left: 65px;
  margin-top: 10px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    // Mock simples
    if (email === 'maria@email' && senha === '123456') {
      navigate('/dashboard');
    } else {
      setErro('E-mail ou senha incorretos.');
    }
  };

  return (
    <Container>
      <Card>
        <FormSection>
          <Titulo>Faça o seu login</Titulo>
          <Input
            type="email"
            placeholder="maria@email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="123456"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <CheckboxContainer>
            <input type="checkbox" />
            <span>Permanecer conectado</span>
          </CheckboxContainer>
          <Botao onClick={handleLogin}>Confirmar</Botao>
          {erro && <Erro>{erro}</Erro>}
        </FormSection>

        <LogoSection>
          <img src={logo} style={{ width: '90%' }} alt="Logo" />
        </LogoSection>
      </Card>
    </Container>
  );
};

export default Login;
