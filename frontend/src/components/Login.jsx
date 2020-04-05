/* eslint react/prop-types: 0 */

import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import {Grid, Form} from 'semantic-ui-react';

import {POST} from '../utils/api';
import {saveAuth} from '../utils/auth';

const StyledGrid = styled(Grid)`
  height: 100%;
`;

const StyledColumn = styled(Grid.Column)`
  height: 100%;
  display: table;
  text-align: center;
  ${(props) => props.background && css`
    background-color: ${props.background}
  `};
`;

const StyledGridInner = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const Login = ({history}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (e, data) => setEmail(data.value);
  const handlePassword = (e, data) => setPassword(data.value);
  const handleLogin = () => {
    setLoading(true);
    POST('/user/login', {email, password})
      .then((response) => {
        saveAuth(response.jwt);
        history.push('/order');
      });
  };

  return (
    <StyledGrid columns="equal">
      <StyledColumn background="#E1F0EA">
        <StyledGridInner>
          <h2>Volunteer Portal</h2>
        </StyledGridInner>
      </StyledColumn>
      <StyledColumn>
        <StyledGridInner>
          <div style={{width: '300px', display: 'inline-block'}}>
            <Form loading={loading}>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Email" value={email} onChange={handleEmail} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Password" type="password" value={password} onChange={handlePassword} />
                <Form.Button fluid onClick={handleLogin}>Login</Form.Button>
              </Form.Group>
            </Form>
          </div>
        </StyledGridInner>
      </StyledColumn>
    </StyledGrid>
  );
};

export default Login;
