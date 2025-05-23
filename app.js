import express from "express";
// import datosZodiaco from "./zodiac-boundaries.json" assert { type: "json" };

const PORT = 8080;
const app = express();

// MIDDLEWARE
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola desde el back de panelistas.");
});

app.get("/seacrh", (req, res) => {
  try {
    const constelacion = req.body;

    const info = datosZodiaco.features.find((f) => f.id === constelacion);
    if (!constelacion || !info) {
      return res.status(400).json({
        message: "No se recibieron datos",
      });
    }
  } catch (error) {}
});

/*//////////////////////////
  
Servidor

//////////////////////////*/
app.listen(PORT, () => {
  console.log(`Escuchando en el puerto: http://localhost:${PORT}`);
});
