import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { API_BASE_URL } from "../utils/shared.js";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert(t('login.fillFields'));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al iniciar sesión");
        return;
      }

      if (data.user) {
        login(data.user, data.token);
        setUsername("");
        setPassword("");
        setSuccess("Login exitoso");
        setTimeout(() => {
          setSuccess("");
          const redirect = searchParams.get("redirect") || "/";
          navigate(redirect);
        }, 1400);
      }

    } catch (err) {
      alert(t('login.error'));
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="logo">
          Pelis<span>Online</span>
        </div>

        <h2>{t('login.title')}</h2>

        {success && (
          <div style={{ color: '#00aa00', marginBottom: '1rem' }}>{success}</div>
        )}

        <label htmlFor="username">{t('login.username')}:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">{t('login.password')}:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">{t('login.submit')}</button>

        <p className="register-text">
          {t('login.noAccount')}{" "}
          <Link to="/register" className="register-link">
            {t('login.createAccount')}
          </Link>
        </p>
      </form>
    </div>
  );
}
