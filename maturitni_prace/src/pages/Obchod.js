import React from 'react'
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import '../App.css';
import Kosik from '../components/Kosik';

function Obchod() {

    const [kosik, nastavKosik] = useState([])

    function pridatZbozi(hra) {
        nastavKosik(kosik => [...kosik, hra]);
    }

    const hryData = [
        {
            "title": "The Witcher 3: Wild Hunt",
            "price": 39.99,
            "genre": "Action RPG",
            "developer": "CD Projekt Red"
        },
        {
            "title": "Cyberpunk 2077",
            "price": 59.99,
            "genre": "Action RPG",
            "developer": "CD Projekt Red"
        },
        {
            "title": "Minecraft",
            "price": 26.95,
            "genre": "Sandbox, Survival",
            "developer": "Mojang Studios"
        },
        {
            "title": "The Legend of Zelda: Breath of the Wild",
            "price": 59.99,
            "genre": "Action-Adventure",
            "developer": "Nintendo"
        },
        {
            "title": "Red Dead Redemption 2",
            "price": 49.99,
            "genre": "Action-Adventure, Open World",
            "developer": "Rockstar Games"
        },
        {
            "title": "Grand Theft Auto V",
            "price": 29.99,
            "genre": "Action-Adventure, Open World",
            "developer": "Rockstar North"
        },
        {
            "title": "Dark Souls III",
            "price": 39.99,
            "genre": "Action RPG",
            "developer": "FromSoftware"
        },
        {
            "title": "Overwatch 2",
            "price": 39.99,
            "genre": "First-Person Shooter",
            "developer": "Blizzard Entertainment"
        },
        {
            "title": "Fortnite",
            "price": "Free-to-play",
            "genre": "Battle Royale, Survival",
            "developer": "Epic Games"
        },
        {
            "title": "Call of Duty: Modern Warfare II (2022)",
            "price": 69.99,
            "genre": "First-Person Shooter",
            "developer": "Infinity Ward"
        }
    ]

    return (
        <>
            <Grid container spacing={10}>
                {hryData.map((hra, index) => (
                    <Grid item xs={10} key={index}>
                        <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", margin: 5, padding: 10 }}>
                            <Typography variant="h5">
                                <Divider>
                                    {hra.title}
                                </Divider>
                            </Typography>
                        </Paper>
                        <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", margin: 5, padding: 10 }}>
                            <Typography variant="h5">
                                <p>Žánr: {hra.genre}</p>
                                <p>Cena: {hra.price}</p>
                                <p>Vývojář: {hra.developer}</p>
                                <button onClick={() => pridatZbozi(hra)}>Přidat</button>
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {<Kosik kosik={kosik} />}
        </>
    );
}

export default Obchod
