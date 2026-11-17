import { useState } from "react";
import { Eye, EyeOff, Zap } from "lucide-react";
import "./Login.css";
import { autenticar } from "../../auth/demoUsers.js";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const usuario = await autenticar(email, password);
      if (usuario) {
        onLogin(usuario);
      } else {
        setPassword("");
        setError("Correo o contraseña incorrectos.");
      }
    } catch {
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function handleForgotPassword() {
    setMessage(
      "La recuperación de contraseña estará disponible cuando conectemos la autenticación.",
    );
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-logo" aria-hidden="true">
          <Zap size={26} strokeWidth={1.8} />
        </div>

        <h1 id="login-title">Cyber-HydroVolt</h1>
        <p className="login-subtitle">
          Supervisión y ciberseguridad de central hidroeléctrica
        </p>

        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <label htmlFor="login-email">Correo institucional</label>
          <input
            id="login-email"
            className="login-input"
            type="email"
            autoComplete="username"
            placeholder="usuario@correo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Contraseña</label>
          <div className="login-password-wrapper">
            <input
              id="login-password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className="login-show-password"
              type="button"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            className="login-forgot"
            type="button"
            onClick={handleForgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button className="login-submit" type="submit" disabled={cargando}>
            {cargando ? "Verificando..." : "Iniciar sesión"}
          </button>

          {error && (
            <p className="login-notice" role="alert">{error}</p>
          )}

          {message && (
            <p className="login-notice" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="login-card-footer">
          Acceso protegido con JWT · control de roles
        </p>
      </section>
    </main>
  );
}

export default Login;