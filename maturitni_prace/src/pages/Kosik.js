
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Kosik() {
  const [kosik, nastavKosik] = useState([]);
  const navigate = useNavigate();

  // Načteme košík z localStorage při načítání komponenty
  useEffect(() => {
    const savedKosik = JSON.parse(localStorage.getItem('kosik'));
    if (savedKosik) {
      nastavKosik(savedKosik);
    }
  }, []);

  function ZakoupitHry() {
    navigate('../pages/Pokladna');
  }

  return (
    <div>
      <h2>Košík</h2>
      <ul>
        {kosik && kosik.length > 0 ? (
          kosik.map((polozka, index) => (
            <li key={index}>
              <p>{polozka.mnozstvi}x {polozka.title} - {Math.floor(polozka.celkovaCena * 100) / 100}</p>
            </li>
          ))
        ) : (
          <p>Košík je prázdný.</p>
        )}
      </ul>
      <button onClick={() => ZakoupitHry()}>Zaplatit</button>
    </div>
  );
}

export default Kosik;
