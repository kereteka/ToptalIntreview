import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import React, { useEffect, useState } from 'react';
import { getProducts } from './dataService';

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const roundNumber = (num) => (Math.round(num * 100) / 100).toFixed(2);


const Product = ({id,name,price,availableCount,orderedQuantity,total, onQuantityChange}) => {
  const handleIncrement = () => {
    onQuantityChange(id, +orderedQuantity+1)
  }

  const handleDecrement = () => {
    onQuantityChange(id, orderedQuantity-1)
  }

  return (  
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>{roundNumber(total)}</td>
      <td>
        <button onClick={handleIncrement} disabled={orderedQuantity === availableCount}>+</button>
        <button onClick={handleDecrement} disabled={orderedQuantity === 0}>-</button>
      </td>
    </tr> 
  );
}


const Checkout = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  let totalPrice = 0;
  let discount = 0;

  useEffect(() => {
    getProducts().then((products) =>
    {setProducts(products.map(product => ({...product, orderedQuantity: 0, total: 0 }))); setIsLoading(false)}).catch(() => console.log('error'))
  }, [])

  const onQuantityChange = (id, orderedQuantity) => {
    const changedProducts = products.map(product => {
      if(product.id === id) {
        return({
          id: product.id,
          name: product.name,
          availableCount: product.availableCount,
          orderedQuantity: orderedQuantity,
          total: orderedQuantity * product.price,
          price: product.price
        })
      }
      return product
    })
    setProducts(changedProducts)
  }

  products.forEach(product => totalPrice += product.total)
  discount = totalPrice > 1000 ?  0.1 : 0
  totalPrice -= discount!== 0 &&  totalPrice * discount

  return (
    <div>
      <header className={styles.header}>        
        <h1>Electro World</h1>        
      </header>
      <main>
          {isLoading && <LoadingIcon /> }
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!products ? '' : 
            products.map((product) => 
            <Product 
              key={product?.id}
              id={product?.id} 
              name={product?.name}
              price={product?.price}
              total={product?.total}
              orderedQuantity={product?.orderedQuantity}
              availableCount={product?.availableCount}
              onQuantityChange={onQuantityChange}
            /> 
            )}
          </tbody>
        </table>
        <h2>Order summary</h2>
          <p>
          {discount!== 0 && 'Total Disctount: $'+roundNumber(totalPrice*discount) }
        </p>
        <p>
          Total Price ${roundNumber(totalPrice)}
        </p>
      </main>
    </div>
  );
};

export default Checkout;