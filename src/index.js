import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MyLayout from './MyLayout';
import reportWebVitals from './reportWebVitals';




ReactDOM.render(
  <React.StrictMode>
      <MyLayout>
        <App></App>
      </MyLayout>
      
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
