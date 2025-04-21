import { useState } from 'react';
import './App.css';
import ShoppingList from './ShoppingList';

function App() {
  const [shoppingList, setShoppingList] = useState([]);
  const [budget] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const addItem = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());

    formDataObj.cost = parseFloat(formDataObj.cost || 0);
    formDataObj.category = formDataObj.category || "other";

    setShoppingList([...shoppingList, formDataObj]);
    form.reset();
  };

  const removeItem = (event) => {
    const name = event.target.value;
    setShoppingList(shoppingList.filter(item => item.name !== name));
  };

  const totalSpent = shoppingList.reduce((acc, item) => acc + Number(item.cost), 0);
  const remainingBudget = budget - totalSpent;

  const filteredList = selectedCategory === "all"
    ? shoppingList
    : shoppingList.filter(item => item.category === selectedCategory);

  return (
    <>
      <h1>Shopping List Manager</h1>
      <h2>Remaining Budget: ${remainingBudget.toFixed(2)}</h2>

      <div className='card'>
        <form onSubmit={addItem} className='flex-apart'>
          <input type="text" name="name" placeholder="Add item to list..." />
          <select name="category">
            <option value="grocery">Grocery</option>
            <option value="school">School</option>
            <option value="other">Other</option>
          </select>
          <input type="number" step="0.01" name="cost" placeholder="Cost ($)" />
          <button className='btn purple' type="submit">Add</button>
        </form>
      </div>

      <div className="category-filter">
        <button onClick={() => setSelectedCategory("all")}>All</button>
        <button onClick={() => setSelectedCategory("grocery")}>Grocery</button>
        <button onClick={() => setSelectedCategory("school")}>School</button>
        <button onClick={() => setSelectedCategory("other")}>Other</button>
      </div>

      <ShoppingList
        shoppingList={filteredList}
        removeItem={removeItem}
      />
    </>
  );
}

export default App;

