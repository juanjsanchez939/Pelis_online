import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from 'axios'
import { API_BASE_URL } from "../utils/shared.js";

export default function Register() {
  const [ username, setUsername] = useState("")
  const [ email, setEmail] = useState("")
  const [ password, setPassword] = useState("")
  const [ confirmPassword, setConfirmPassword] = useState("")
  const [ error, setError] = useState("")
  const [ success, setSuccess] = useState("")
  const [ usernameAvailable, setUsernameAvailable] = useState(null)
  const [ checkingUser, setCheckingUser] = useState(false)

  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingUser(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/check-username?username=${username}`);
        setUsernameAvailable(res.data.available);
      } catch {
        setUsernameAvailable(null);
      }
      setCheckingUser(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (usernameAvailable === false) {
      setError("El nombre de usuario no está disponible")
      return
    }

    axios.post(`${API_BASE_URL}/register`, {username, email, password})
      .then(() => {
        setSuccess("Usuario registrado correctamente. Redirigiendo...")
        setUsername("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || "Error al registrar"
        setError(errorMsg)
      })
  }

  const passOk = password.length >= 8;
  const passMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo">
          Pelis<span>Online</span>
        </div>

        <h2>Crear Cuenta</h2>

        {error && <div style={{color: '#e50914', marginBottom: '1rem'}}>{error}</div>}
        {success && <div style={{color: '#00aa00', marginBottom: '1rem'}}>{success}</div>}

        <label htmlFor="username">Usuario:</label>
        <div className="input-with-icon">
          <input
            type="text"
            id="username"
            placeholder="Ejemplo123"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className={`input-icon ${checkingUser ? "checking" : username.length < 3 ? "" : usernameAvailable ? "available" : "taken"}`}>
            {checkingUser ? "⏳" : username.length < 3 ? "" : usernameAvailable ? "✅" : "❌"}
          </span>
        </div>

        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          placeholder="correo@ejemplo.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña (mínimo 8 caracteres):</label>
        <div className="input-with-icon">
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={`input-icon ${password.length === 0 ? "" : passOk ? "available" : "taken"}`}>
            {password.length === 0 ? "" : passOk ? "✅" : "❌"}
          </span>
        </div>

        <label htmlFor="confirm-password">Confirmar contraseña:</label>
        <div className="input-with-icon">
          <input
            type="password"
            id="confirm-password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className={`input-icon ${confirmPassword.length === 0 ? "" : passMatch ? "available" : "taken"}`}>
            {confirmPassword.length === 0 ? "" : passMatch ? "✅" : "❌"}
          </span>
        </div>

        <button type="submit">Registrarse</button>

        <p className="register-text">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="register-link">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
