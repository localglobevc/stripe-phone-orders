/* eslint react/prop-types: 0 */

import React, {useState, useEffect} from 'react';
import styled, {css} from 'styled-components';
import {
  Grid,
  Item,
  Input,
  Button,
  Form,
  Divider,
  Modal,
} from 'semantic-ui-react';
import Cookies from 'js-cookie';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';

import {PrimaryButton} from './CommonStyles';
import PaymentDetails from './PaymentDetails';

import {GET, POST} from '../utils/api';

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

const Right = styled.div`
  float: right;
  ${(props) => props.color && css`
    color: ${props.color}
  `};
`;

const productSort = (a, b) => {
  if (a.available > b.available) return -1;
  if (a.available < b.available) return 1;
  if (a.id > b.id) return 1;
  return -1;
};

const Order = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [details, setDetails] = useState({
    name: '',
    phone: '',
    addressLineOne: '',
    addressCity: '',
    addressPostalCode: '',
    notes: '',
  });


  useEffect(() => {
    GET('/product')
      .then((results) => setProducts(results.map((product) => ({...product, quantity: 0})).sort(productSort)));
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    setProducts([
      ...products.filter((product) => product.id !== productId),
      {
        ...products.find((product) => product.id === productId),
        quantity: newQuantity,
      },
    ].sort(productSort));
  };

  const handleDetailsChange = (key, newValue) => {
    const updated = {};
    updated[key] = newValue;
    setDetails({
      ...details,
      ...updated,
    });
  };

  const handleComplete = () => {
    setLoading(true);
    POST('/order/intent', {
      products: products.filter(({quantity}) => quantity > 0).map(({id, quantity}) => ({id, quantity})),
      deliveryId: 1, // Hardcoded for now
    })
      .then(({secret}) => {
        return stripe.confirmCardPayment(secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: details.name,
              phone: details.phone,
            },
          },
        })
          .then((result) => {
            if (result.error || result.paymentIntent.status !== 'succeeded') {
              // something
              alert(`There was a problem processing the payment: ${result.error.message}`);
              return Promise.reject();
            }

            return POST('/order/finalise', {
              ...details,
              intent: result.paymentIntent.id,
            });
          })
          .then((result) => {
            if (result.success !== true) {
              // Success
              alert('There was a problem processing the payment. Please contact an administrator.');
              return Promise.reject();
            }
            alert('The payment was successful. The page will now reset.');
            window.location.reload();
            return Promise.resolve();
          })
          .finally(() => {
            setLoading(false);
          });
      });
  };

  const totalQuantity = products.reduce((acc, product) => acc + parseInt(product.quantity, 10), 0);
  const totalPrice = products.reduce((acc, product) => acc + parseInt(product.quantity, 10) * parseFloat(product.price, 10), 0) + 5;

  return (
    <StyledGrid columns="equal">
      <StyledColumn>
        <StyledGridInner>
          <div style={{width: '300px', display: 'inline-block', textAlign: 'left'}}>
            <Item.Group>
              {products.map((product) => (
                <Item key={product.id}>
                  <Item.Content>
                    <Item.Header>{product.name}</Item.Header>
                    <Item.Meta>
                      {`£${product.price}`}
                      {product.detail && ` | ${product.detail}`}
                      <Right color={product.available ? '#4BCC93' : '#F07979'}>{product.available ? 'Available' : 'Not available'}</Right>
                    </Item.Meta>
                    <Item.Description>
                      <Input
                        fluid
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        disabled={!product.available}
                        action={{icon: 'plus', onClick: () => handleQuantityChange(product.id, parseInt(product.quantity, 10) + 1), disabled: !product.available}}
                        onChange={(e, data) => handleQuantityChange(product.id, data.value)}
                        size="mini"
                      />
                    </Item.Description>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          </div>
        </StyledGridInner>
      </StyledColumn>
      <StyledColumn background="#EDEDED">
        <StyledGridInner>
          <div style={{width: '300px', display: 'inline-block', textAlign: 'left'}}>
            <h1>{`Order Total: £${totalPrice}`}</h1>
            <p>Including £5 delivery charge</p>
            <Divider />
            <Form loading={loading}>
              <p>Basic Details</p>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Name" value={details.name} onChange={(e, data) => handleDetailsChange('name', data.value)} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Phone Number" value={details.phone} onChange={(e, data) => handleDetailsChange('phone', data.value)} />
              </Form.Group>
              <p>Delivery Address</p>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Address Line 1" value={details.addressLineOne} onChange={(e, data) => handleDetailsChange('addressLineOne', data.value)} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="City" value={details.addressCity} onChange={(e, data) => handleDetailsChange('addressCity', data.value)} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input fluid placeholder="Postal Code" value={details.addressPostalCode} onChange={(e, data) => handleDetailsChange('addressPostalCode', data.value)} />
              </Form.Group>
              <p>Payment Details</p>
              <PaymentDetails />
              <p>Notes</p>
              <Form.Group widths="equal">
                <Form.TextArea placeholder="Dietary requirements, delivery instructions, resident is blind..." value={details.notes} onChange={(e, data) => handleDetailsChange('notes', data.value)} />
              </Form.Group>
              <Form.Button fluid as={PrimaryButton} onClick={handleComplete} disabled={totalQuantity === 0}>Complete</Form.Button>
            </Form>
          </div>
        </StyledGridInner>
      </StyledColumn>
    </StyledGrid>
  );
};

export default Order;
