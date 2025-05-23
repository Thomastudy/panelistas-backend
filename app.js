import express from "express";
import fs from "fs";
import path from "path";

const datosZodiaco = JSON.parse(
  fs.readFileSync(path.resolve("zodiac-boundaries.json"), "utf8")
);
const PORT = 8080;
const app = express();

// MIDDLEWARE
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola desde el back de panelistas.");
});

app.get("/search", (req, res) => {
  const datosZodiaco = JSON.parse(
    fs.readFileSync(path.resolve("zodiac-boundaries.json"), "utf8")
  );
  const code = req.query.code?.toLowerCase();

  if (!code) {
    return res.status(400).json({
      message: "No se recibieron datos",
    });
  }
  const info = datosZodiaco.find((f) => f.id === code);

  return res.status(200).send({
    data: info,
  });
});

/*//////////////////////////
  
Servidor

//////////////////////////*/
app.listen(PORT, () => {
  console.log(`Escuchando en el puerto: http://localhost:${PORT}`);
});
