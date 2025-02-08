import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../LogInSignIn.css';


function SignIn() {
  // Definujeme stavy pro jednotlivé hodnoty formuláře
  const [user_name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(''); // Stav pro chybovou hlášku
  const [successMessage, setSuccessMessage] = useState(''); // Stav pro úspěšnou zprávu

  const navigate = useNavigate();

  // Funkce pro odeslání formuláře
  const handleSubmit = async (event) => {
    event.preventDefault(); // Zabraňujeme defaultnímu odeslání formuláře

    // Ověření, že hesla jsou shodná
    if (password !== passwordConfirm) {
      setError('Hesla se neshodují');
      setSuccessMessage(''); // Vymažeme případnou předchozí úspěšnou zprávu
      return;
    }

    // Odeslání dat na server
    const userData = { user_name, email, password };

    try {
      const response = await fetch('http://localhost:5000/SignIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Pokud je registrace úspěšná, zobrazíme zprávu o úspěchu
        setSuccessMessage(data.message);
        setError(''); // Vymažeme případnou předchozí chybovou zprávu
        navigate('../pages/logIn');
      } else {
        // Pokud dojde k chybě, nastavíme chybovou zprávu
        setError(data.error);
        setSuccessMessage(''); // Vymažeme případnou předchozí úspěšnou zprávu
      }
    } catch (error) {
      // Pokud nastane chyba při odesílání požadavku, nastavíme chybovou hlášku
      setError('Chyba při odesílání požadavku');
      setSuccessMessage(''); // Vymažeme případnou předchozí úspěšnou zprávu
    }
  };

  return (
    <div className="login-signin-container">
      <h2 className="login-signin-title">Registrace</h2>
      <form onSubmit={handleSubmit} className="login-signin-form">
        <label>Uživatelské jméno:
          <input
            id="user_name"
            type="text"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label>E-mail:
          <input
            id="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>Heslo:
          <input
            id="passwrd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>Znovu zadejte heslo:
          <input
            id="passwrdPotvrzeni"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </label>
        <button type="submit" className="login-signin-button">Registrovat se</button>
      </form>
  
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
  
}

export default SignIn;
