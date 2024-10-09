import React from 'react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/src/assets/bimbologo.png" alt="Grupo Bimbo" className="logo" />
      </div>
      <div className="login-right">
        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus datos abajo</p>
        <form className="login-form">
          <div className="input-group">
            <input type="text" id="username" placeholder=" " required />
            <label htmlFor="username">Usuario</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
          </div>
          <div className="input-group">
            <input type="password" id="password" placeholder=" " required />
            <label htmlFor="password">Contraseña</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 14v-2c0-1.1-.9-2-2-2V8c0-3.3-2.7-6-6-6S6 4.7 6 8v2c-1.1 0-2 .9-2 2v2l-1 8h18l-1-8zm-8 5c-.8 0-1.5-.7-1.5-1.5S11.2 16 12 16s1.5.7 1.5 1.5S12.8 19 12 19zm3-5H9v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3z"/></svg>
          </div>
          <div className="input-group">
            <input type="email" id="email" placeholder=" " required />
            <label htmlFor="email">E-mail</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
        <div className="register-link">
          <p>No tengo una cuenta <a href="#">Regístrate</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
