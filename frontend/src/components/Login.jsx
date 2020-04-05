import React from 'react';
import styled, {css} from 'styled-components';
import {Grid, Form, Button} from 'semantic-ui-react';

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

const Login = () => {
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
            <Form>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Email" />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Password" />
                <Form.Button fluid>Login</Form.Button>
              </Form.Group>
            </Form>
          </div>
        </StyledGridInner>
      </StyledColumn>
    </StyledGrid>
  );
};

export default Login;
