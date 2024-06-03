import React, { useState } from 'react';

function MyTable2() {

    const [users, setUsers] = useState
        ([
            { EnseignantID: 1, Nom: "Abidi", Prenom: "Kamel",  Email:"jasserjohn@gmail.com", Téléphone: "25399797" },
            { EnseignantID: 2, Nom: "Youssef", Prenom: "Jihed", Email:"youssefjihed@gmail.com", Téléphone: "98732510" },
            { EnseignantID: 3, Nom: "Nasri", Prenom: "Marwa",  Email:"nasrimarwa00@gmail.com", Téléphone: "41846575" },   
            { EnseignantID: 3, Nom: "Amairi", Prenom: "Ons",  Email:"onsamairi55@gmail.com", Téléphone: "21876599" }, 
            { EnseignantID: 3, Nom: "Belgacem", Prenom: "Samir",  Email:"samirbelgacem@gmail.com", Téléphone: "27986020" }, 
            { EnseignantID: 3, Nom: "Gafsi", Prenom: "Ahlem",  Email:"ahlemgafsi@gmail.com", Téléphone: "96421423" },            
        ]);

        const [searchQuery, setSearchQuery] = useState('');
        const [filteredUsers, setFilteredUsers] = useState([]);
        
        const handleSearch = () => {
          const filtered = users.filter((user) =>
            user.Nom.toLowerCase().startsWith(searchQuery.toLowerCase())
          );
          setFilteredUsers(filtered);
        };
        
        return (
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom..."
              className="mt-5"
            />
            <button onClick={handleSearch}>Search</button>
        
            <table>
              <thead>
                <tr>
                  <th>EnseignantID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0
                  ? filteredUsers.map((user) => (
                      <tr key={user.EnseignantID}>
                        <td>{user.EnseignantID}</td>
                        <td>{user.Nom}</td>
                        <td>{user.Prenom}</td>
                        <td>{user.Email}</td>
                        <td>{user.Téléphone}</td>
                      </tr>
                    ))
                  : users.map((user) => (
                      <tr key={user.EnseignantID}>
                        <td>{user.EnseignantID}</td>
                        <td>{user.Nom}</td>
                        <td>{user.Prenom}</td>
                        <td>{user.Email}</td>
                        <td>{user.Téléphone}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        );
        
}

export default MyTable2;
