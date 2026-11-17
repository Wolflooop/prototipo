// MODO DEMO — sustituir por POST /auth/login (FastAPI + PostgreSQL) cuando se apruebe la autenticación real.
// Las contraseñas NO están en texto plano: solo se guarda su hash SHA-256 con sal.
// Esta validación ocurre en el navegador, por lo que NO es un control de seguridad real.
const USUARIOS_DEMO = [
  { email: "admin@ejemplo.com", nombre: "Administrador", rol: "Admin", salt: "hv-admin-7f3a", hash: "fbe9424f6689505b31a72fbecba02fe77756ffa303efcf0e70d1c9e348a879df" },
  { email: "analista@ejemplo.com", nombre: "Analista", rol: "Analista", salt: "hv-anl-2c91", hash: "7e057765c72c97e453b1823dd1d244240623ec3cb80966bdbdfdec671317332a" },
  { email: "operador1@ejemplo.com", nombre: "Operador", rol: "Operador", salt: "hv-ope-b54e", hash: "a40f84fe35597df64aa022c292231ec79567d45255ae56504a38de881330a043" },
];

async function sha256(texto) {
  const datos = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(resumen)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Devuelve { nombre, email, rol } o null. Mismo resultado para correo inexistente y contraseña errónea.
export async function autenticar(email, password) {
  const correo = email.trim().toLowerCase();
  const usuario = USUARIOS_DEMO.find((u) => u.email === correo);
  const hash = await sha256(`${usuario ? usuario.salt : "hv-sin-usuario"}:${password}`);
  if (!usuario || hash !== usuario.hash) return null;
  return { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
}
