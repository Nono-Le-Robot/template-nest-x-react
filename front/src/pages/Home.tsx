import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

export default function Home() {
  const navigate = useNavigate()
  return (
      <Container>
          <h1>Home page</h1>
          <p onClick={() => navigate('/login')}>LOGIN</p>
          <p onClick={() => navigate('/register')}>REGISTER</p>
      </Container>
  )
}

// CSS
const Container = styled.div`

`;

