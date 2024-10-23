// Importaciones de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// index.js o App.js
import '@fontsource/urbanist'; // Estilo normal 400
import '@fontsource/urbanist/700.css'; // Estilo bold 700


import AppRouter from "./router/AppRouter"

function App() {
  return (
    <AppRouter />
  );
}

export default App;
