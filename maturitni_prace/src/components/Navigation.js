import { Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import '../App.css';

const Navigation = () => {
    return (
        <>
            <div id='menu'>
                <nav>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#">Home</Button>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#pages/Login">Vytvořit si účet</Button>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#pages/Signin">Přihlásit se</Button>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#pages/Main">Pokračovat nepřihlášený</Button>
                </nav>
            </div>
            <Outlet />
        </>
    )
}

export default Navigation;