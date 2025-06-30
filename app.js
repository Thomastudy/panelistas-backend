import http from "http";
import express from "express";
import { Server as IOServer } from "socket.io";

import { localizarConstelacion } from "./src/components/localizar.js";

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(express.json());

const io = new IOServer(server, {
  cors: { origin: "*" }, // o pon el dominio de tu front
});

io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);
});

app.get("/", (req, res) => {
  res.send("Hola desde el back de panelistas.");
});

////////////////////////////////////
////    Datos     //////////////////
////////////////////////////////////

// ←────────  1.  Posición fija  ────────→
const LAT_FIJA = -34.56; // latitud de UCU Punta del Este
const LON_FIJA = -54.56; // longitud de UCU Punta del Este

const coordenadas = [
  { id: "Aqr", AR: 22.45, Dec: -13.08 },
  { id: "Ari", AR: 2.37, Dec: 23.55 },
  { id: "Cnc", AR: 8.69, Dec: 19.51 },
  { id: "Cap", AR: 21.11, Dec: -17.96 },
  { id: "Gem", AR: 6.92, Dec: 26.17 },
  { id: "Leo", AR: 10.66, Dec: 18.95 },
  { id: "Lib", AR: 15.33, Dec: -16.4 },
  { id: "Oph", AR: 17.58, Dec: -5.72 },
  { id: "Psc", AR: 0.76, Dec: 10.35 },
  { id: "Sgr", AR: 18.96, Dec: -29.36 },
  { id: "Sco", AR: 16.79, Dec: -31.96 },
  { id: "Tau", AR: 4.47, Dec: 17.99 },
  // { id: "Lun", AR: 18.96, Dec: -29.36 },
  // { id: "Sun", AR: 16.79, Dec: -31.96 },
  // { id: "Mar", AR: 4.47, Dec: 17.99 },

];

///////////////////////////////////

app.get("/search", (req, res) => {
  const code = (req.query.code || "").toLowerCase();

  // 1) Hora exacta en ISO (UTC)
  const dateISO = new Date().toISOString();

  const pos = localizarConstelacion(
    coordenadas,
    code,
    LAT_FIJA,
    LON_FIJA,
    dateISO
  );
  io.emit("open-constellation", { name: code, position: pos });
  return res.status(200).send({ ...pos });
});

/*//////////////////////////

Servidor

//////////////////////////*/
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
