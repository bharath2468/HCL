import React, { useState } from 'react';

const AuthForm = ({ onSubmit, title }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setcontact] = useState('');
  const [address, setaddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("1")
    onSubmit({ name, address, contact, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {title === 'Signup' && (
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div>
        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contact</label>
        <input
          type="number"
          value={contact}
          onChange={(e) => setcontact(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">{title}</button>
    </form>
  );
};

export default AuthForm;
