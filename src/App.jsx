
import { useState } from "react";
import Login from "./pages/login/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { SimulacionProvider } from "./context/SimulacionContext.jsx";

function App() {
  // La sesión permanece en memoria.
  const [usuario, setUsuario] = useState(null);

  return (
    <SimulacionProvider>
      {usuario ? (
        <Dashboard
          usuario={usuario}
          onLogout={() => setUsuario(null)}
        />
      ) : (
        <Login onLogin={setUsuario} />
      )}
    </SimulacionProvider>
  );
}

export default App;
