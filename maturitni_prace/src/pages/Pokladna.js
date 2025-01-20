import React, { useState } from 'react';
import '../App.css';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { Typography } from "@mui/material";

function Pokladna() {
    const [kosik, nastavKosik] = useState([]);

    // Načteme košík z localStorage při načítání komponenty

    function zakoupeno() {
        localStorage.setItem('kosik', JSON.stringify(kosik));
    }

    return (
        <>
            <Paper variant="elevation" elevation={4} square={false} className="pokladna-container">
                <Typography variant="h4" gutterBottom>
                    Pokladna
                </Typography>

                <form className="pokladna-form">
                    <label for='cisloKarty'>Číslo karty</label>
                    <input type='number' placeholder='XXXX-XXXX-XXXX-XXXX'></input>

                    <label for='datumExpirace'>Datum expirace</label>
                    <input type='date' placeholder='XX-XX'></input>

                    <label for='cvv'>CVV</label>
                    <input type='number' placeholder='XXX'></input>

                    <Divider className="pokladna-divider" />

                    <button type="submit" onClick={() => zakoupeno()} className="pokladna-submit-btn">Zaplatit</button>
                </form>
            </Paper>
        </>
    );
}

export default Pokladna;
