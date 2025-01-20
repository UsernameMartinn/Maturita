import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import '../App.css';
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
    
    const open = Boolean(anchorEl);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';  // Načteme hodnoty z localStorage
        const admin = localStorage.getItem('isAdmin') === 'true';
        const uzivatel = localStorage.getItem('uzivatel');
        const hra = localStorage.getItem('hra');

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setUzivatel(uzivatel);
        setHra(hra);
    }, [isLoggedIn]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Zde můžete implementovat logiku pro odhlášení uživatele
        localStorage.setItem('isLoggedIn', 'false');
        setIsLoggedIn(false);
    };

    // Možnosti menu
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
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
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
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
