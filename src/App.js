import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; 

import SimpleMailerController from './components/SimpleMailerController';

function App() {
  return (
    <div className="App">
      <SimpleMailerController />
    </div>
  );
}

export default App;
