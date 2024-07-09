import React from 'react';
import './DeleteItem.css'

const BASE_URL = "http://127.0.0.1:5000/";

const DeleteItem = ({ id, updateCallback }) => {
  const deleteItem = async () => {
    try {
      const response = await fetch(BASE_URL+`delete_item/${id}`, { method: 'DELETE' });
      if (response.ok) {
        updateCallback();
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error: ', error);
      alert('Error: Check console.');
    }
  };

  return <button id="deleteBtn" onClick={deleteItem}>Delete</button>;
};

export default DeleteItem;
