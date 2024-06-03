
import './Newtask.css';

import React, { useState } from 'react';

function Newtask() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleAddTask = () => {
    if (taskTitle && taskDescription) {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
      };

      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setShowModal(false);
    }
  };

  return (
    <div>
      {/* Other dashboard content */}
      {tasks.map((task, index) => (
        <div key={index}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}

      {showModal && (
        <div className="modal">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <button onClick={handleAddTask}>Save</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}

      <button className="add-task-button" onClick={() => setShowModal(true)}>
        +
      </button>
    </div>
  );
}

export default Newtask;
