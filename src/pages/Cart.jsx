import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "asd",
    photo:
      "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71vFKBpKakL._AC_UF1000,1000_QL80_.jpg",
    name: "Macbook Pro M1",
    price: 23000,
    quantity: 4,
    stock: 10,
  },
];

const subTotal = 4000;
const tax = Math.round(subTotal * 0.18);
const shippingCharges = 200;
const total = subTotal + tax + shippingCharges;
const discount = 211;

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);

  useEffect(() => {
    const timeOutid = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCode(true);
      } else {
        setIsValidCode(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeOutid);
      setIsValidCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, index) => <CartItem key={index} cartItem={i} />)
        ) : (
          <h1>No Item Added</h1>
        )}
      </main>

      <aside>
        <p>Subtotal: ₹{subTotal} </p>
        <p>Shipping Charges: ₹{shippingCharges} </p>
        <p>Tax: ₹{tax} </p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total : ₹{total}</b>
        </p>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter Coupon Code Here"
        />

        {couponCode &&
          (isValidCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to={"/shipping"}>CheckOut</Link>}
      </aside>
    </div>
  );
};

export default Cart;
