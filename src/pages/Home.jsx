import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/Product-card";

const Home = () => {
  const addToCartHandler = () => {};

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>

      <main>
        <ProductCard
          productId="asd"
          name="macbook"
          price={2345}
          stock={35}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71vFKBpKakL._AC_UF1000,1000_QL80_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
