import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function Komentare() {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0); // Inicializace na 0, aby byla hodnota definována
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [uzivatel, setUzivatel] = useState('');
    const [error, setError] = useState(''); // Stav pro chybovou hlášku
    const [successMessage, setSuccessMessage] = useState(''); // Stav pro úspěšnou zprávu
    const [hra, setHra] = useState('');

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';  // Načteme hodnoty z localStorage
        const admin = localStorage.getItem('isAdmin') === 'true';
        const uzivatel = localStorage.getItem('uzivatel');
        const hra = localStorage.getItem('hra');

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setUzivatel(uzivatel);
        setHra(hra);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Zabraňujeme defaultnímu odeslání formuláře

        // Odeslání dat na server
        const komentar = {
            comment: comment.trim(),  // Odstranění mezer na začátku a na konci komentáře
            rating: rating || 0,      // Pokud rating není definován, nastaví se na 0
            uzivatel,
            hra
        };

        // Debug: Zobrazení odesílaných dat
        console.log('Sending komentar:', komentar);

        try {
            const response = await fetch('http://localhost:5000/Komentare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(komentar),
            });

            const data = await response.json();
            console.log('Server response:', data); // Debug: Výstup odpovědi serveru

            if (response.ok) {
                // Pokud je přihlášení úspěšné, zobrazíme zprávu o úspěchu
                setSuccessMessage(data.message);
                setError(''); // Vymažeme případnou předchozí chybovou zprávu
            } else {
                // Pokud dojde k chybě, nastavíme chybovou zprávu
                setError(data.error);
                setSuccessMessage(''); // Vymažeme případnou předchozí úspěšnou zprávu
            }
        } catch (error) {
            // Pokud nastane chyba při odesílání požadavku, nastavíme chybovou hlášku
            setError('Chyba při odesílání požadavku');
            setSuccessMessage(''); // Vymažeme případnou předchozí úspěšnou zprávu
        }
    };

    function Zrusit() {
        setComment('');
    }

    return (
        <>
            <div id="komentare">
                <form onSubmit={handleSubmit}>
                    <input
                        id='comment'
                        type="text"
                        placeholder='Poděl se s námi o své poznatky :)'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit">Okomentovat</button>
                    <button type="button" onClick={Zrusit}>Zrušit</button><br />
                    <Stack spacing={1}>
                        <Rating
                            name="half-rating"
                            value={rating}
                            precision={0.5}
                            onChange={(newRating) => setRating(newRating)}
                        />
                    </Stack>
                </form>
            </div>

            {/* Zobrazení chybové zprávy */}
            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

            {/* Zobrazení úspěšné zprávy */}
            {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}

            <div>Je admin: {isAdmin ? 'Ano' : 'Ne'}</div>
            <div>Je přihlášen: {isLoggedIn ? 'Ano' : 'Ne'} {uzivatel}</div>
        </>
    );
}
