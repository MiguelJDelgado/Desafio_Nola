import styled from "styled-components";
import LoginBox from "../components/Login/Login";


const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #ffffff
`

function Login() {

  return (
    <AppContainer>
        <LoginBox />
    </AppContainer>
  
  );
}

export default Login
