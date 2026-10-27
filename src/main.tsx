import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Styles: Bootstrap 5, Design System Tokens, Custom Main, and Animations
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/design-tokens.css';
import './styles/main.css';
import './styles/walls.css';
import './styles/animations.css';
import './styles/thread-loader.css';

import { CartProvider } from './context/CartContext.tsx';
import { SavedProvider } from './context/SavedContext.tsx';
import { App } from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <SavedProvider>
          <App />
        </SavedProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
