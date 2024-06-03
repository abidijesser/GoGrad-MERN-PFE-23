import React, { useState } from 'react';

const Modal = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSave = () => {
    // Validate the input fields if needed
    // Call the onSave callback function with the task data
    onSave({ title, description, dueDate });

    // Reset the input fields
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <div className="modal">
      <h2>Add Task</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Due Date:
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </label>
      <div className="modal-buttons">
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
