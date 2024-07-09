import React, { useState, useEffect } from 'react';
import './ItemForm.css'
const BASE_URL = "http://127.0.0.1:5000/";

const ItemForm = ({ existingItem = {}, updateCallback }) => {
    const [itemName, setName] = useState("");
    const [itemCost, setCost] = useState("");
    const [date, setDate] = useState("");
    const [itemCategory, setCategory] = useState("");

    useEffect(() => {
        setName(existingItem.item_name || "");
        setCost(existingItem.cost || "");
        setDate(existingItem.date_purchased || "");
        setCategory(existingItem.category || "");
    }, [existingItem]);

    const updating = !!existingItem.id;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            item_name: itemName,
            cost: itemCost,
            date_purchased: date,
            category: itemCategory
        };

        const url = BASE_URL + (updating ? `update_item/${existingItem.id}` : "add_item");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert(`Error: ${errorData.message}`);
            } else {
                console.log('Success:', await response.json());
                updateCallback();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error. Check console.');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="itemName">Item Name:</label>
                <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="itemCost">Item Cost:</label>
                <input
                    type="number"
                    id="itemCost"
                    value={itemCost}
                    onChange={(e) => setCost(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="itemCategory">Category:</label>
                <input
                    type="text"
                    id="itemCategory"
                    value={itemCategory}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>
            <button id="action" type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ItemForm;
