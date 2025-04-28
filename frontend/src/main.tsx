import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElem = document.getElementById('root');
if (rootElem) {
  ReactDOM.createRoot(rootElem).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
