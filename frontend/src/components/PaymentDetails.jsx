import React from 'react';
import {
  CardElement,
} from '@stripe/react-stripe-js';
import styled from 'styled-components';

const PaymentContainer = styled.div`
  padding: 9.5px 14px;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 4px;
  background-color: white;
  margin-bottom: 14px;
`;

const PaymentDetails = () => {
  return (
    <PaymentContainer>
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              fontFamily: 'Lato,\'Helvetica Neue\',Arial,Helvetica,sans-serif',
              fontSize: '14px',
              backgroundColor: 'white',
              '::placeholder': {
                color: '#c0c0c0',
              },
            },
          },
        }}
      />
    </PaymentContainer>
  );
};

export default PaymentDetails;
