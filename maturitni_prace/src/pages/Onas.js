import React from 'react';
import '../Onas.css';
import Paper from '@mui/material/Paper';
import { Typography } from "@mui/material";

function Kontakt() {
  return (
    <div className="onas-container">
      <Paper className="onas-title-paper" variant="elevation" elevation={4} square={false}>
        <Typography className="onas-title">
          O nás
        </Typography>
      </Paper>
      <Paper className="onas-info-paper" variant="elevation" elevation={4} square={false}>
        <Typography variant="h4">
          Jsme firma, která Vás ráda uvede do světa her.
        </Typography>
        <Typography className="onas-info-text">
          <div className="onas-info-title">|Telefon: </div>
          <div className="onas-info-title">|Email: </div>
        </Typography>
      </Paper>
    </div>
  );
}

export default Kontakt;
