import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import '../App.css';
import { Link } from 'react-router-dom';

function DetailHry() {
    const { title } = useParams(); // Používáme useParams pro získání názvu hry z URL
    const [hra, setHra] = useState(null);


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

    // Data her
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

    useEffect(() => {
        // Hledáme hru podle názvu z URL
        const hraDetail = hryData.find(hra => hra.title === title);
        setHra(hraDetail);
    }, [title]);

    if (!hra) {
        return <p>Hra nebyla nalezena.</p>;
    }

    return (
        <Grid item xs={10}>
            <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", margin: 5, padding: 10 }}>
                <Typography variant="h5">
                    <Divider>
                        {hra.title}
                    </Divider>
                </Typography>
            </Paper>
            <Paper variant="elevation" elevation={4} square={false} style={{ textAlign: "center", margin: 5, padding: 10 }}>
                <Typography variant="h5">
                    <img src={hra.img} style={{ width: 400, height: 400 }} /><br />
                    <p>Vývojář: {hra.developer}</p>
                    <p>{hra.genre}</p>
                    <p>{hra.price} USD</p>
                    <p>{Math.round(hra.price * 24)} KČ</p>
                    <Link to={`/pages/Kosik`}>
                        <IconButton>
                            <AddShoppingCartIcon />
                        </IconButton>
                    </Link>
                    <button onClick={() => pridatZbozi(hra)} color="primary">Přidat</button>
                    <button onClick={() => odebratZbozi(hra)}>Odebrat</button>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default DetailHry;