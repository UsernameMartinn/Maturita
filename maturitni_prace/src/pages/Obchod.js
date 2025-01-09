
import React from 'react'
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import '../App.css';
import Kosik from './Kosik';
import { Link } from 'react-router-dom';

function Obchod() {
    const [hryData, setHryData] = useState([]);

    // Načítání her z backendu při načítání komponenty
    
    useEffect(() => {
        fetch('http://localhost:5000/nactiHry')  // URL vašeho Python backendu
            .then((response) => response.json())
            .then((data) => {
                setHryData(data); // Uložení dat do stavu
            })
            .catch((error) => console.error('Chyba při načítání dat:', error));
    }, []);

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
                                <Link to={`/detail/${encodeURIComponent(hra.title)}`}>
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
