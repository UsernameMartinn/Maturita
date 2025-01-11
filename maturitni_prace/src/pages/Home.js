import React from 'react';
import '../App.css';
import Login from './Login';

function Home(props) {
  return (
    <div>
      Home/Novinky
      {props.uzivatel}
    </div>
  )
}

export default Home
