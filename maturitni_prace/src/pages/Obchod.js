
import React from 'react'
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import '../App.css';
import Kosik from './Kosik';
import { Link } from 'react-router-dom';

function Obchod() {

    const hryData = [
        {
            "title": "The Witcher 3: Wild Hunt",
            "price": 39.99,
            "genre": "Action RPG",
            "developer": "CD Projekt Red",
            "img": '/assets/witcher.jpg'
        },
        {
            "title": "Cyberpunk 2077",
            "price": 59.99,
            "genre": "Action RPG",
            "developer": "CD Projekt Red",
            "img": '/assets/cyber_punk.jpg'
        },
        {
            "title": "Minecraft",
            "price": 26.95,
            "genre": "Sandbox, Survival",
            "developer": "Mojang Studios",
            "img": '/assets/minecraft.jpg'
        },
        {
            "title": "The Legend of Zelda: Breath of the Wild",
            "price": 59.99,
            "genre": "Action-Adventure",
            "developer": "Nintendo",
            "img": '/assets/zelda.jpg'
        },
        {
            "title": "Red Dead Redemption 2",
            "price": 49.99,
            "genre": "Action-Adventure, Open World",
            "developer": "Rockstar Games",
            "img": '/assets/rdd_two.jpg'
        },
        {
            "title": "Grand Theft Auto V",
            "price": 29.99,
            "genre": "Action-Adventure, Open World",
            "developer": "Rockstar North",
            "img": '/assets/gta_V.jpg'
        },
        {
            "title": "Dark Souls III",
            "price": 39.99,
            "genre": "Action RPG",
            "developer": "FromSoftware",
            "img": '/assets/dark_souls_III.jpg'
        },
        {
            "title": "Fortnite",
            "price": "Free-to-play",
            "genre": "Battle Royale, Survival",
            "developer": "Epic Games",
            "img": '/assets/fortnite.jpg'
        },
        {
            "title": "Call of Duty: Modern Warfare II (2022)",
            "price": 69.99,
            "genre": "First-Person Shooter",
            "developer": "Infinity Ward",
            "img": '/assets/CoD_MW_II.jpg'
        }
    ]

    return (
        <>
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
                                <img src={hra.img} style={{ width: 400, height: 400 }}/><br />
                                <p>{hra.genre}</p>
                                <p>{hra.price} USD</p>
                                <p>{Math.round(hra.price * 24)} KČ</p>
                                {/* Odkaz na detailní stránku */}
                                <Link to={`/detail/${hra.title}`}>
                                    <button>Zobrazit detaily</button> {/* Tlačítko pro přesměrování */}
                                </Link>
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default Obchod
