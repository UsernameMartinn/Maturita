import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import '../Prihlasovani.css'; // Ujisti se, že tento soubor obsahuje importovaný CSS
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function PrihlasovaciMenu() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [uzivatel, setUzivatel] = useState('');
    const [hra, setHra] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [mail, setMail] = useState('')

    const open = Boolean(anchorEl);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const admin = localStorage.getItem('isAdmin') === 'true';
        const uzivatel = localStorage.getItem('uzivatel');
        const hra = localStorage.getItem('hra');
        const mail = localStorage.getItem('mail')

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setUzivatel(uzivatel);
        setHra(hra);
        setMail(mail)
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setIsLoggedIn(false);
        setUzivatel('');
        
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('uzivatel', '');
        localStorage.setItem('mail', '');
    };

    const options = isLoggedIn
        ? [
            { label: "Odhlásit se", action: handleLogout }
          ]
        : [
            { label: "Přihlásit se", path: "pages/login" },
            { label: "Vytvořit si účet", path: "pages/signin" }
          ];

    const ITEM_HEIGHT = 48;

    return (
        <div className="prihlasovaci-menu-container">
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                className="prihlasovaci-menu-icon"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            handleClose();
                            if (option.action) {
                                option.action();
                            }
                        }}
                        component={option.path ? Link : 'button'}
                        to={option.path}
                        className="MuiMenuItem-root"
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
