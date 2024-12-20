import { useState } from "react";
import { useAuth } from "../context/useAuth"
import styles from "../styles/styles-loginpage.module.scss"
import bimboLogo from "/assets/bimboLogo.png"
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');  // Estado para email
  const [password, setPassword] = useState('');  // Estado para password
  const navigate = useNavigate();  // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({userName: email, contraseña: password});  // Iniciar sesión llamando a la función del contexto

      // Redirigir a /home si la autenticación es exitosa
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`row ${styles.loginContainer}`}>
      <div className={`col-12 col-md-6 ${styles.loginLeft}`}>
        <img src={bimboLogo} alt="Grupo Bimbo" className={`img-fluid ${styles.logo}`} />
      </div>
      <div className={`col-12 col-md-6 ${styles.loginRight}`}>
        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus datos abajo</p>
        <form className={`${styles.loginForm}`} onSubmit={handleSubmit}>
          <div className={`${styles.inputGroup}`}>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="" required />
            <label htmlFor="email">E-mail</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" /></svg>
          </div>
          <div className={`${styles.inputGroup}`}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="" required />
            <label htmlFor="password">Contraseña</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 14v-2c0-1.1-.9-2-2-2V8c0-3.3-2.7-6-6-6S6 4.7 6 8v2c-1.1 0-2 .9-2 2v2l-1 8h18l-1-8zm-8 5c-.8 0-1.5-.7-1.5-1.5S11.2 16 12 16s1.5.7 1.5 1.5S12.8 19 12 19zm3-5H9v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3z" /></svg>
          </div>
          <button type="submit" className={`${styles.loginButton}`} disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
