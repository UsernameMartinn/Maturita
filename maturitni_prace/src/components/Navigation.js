import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import '../App.css';
import PrihlasovaciMenu from './Prihlasovani';
import { Divider } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navigation = () => {

    const [uzivatel, setUzivatel] = useState('');

    useEffect(() => {
        const uzivatel = localStorage.getItem('uzivatel');
        setUzivatel(uzivatel);
    }, []);

    return (
        <>
        <Divider style={{backgroundColor:"black"}} />
           <div id='menu' style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <nav>
                    <Button id="navButton" variant="contained" href="/maturitni_prace/#">Home</Button>
                    <Button id="navButton" variant="contained" href="/maturitni_prace/#pages/Onas">O nás</Button>
                    <Button id="navButton" variant="contained" href="/maturitni_prace/#pages/Obchod">Obchod</Button>
                    <Button id="navButton" variant="contained" href="/maturitni_prace/#pages/Kosik">Košík</Button>
                </nav>
                <PrihlasovaciMenu />
                <div id='user_in_menu'>
                <AccountCircleIcon /> {uzivatel}
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Navigation;