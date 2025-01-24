import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import '../Obchod.css'; // Nezapomeň importovat nový CSS soubor!

function Obchod() {
  const [hryData, setHryData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/nactiHry')  
      .then((response) => response.json())
      .then((data) => {
        setHryData(data);
      })
      .catch((error) => console.error('Chyba při načítání dat:', error));
  }, []);

  return (
    <div className="obchod-container"> {/* Třída pro celkový vzhled */}
      <Grid container spacing={3}>
        {hryData.map((hra, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <div className="game-card"> {/* Třída pro kartu hry */}
              <img src={hra.img} alt={hra.title} className="game-image" />
              <Typography variant="h5" className="game-title">
                {hra.title}
              </Typography>
              <Typography variant="body1" className="game-genre">
                {hra.genre}
              </Typography>
              <Typography variant="body2" className="game-price">
                {hra.price} USD
              </Typography>
              <Typography variant="body2" className="game-price-czk">
                {Math.round(hra.price * 24)} KČ
              </Typography>
              <Link to={`/detail/${encodeURIComponent(hra.title)}`} className="details-link">
                <button className="details-button">Zobrazit detaily</button>
              </Link>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Obchod;
