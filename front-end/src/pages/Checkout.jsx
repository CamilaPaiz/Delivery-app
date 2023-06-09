import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ProductRow from '../components/ProductRow';
import AdressForm from '../components/AdressForm';
import fetchApi from '../services/fetchApi';

export default function Checkout() {
  const [productsSale, setProductsSale] = useState([]);
  const [totalOrderPrice, setValueProducts] = useState(0);
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [adress, setAdress] = useState('');
  const [number, setNumber] = useState('');

  const history = useHistory();

  const handleClickRemoveItem = (name) => {
    const newProductsSale = productsSale.filter((product) => product.name !== name);
    setProductsSale(newProductsSale);
    const productsCart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCart = productsCart.find((item) => item.name === name);
    itemCart.quantity = 0;
    localStorage.setItem('cart', JSON.stringify(productsCart));
  };

  const handleResponsiblePerson = ({ target }) => {
    setResponsiblePerson(target.value);
  };

  const handleAdress = ({ target }) => {
    setAdress(target.value);
  };

  const handleNumber = ({ target }) => {
    setNumber(target.value);
  };

  const handleClickFinishSale = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const orderInfo = { responsiblePerson, adress, number };

    const result = await fetchApi(
      'POST',
      'orders',
      userInfo.token,
      { productsSale, orderInfo, userInfo, totalOrderPrice },
    );
    history.push(`/customer/orders/${result.id}`);
  };

  useEffect(() => {
    const getProductsCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProductsSale(getProductsCart);
  }, []);

  useEffect(() => {
    const totalPrice = productsSale
      .reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
      .toFixed(2)
      .toString()
      .replace('.', ',');
    setValueProducts(totalPrice);
  }, [productsSale]);

  return (
    <div>
      <NavBar />
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>SubTotal</th>
            <th>Remover Item</th>
          </tr>
        </thead>
        <tbody>
          {productsSale.filter((product) => product.quantity !== 0)
            .map((product, index) => (
              <ProductRow
                key={ index }
                product={ product }
                index={ index }
                handleClickRemoveItem={ handleClickRemoveItem }
              />
            ))}
        </tbody>
      </table>

      <h3
        data-testid="customer_checkout__element-order-total-price"
      >
        {
          totalOrderPrice
        }

      </h3>

      <AdressForm
        handleResponsiblePerson={ handleResponsiblePerson }
        setResponsiblePerson={ setResponsiblePerson }
        handleAdress={ handleAdress }
        handleNumber={ handleNumber }
      />

      <button
        type="button"
        data-testid="customer_checkout__button-submit-order"
        onClick={ handleClickFinishSale }
      >
        Finalizar
      </button>
    </div>
  );
}
