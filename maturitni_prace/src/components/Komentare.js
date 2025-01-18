import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';

export default function Komentare() {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0); // Inicializace na 0
    const [comments, setComments] = useState([]); // Stav pro komentáře
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [uzivatel, setUzivatel] = useState('');
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

    useEffect(() => {
        if (hra) {
            // Volání backendu pro načtení komentářů pro konkrétní hru
            fetch(`http://localhost:5000/nactiHry/${hra}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setComments(data);
                    }
                })
                .catch(error => setError('Chyba při načítání komentářů.'));
        }
    }, [hra]);  // Spustí se při změně hodnoty 'hra'

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Odeslání komentáře
        const komentar = {
            comment: comment.trim(),
            rating: rating || 0,
            uzivatel,
            hra
        };

        try {
            const response = await fetch('http://localhost:5000/Komentare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(komentar),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setError('');
                // Po úspěšném odeslání komentáře můžeme přidat komentář do seznamu
                setComments([...comments, {
                    review_text: comment,
                    rating: rating,
                    user_name: uzivatel,
                    created_at: new Date().toISOString(),  // Představíme si, že data budou přijít z backendu
                    likes: 0,
                    dislikes: 0,
                }]);
            } else {
                setError(data.error);
                setSuccessMessage('');
            }
        } catch (error) {
            setError('Chyba při odesílání požadavku');
            setSuccessMessage('');
        }
    };

    function Zrusit() {
        setComment('');
    }

    return (
        <div>
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
                            onChange={(event, newRating) => setRating(newRating)} // nová opravená verze
                        />

                    </Stack>
                </form>
            </div>

            {/* Zobrazení chybové zprávy */}
            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

            {/* Zobrazení úspěšné zprávy */}
            {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}

            <Typography variant="h4">
                RECENZE UŽIVATELŮ
            </Typography>

            {comments.length > 0 ? (
                comments.map((komentar, index) => (
                    <Paper variant="elevation" elevation={4} square={false} style={{ color: 'white', backgroundColor: 'rgb(85, 85, 85)', textAlign: "center", margin: 5, padding: 10 }}>
                        <Divider>
                            {komentar.user_name}, {komentar.created_at}
                        </Divider>
                        <Typography variant="h5">
                            <Rating value={komentar.rating} readOnly />
                            <p>{komentar.review_text}</p>
                        </Typography>
                    </Paper>
                ))
            ) : (
                <p>Žádné komentáře zatím nejsou.</p>
            )}
        </div>
    );
}
