import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import '../Home.css'; // Importujeme CSS pro externí styly

function Home() {
  const [topHry, setTopHry] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/top_hry')
      .then((response) => response.json())
      .then((data) => setTopHry(data))
      .catch((error) => console.error('Chyba při načítání top her:', error));
  }, []);

  return (
    <div className="home-container">
      <h1 className="title">Top Hry</h1>
      <Grid container spacing={2}>
        {topHry.map((hra) => (
          <Grid item xs={12} sm={6} md={4} key={hra.id}>
            <Paper className="game-card" elevation={3}>
              <img src={hra.img} alt={hra.title} className="game-image" />
              <Typography variant="h6" className="game-title">{hra.title}</Typography>
              <Typography variant="body1" className="rating">
                Průměrné hodnocení: 
                {typeof hra.average_rating === 'number' && !isNaN(hra.average_rating)
                  ? hra.average_rating.toFixed(2)
                  : 'N/A'}
              </Typography>
              <Typography variant="body2" className="game-genre">{hra.genre}</Typography>
              <Typography variant="body2" className="game-price">{hra.price} USD</Typography>
              <Typography variant="body2" className="game-price-czk">
                {(hra.price * 24).toFixed(2)} KČ
              </Typography>
              <Link component={RouterLink} to={`/detail/${encodeURIComponent(hra.title)}`}>
                <Button variant="contained" className="details-button">Zobrazit detaily</Button>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
