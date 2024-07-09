import React, { useEffect, useState } from 'react';
import './App.css';
import ItemForm from './ItemForm';
import DeleteItem from './DeleteItem';

const BASE_URL = "http://127.0.0.1:5000/";

function App() {
  const [itemData, setItems] = useState([]);
  const [totalCost, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const response = await fetch(BASE_URL + "home");
    const data = await response.json();
    setItems(data.items);
    setTotal(data.total_cost);
  };

  const updateCallback = () => {
    getItems();
    setCurrentItem({});
  };

  const startUpdate = (item) => {
    setCurrentItem(item);
  };

  const startCreate = () => {
    setCurrentItem({});
  };

  return (
    <div>
      <h2>Here are the items you purchased</h2>
      <h3>Total Cost: {totalCost}</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Cost</th>
            <th>Date Purchased</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemData.map(item => (
            <tr key={item.id}>
              <td>{item.item_name}</td>
              <td>{item.cost}</td>
              <td>{item.date_purchased}</td>
              <td>{item.category}</td>
              <td>
                <DeleteItem id={item.id} updateCallback={updateCallback} />
                <button id="updateBtn" onClick={() => startUpdate(item)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ItemForm existingItem={currentItem} updateCallback={updateCallback}/>
      <button id="refresh" onClick={startCreate}>Click to refresh form</button> 
    </div>
  );
}

export default App;
