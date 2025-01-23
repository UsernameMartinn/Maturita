import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Divider, Link } from '@mui/material';  // Import potřebných komponent z MUI

function Home() {
  const [hryData, setHryData] = useState([]); // Stav pro uchování dat her
  const [loading, setLoading] = useState(true); // Stav pro načítání dat

  useEffect(() => {
    fetch('http://localhost:5000/top_hry', {
      method: 'POST', // Pokud je to POST
    })
      .then(response => response.json())
      .then(data => {
        // Zajistíme, že data jsou vždy pole
        setHryData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Chyba při načítání dat:', error);
        setHryData([]);  // Pokud nastane chyba, nastavíme prázdné pole
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Načítání dat pro top hry...</div>;
  }

  // Pokud jsou data prázdná
  if (hryData.length === 0) {
    return <div>Žádné hry nejsou k dispozici.</div>;
  }

  return (
    <Grid container spacing={0}>
      {hryData.map((hra, index) => (
        <Grid item xs={4} key={index}>
          <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", margin: 5, padding: 10 }}>
            <Typography variant="h5">
              <Divider>
                {hra.title}
              </Divider>
            </Typography>
          </Paper>
          <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", margin: 5, padding: 10 }}>
            <Typography variant="h5">
              <img src={hra.img} alt={hra.title} style={{ width: 400, height: 400 }} /><br />
              <p>{hra.genre}</p>
              <p>{hra.price} USD</p>
              <p>{Math.round(hra.price * 24)} KČ</p>
              {/* Odkaz na detailní stránku */}
              <Link to={`/detail/${encodeURIComponent(hra.title)}`}>
                <button>Zobrazit detaily</button> {/* Tlačítko pro přesměrování */}
              </Link>
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default Home;
