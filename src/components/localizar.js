// components/localizar.js ----------------------------------------------------
import { julian, sidereal } from "astronomia";

/**
 * Calcula Altitud y Azimut para la constelación «code3».
 *
 * @param {Array<{id:string, AR:number, Dec:number}>} lista
 * @param {string} code3                // p. ej. "ari"
 * @param {number} latDeg  Observador   // latitud  (°)
 * @param {number} lonDeg  Observador   // longitud (°  Este +, Oeste –)
 * @param {string} dateISO = now()      // ISO-8601 UTC
 * @returns {{id:string, altitude:number, azimuth:number}}
 */
export function localizarConstelacion(
  lista,
  code3,
  latDeg,
  lonDeg,
  dateISO = new Date().toISOString()
) {
  // ── 1. buscar la constelación en la lista
  const item = lista.find((c) => c.id.toLowerCase() === code3.toLowerCase());
  if (!item) throw new Error(`Constelación «${code3}» no encontrada`);

  // ── 2. pasar todo a radianes
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180; // Oeste negativo
  const ra = (item.AR * 15 * Math.PI) / 180; // h → ° → rad
  const dec = (item.Dec * Math.PI) / 180;

  // ── 3. calcular JD y hora sideral (GMST) --------------------
  const d = new Date(dateISO);
  const jd = julian.CalendarGregorianToJD(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate() + (d.getUTCHours() + d.getUTCMinutes() / 60) / 24
  );
  // gmst en horas → rad
  const gmst = sidereal.mean(jd);

  // ── 4. Hora sideral local (LST) y Ángulo horario H
  let lst = gmst + lon; // rad
  lst = (lst + 2 * Math.PI) % (2 * Math.PI); // normaliza 0…2π
  let H = lst - ra; // rad
  H = ((H + Math.PI) % (2 * Math.PI)) - Math.PI; // –π…π

  // ── 5. Fórmulas horizontales
  const sinAlt =
    Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H);
  const alt = Math.asin(sinAlt);

  const cosAz =
    (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) /
    (Math.cos(alt) * Math.cos(lat));
  // prote-rango por redondeo numérico
  const clamped = Math.min(1, Math.max(-1, cosAz));
  let az = Math.acos(clamped); // 0…π
  if (Math.sin(H) > 0) az = 2 * Math.PI - az; // 0…2π, medido desde el Norte

  return {
    id: item.id.toLowerCase(),
    az: (az * 180) / Math.PI,
    alt: (alt * 180) / Math.PI,
  };
}
