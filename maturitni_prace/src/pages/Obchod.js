
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

function Obchod() {
    const [kosik, nastavKosik] = useState([]);

    // Načtení košíku z localStorage při načtení komponenty
    useEffect(() => {
        const savedKosik = JSON.parse(localStorage.getItem('kosik'));
        if (savedKosik) {
            nastavKosik(savedKosik);
        }
    }, []);

    // Uložení košíku do localStorage při jeho změně
    useEffect(() => {
        if (kosik.length > 0) {
            localStorage.setItem('kosik', JSON.stringify(kosik));
        }
    }, [kosik]);

    function pridatZbozi(hra) {
        const existujiciHra = kosik.find(zbozi => zbozi.title === hra.title);

        if (existujiciHra) {
            // Pokud hra již v košíku je, upravíme ji
            const novyKosik = kosik.map(zbozi => {
                if (zbozi.title === hra.title) {
                    // Přepočítáme celkovou cenu a množství
                    return {
                        ...zbozi,
                        mnozstvi: zbozi.mnozstvi + 1,
                        celkovaCena: (zbozi.price * (zbozi.mnozstvi + 1)) // Přepočítáme celkovou cenu
                    };
                } else {
                    return zbozi;
                }
            });

            // Aktualizujeme stav s novým košíkem
            nastavKosik(novyKosik);
        } else {
            // Pokud hra není v košíku, přidáme ji s množstvím 1 a celkovou cenou
            nastavKosik(kosik => [...kosik, { ...hra, mnozstvi: 1, celkovaCena: hra.price }]);
        }
    }

    function odebratZbozi(hra) {
        const existujiciHra = kosik.find(zbozi => zbozi.title === hra.title);

        if (existujiciHra) {
            // Pokud množství je větší než 1, snížíme ho
            if (existujiciHra.mnozstvi > 1) {
                const novyKosik = kosik.map(zbozi => {
                    if (zbozi.title === hra.title) {
                        return {
                            ...zbozi,
                            mnozstvi: zbozi.mnozstvi - 1,
                            celkovaCena: zbozi.price * (zbozi.mnozstvi - 1) // Přepočítáme celkovou cenu
                        };
                    } else {
                        return zbozi;
                    }
                });
                nastavKosik(novyKosik);
            } else {
                // Pokud je množství 1, odstraníme položku z košíku
                const novyKosik = kosik.filter(zbozi => zbozi.title !== hra.title);
                nastavKosik(novyKosik);
            }
        }
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
                                <IconButton onClick={() => pridatZbozi(hra)} color="primary" aria-label="add to shopping cart" >
                                    <AddShoppingCartIcon />
                                </IconButton>
                                <button onClick={() => odebratZbozi(hra)}>Odebrat</button>
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default Obchod
