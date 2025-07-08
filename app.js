import http from "http";
import express from "express";
import { Server as IOServer } from "socket.io";

import { localizarConstelacion } from "./src/components/localizar.js";
import { log } from "console";

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
  { id: "Aqr", AR: 22.27, Dec: -13.04 },
  { id: "Ari", AR: 2.22, Dec: 23.33 },
  { id: "Cnc", AR: 8.41, Dec: 19.3 },
  { id: "Cap", AR: 21.06, Dec: -17.57 },
  { id: "Gem", AR: 6.55, Dec: 26.09 },
  { id: "Leo", AR: 10.39, Dec: 18.57 },
  { id: "Lib", AR: 15.2, Dec: -16.24 },
  { id: "Psc", AR: 0.45, Dec: 10.21 },
  { id: "Sgr", AR: 18.57, Dec: -29.21 },
  { id: "Sco", AR: 16.47, Dec: -31.57 },
  { id: "Tau", AR: 4.28, Dec: 17.59 },
];

///////////////////////////////////

app.get("/search", (req, res) => {
  const code = (req.query.code || "").toLowerCase();
  if (code !== "desc") {
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
  } else {
    console.log("descripcion del proyecto");
    io.emit("open-constellation", { name: code });
    return res.status(200).send("todo excelente por aca");
  }
});

/*//////////////////////////

Servidor

//////////////////////////*/
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
