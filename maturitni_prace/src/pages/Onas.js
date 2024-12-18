import React from 'react'
import '../App.css';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';

function Kontakt() {
  return (
    <div>
      <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", width: "80%", marginLeft: "10%", marginTop: 40, marginBottom: 40, padding: 5 }}>
        <Typography variant="h2" fontFamily={"Arial"}>
          O nás
        </Typography>
      </Paper>
      <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", width: "80%", marginLeft: "10%", padding: 5 }}>
        <Typography variant="h4">
          Jsme firma, která Vás ráda uvede do světa her.
        </Typography>
        <Typography variant="h4" textAlign={"left"} marginLeft={"3px"}>
          <b>|Telefon: </b><br />
          <b>|Email: </b><br />
        </Typography>
      </Paper>
    </div>
  )
}

export default Kontakt