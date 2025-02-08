import React, { useState, useEffect } from 'react';
import '../App.css';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { Typography } from "@mui/material";
import emailjs from 'emailjs-com';

function Pokladna() {
    const [kosik, nastavKosik] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [uzivatel, setUzivatel] = useState('');
    const [hra, setHra] = useState('');
    const [mail, setMail] = useState('')
    const [message, setMessage] = useState([])

    useEffect(() => {
        const kosik = JSON.parse(localStorage.getItem('kosik'));
        if (kosik) {
            nastavKosik(kosik);
        }
    }, []);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';  // Načteme hodnoty z localStorage
        const admin = localStorage.getItem('isAdmin') === 'true';
        const uzivatel = localStorage.getItem('uzivatel');
        const hra = localStorage.getItem('hra');
        const mail = localStorage.getItem('mail')

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setUzivatel(uzivatel);
        setHra(hra);
        setMail(mail);
    }, []);

    useEffect(() => {
        const messageText = kosik.map((polozka) => (
            `${polozka.mnozstvi}x ${polozka.title} - ${Math.floor((polozka.celkovaCena * 100) / 100) * 27} KČ / ${Math.floor(polozka.celkovaCena * 100) / 100} USD`
        )).join('\n');
    
        setMessage(messageText);
    }, [kosik]);

    const templateParams = {
        user_name: uzivatel,
        user_mail: mail,
        message: message
    };

    function zakoupeno() {
        emailjs.send(
            'service_kho779i',
            'template_ig1gmye',
            templateParams,
            'dY_E7pWI5rfzNT06_'
        )
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });

        localStorage.setItem('kosik', JSON.stringify(kosik));
    }

    return (
        <>
            <Paper variant="elevation" elevation={4} square={false} className="pokladna-container">
                <Typography variant="h4" gutterBottom>
                    Pokladna
                </Typography>
                <Typography variant="h5">
                    {kosik && kosik.length > 0 ? (
                        kosik.map((polozka, index) => (
                            <li key={index}>
                                <p>{polozka.mnozstvi}x {polozka.title} - {Math.floor((polozka.celkovaCena * 100) / 100) * 27} KČ / ${Math.floor((polozka.celkovaCena * 100) / 100)} USD </p>
                            </li>
                        ))
                    ) : (
                        <p>Košík je prázdný.</p>
                    )}
                </Typography>

                <form className="pokladna-form">
                    <label for='cisloKarty'>Číslo karty</label>
                    <input type='number' placeholder='XXXX-XXXX-XXXX-XXXX'></input>

                    <label for='datumExpirace'>Datum expirace</label>
                    <input type='date' placeholder='XX-XX'></input>

                    <label for='cvv'>CVV</label>
                    <input type='number' placeholder='XXX'></input>

                    <Divider className="pokladna-divider" />

                    <button type="submit" onClick={() => zakoupeno()} className="pokladna-submit-btn">Zaplatit</button>
                </form>
            </Paper>
        </>
    );
}

export default Pokladna;
