import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../Kosik.css';  // Nezapomeňte na import CSS souboru

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

  function VymazatKosik() {
    if (window.confirm("Opravdu chcete vymazat košík?")) {
      localStorage.setItem('kosik', JSON.stringify([]));
      nastavKosik([]);
    }
  }

  return (
    <div className="kosik-container">
      <h2 className="kosik-title">Košík</h2>
      <ul className="kosik-list">
        {kosik && kosik.length > 0 ? (
          kosik.map((polozka, index) => (
            <li key={index} className="kosik-item">
              <p className="kosik-item-text">
                {polozka.mnozstvi}x {polozka.title} - {Math.floor((polozka.celkovaCena * 100) / 100) * 27} Kč
              </p>
            </li>
          ))
        ) : (
          <p className="kosik-empty">Košík je prázdný.</p>
        )}
      </ul>
      <button onClick={() => ZakoupitHry()} className="kosik-button">
        Zaplatit
      </button>
      <button onClick={() => VymazatKosik()} className="kosik-button">Vymazat košík</button>
    </div>
  );
}

export default Kosik;
