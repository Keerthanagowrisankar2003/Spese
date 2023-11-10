// AddItemModal.js

import React, { useState } from 'react';

const AddItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [item, setItem] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleAddItem = () => {
    // Perform any necessary validations here
    onAddItem({ item, date, amount, category });
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Item</h2>
        <input type="text" value={newItem} onChange={(e) => setItem(e.target.value)} placeholder="Item" />
        <input type="date" value={newDate} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
        <input type="number" value={newAmount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input type="text" value={newCategory} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <button onClick={handleAddItem}>Add</button>
      </div>
    </div>
  );
}

export default AddItemModal;
