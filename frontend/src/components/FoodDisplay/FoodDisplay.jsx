import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {food_list.map((item, index) => {
          // ⭐ FIXED category matching
          if (
            category.toLowerCase() === "all" ||
            item.category.toLowerCase() === category.toLowerCase()
          ) {
            return (
              <FoodItem
                key={item.id || index}
                id={item.id} // ⭐ required for cart
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image} // ⭐ frontend image, not backend
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;


