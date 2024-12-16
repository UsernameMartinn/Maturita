import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Login from '../pages/Login';
import Signin from '../pages/Signin';
import Main from '../pages/Main';
import NoPage from '../pages/Nopage'
import Home from '../pages/Home';
import Obchod from '../pages/Obchod';
import Kosik from './Kosik';

function Menu() {
  return (
    <HashRouter basename='/'>
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/pages/Login" element={<Login />} />
        <Route path="/pages/Signin" element={<Signin />} />
        <Route path="/pages/Main" element={<Main />} />
        <Route path="/pages/Obchod" element={<Obchod />} />
        <Route path="/components/Kosik" element={<Kosik />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </HashRouter>
  );
}

export default Menu;
