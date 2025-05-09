import React, { useState } from 'react';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([
    { username: 'user1', password: 'password123', role: 'user' }
  ]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUser.username && newUser.password) {
      setUsers([...users, newUser]);
      setNewUser({ username: '', password: '', role: 'user' });
    }
  };

  return (
    <div className="users-management">
      <h2>Users Management</h2>
      
      <form onSubmit={handleAddUser} className="add-user-form">
        <h3>Add New User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <div className="users-list">
        <h3>Existing Users</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => {
                    const newUsers = users.filter((_, i) => i !== index);
                    setUsers(newUsers);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;