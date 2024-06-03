import React, { useState } from 'react';

function MyTable() {
  const [tableData, setTableData] = useState([
    { id: 1, nom: 'John', age: 25 },
    { id: 2, nom: 'Alice', age: 30 },
    { id: 2, nom: 'Ayice', age: 30 },
    { id: 3, nom: 'Bob', age: 20 },
    
    // Other table data
  ]);
  const [sortCriteria, setSortCriteria] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle the sorting
  const sortTableByNom = () => {
    const filteredData = tableData.filter(item =>
        item.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const sortedData = [...filteredData].sort((a, b) => {
      const nomA = a.nom.toUpperCase();
      const nomB = b.nom.toUpperCase();
      if (nomA < nomB) {
        return -1;
      } else if (nomA > nomB) {
        return 1;
      }
      return 0;
    });

    setTableData(sortedData);
    setSortCriteria('Nom');
  };

  // JSX code for rendering the table
  return (
    <div>

        <input
        type="text"
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
        placeholder="Rechercher par nom"
        className='mt-5'
        />
  

      <button className='mt-5 mb-5' onClick={sortTableByNom}>Sort by Nom</button>
      <table class='table'>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>{item.nom}</td>
              <td>{item.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyTable;
