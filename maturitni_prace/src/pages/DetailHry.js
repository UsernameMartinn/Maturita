import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Komentare from '../components/Komentare';
import { Link } from 'react-router-dom';
import '../DetailHry.css';

function DetailHry() {
    const { title } = useParams(); // Používáme useParams pro získání názvu hry z URL
    const [hryData, setHryData] = useState([]);
    const [hra, setHra] = useState(null);
    const [kosik, nastavKosik] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/nactiHry')  // URL vašeho Python backendu
            .then((response) => response.json())
            .then((data) => {
                // Najděte hru podle titulu
                const hraDetail = data.find(hra => hra.title === title);
                setHra(hraDetail);
            })
            .catch((error) => console.error('Chyba při načítání dat:', error));
    }, [title]);

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
            const novyKosik = kosik.map(zbozi => {
                if (zbozi.title === hra.title) {
                    return {
                        ...zbozi,
                        mnozstvi: zbozi.mnozstvi + 1,
                        celkovaCena: (zbozi.price * (zbozi.mnozstvi + 1)),
                    };
                } else {
                    return zbozi;
                }
            });
            nastavKosik(novyKosik);
        } else {
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
    
    if (!hra) {
        return <p>Hra nebyla nalezena.</p>;
    }

    return (
        <div className="detail-container">
            <Grid item xs={10}>
                <Paper className="detail-paper">
                    <Typography className="detail-title">{hra.title}</Typography>
                    <img className="detail-image" src={hra.img} alt={hra.title} />
                    <div className="detail-info">
                        <p>Vývojář: {hra.developer}</p>
                        <p>{hra.genre}</p>
                        <p>Rok vydání: {hra.year}</p>
                    </div>
                    <div className="detail-price">
                        <p>{hra.price} USD</p>
                        <p>{Math.round(hra.price * 24)} KČ</p>
                    </div>
                    <button className="add-to-cart-button" onClick={() => pridatZbozi(hra)}>Přidat do košíku</button>
                    <button className="add-to-cart-button" onClick={() => odebratZbozi(hra)}>Odebrat z košíku</button>
                </Paper>
            </Grid>
            <Komentare />
        </div>
    );
}

export default DetailHry;
