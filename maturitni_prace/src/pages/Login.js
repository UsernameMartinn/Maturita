import React, { useState } from 'react';

function LogIn() {
  // Definujeme stavy pro jednotlivé hodnoty formuláře
  const [logIn, setLogIn] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Stav pro chybovou hlášku
  const [successMessage, setSuccessMessage] = useState(''); // Stav pro úspěšnou zprávu
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        // Pokud je přihlášení úspěšná, zobrazíme zprávu o úspěchu
        setSuccessMessage(data.message);
        setIsLoggedIn(data.isLoggedIn);
        setError(''); // Vymažeme případnou předchozí chybovou zprávu
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
    <div>
      <form onSubmit={handleSubmit}>
        <label>Uživatelské jméno nebo email:
          <input
            id='logIn'
            type="text"
            value={logIn}
            onChange={(e) => setLogIn(e.target.value)}
          />
        </label>
        <label>Heslo:
          <input
            id='passwrd'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Registrovat se</button>
      </form>

      {/* Zobrazení chybové zprávy */}
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

      {/* Zobrazení úspěšné zprávy */}
      {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
}

export default LogIn
