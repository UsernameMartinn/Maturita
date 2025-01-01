import { Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import '../App.css';
import PrihlasovaciMenu from './Prihlasovani';

const Navigation = () => {
    return (
        <>
           <div id='menu' style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <nav>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#">Home</Button>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#pages/Onas">O nás</Button>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#pages/Obchod">Obchod</Button>
                    <Button style={{ backgroundColor: 'rgb(96, 7, 145)', color: "white", margin: 5 }} variant="contained" href="/maturitni_prace/#pages/Kosik">Košík</Button>
                </nav>
                <PrihlasovaciMenu />
            </div>
            <Outlet />
        </>
    )
}

export default Navigation;