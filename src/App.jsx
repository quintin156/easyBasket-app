import "./App.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import { useState, useEffect, useRef } from "react";

const appSettings = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

function App() {
  const [items, setItems] = useState([]);

  const inputRef = useRef(null);

  const addItem = () => {
    let inputValue = inputRef.current.value;
    push(shoppingListInDB, inputValue);
    inputRef.current.value = "";
  };

  const removeItem = (itemID) => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  };

  useEffect(() => {
    onValue(shoppingListInDB, (snapshot) => {
      if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });
  }, []);

  return (
    <div className="container">
      <h1>
        EasyBasket <sup>&copy;</sup>
      </h1>
      <img src="./basket.png" alt="" />
      <input type="text" placeholder="Items Here" ref={inputRef} />
      <button id="add-button" onClick={addItem}>
        Add to cart
      </button>
      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item[0]} onDoubleClick={() => removeItem(item[0])}>
              {item[1]}
            </li>
          ))
        ) : (
          <li>no items here yet...</li>
        )}
      </ul>
    </div>
  );
}

export default App;
