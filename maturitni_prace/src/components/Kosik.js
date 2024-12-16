import React from 'react';

function Kosik({ kosik = [] }) {
  return (
    <div>
      <h2>Košík</h2>
      <ul>
        {kosik.map((polozka, index) => (
          <li key={index}>
            <p>{polozka.title} - {polozka.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Kosik;
