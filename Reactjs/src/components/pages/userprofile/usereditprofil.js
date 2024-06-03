import { useState } from 'react';

function MyComponent() {
  const [showButton, setShowButton] = useState(true);
  const [email, setEmail] = useState('');

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleButtonClick() {
    setShowButton(false);
  }

  function handleSaveClick() {
    // Handle save logic here
    setShowButton(true);
  }

  return (
    <div className="flex justify-between items-center">
      <div className="mr-40 text-lg">Email</div>
      <input className="text-gray-500" value={email} onChange={handleEmailChange} />
      {showButton && (
        <button className="px-3 py-1 bg-mygreen hover:bg-mygreen2 text-white rounded-md changer1" onClick={handleButtonClick}>Modifier</button>
      )}
      {!showButton && (
        <button className="px-3 py-1 bg-mygreen hover:bg-mygreen2 text-white rounded-md changer1" onClick={handleSaveClick}>Enregistrer</button>
      )}
    </div>
  );
}
 export default MyComponent;