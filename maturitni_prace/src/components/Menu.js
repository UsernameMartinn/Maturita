import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Login from '../pages/Login';
import Signin from '../pages/Signin';
import Main from '../pages/Main';
import NoPage from '../pages/Nopage'
import Home from '../pages/Home';
import Obchod from '../pages/Obchod'
import Kosik from '../pages/Kosik'
import Onas from '../pages/Onas'
import DetailHry from '../pages/DetailHry';
import Pokladna from '../pages/Pokladna';

function Menu() {
  return (
    <HashRouter basename='/'>
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/pages/Onas" element={<Onas />} />
        <Route path="/pages/Login" element={<Login />} />
        <Route path="/pages/Signin" element={<Signin />} />
        <Route path="/pages/Main" element={<Main />} />
        <Route path="/pages/Obchod" element={<Obchod />} />
        <Route path="/pages/Kosik" element={<Kosik />} />
        <Route path="/detail/:title" element={<DetailHry />} />
        <Route path="/pages/Pokladna" element={<Pokladna />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </HashRouter>
  );
}

export default Menu;