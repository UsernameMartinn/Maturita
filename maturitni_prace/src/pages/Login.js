import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../LogInSignIn.css';


function LogIn() {
  // Definujeme stavy pro jednotlivé hodnoty formuláře
  const [logIn, setLogIn] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Stav pro chybovou hlášku
  const [successMessage, setSuccessMessage] = useState(''); // Stav pro úspěšnou zprávu
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uzivatel, setUzivatel] = useState('');

  const navigate = useNavigate();

  // Funkce pro odeslání formuláře
  const handleSubmit = async (event) => {
    event.preventDefault(); // Zabraňujeme defaultnímu odeslání formuláře

    // Odeslání dat na server
    const userData = { logIn, password };

    try {
      const response = await fetch('http://localhost:5000/LogIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Pokud je přihlášení úspěšné, zobrazíme zprávu o úspěchu
        setSuccessMessage(data.message);
        setIsLoggedIn(data.isLoggedIn);
        setIsAdmin(data.isAdmin);
        setUzivatel(data.uzivatel);

        // Uložení do localStorage
        localStorage.setItem('isLoggedIn', data.isLoggedIn);
        localStorage.setItem('isAdmin', data.isAdmin);
        localStorage.setItem('uzivatel', data.uzivatel);
        localStorage.setItem('mail', data.mail);

        setError(''); // Vymažeme případnou předchozí chybovou zprávu

        navigate('../pages/main');
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

  // Funkce pro načítání údajů z localStorage při načítání komponenty
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';  // Načteme hodnoty z localStorage
    const admin = localStorage.getItem('isAdmin') === 'true';
    const user = localStorage.getItem('uzivatel');

    setIsLoggedIn(loggedIn);
    setIsAdmin(admin);
    setUzivatel(user);
  }, []);  // Tento useEffect se spustí pouze při prvním načtení komponenty

  return (
      <div className="login-signin-container">
        <h2 className="login-signin-title">Přihlášení</h2>
        <form onSubmit={handleSubmit} className="login-signin-form">
          <label>Uživatelské jméno nebo email:
            <input
              id="logIn"
              type="text"
              value={logIn}
              onChange={(e) => setLogIn(e.target.value)}
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
          <button type="submit" className="login-signin-button">Přihlásit se</button>
        </form>
    
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    );
}

export default LogIn;
