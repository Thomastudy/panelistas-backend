// src/components/localizar.js

/**
 * Devuelve { az, alt } en grados para la constelación indicada.
 * - coordenadas: array de { id, AR, Dec }
 * - code: abreviatura en minúsculas ('ari','tau',…)
 * - latDeg, lonDeg: posición del observador en grados
 * - dateISO: string ISO de la fecha/hora en UTC
 */
export function localizarConstelacion(coordenadas, code, latDeg, lonDeg, dateISO) {
  const date = new Date(dateISO);
  const year  = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day   = date.getUTCDate();
  const hourUTC = date.getUTCHours() + date.getUTCMinutes()/60 + date.getUTCSeconds()/3600;

  // 1) Buscamos la constelación
  const entry = coordenadas.find(c => c.id.toLowerCase() === code.toLowerCase());
  if (!entry) throw new Error(`Constelación '${code}' no encontrada`);

  // 2) Fecha Juliana (JD)
  const JD = getJulianDate(year, month, day, hourUTC);

  // 3) Tiempo Sideral Local en grados
  const LST_deg = getLSTdegrees(JD, lonDeg);

  // 4) Transformación ecuatorial→horizontal
  return equatorialToHorizontal(entry.AR, entry.Dec, latDeg, LST_deg);
}


// ———— Helpers (no toques estas funciones) ————

function deg2rad(deg) { return deg * Math.PI / 180; }
function rad2deg(rad) { return rad * 180 / Math.PI; }
function hoursToDegrees(h) { return h * 15; }

// Cálculo de fecha Juliana
function getJulianDate(y, m, d, hourUTC) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716))
       + Math.floor(30.6001 * (m + 1))
       + d + B - 1524.5 + hourUTC / 24;
}

// Cálculo de LST en grados
function getLSTdegrees(JD, lonDeg) {
  const D = JD - 2451545.0;
  let lst = 280.46061837 + 360.98564736629 * D + lonDeg;
  return ((lst % 360) + 360) % 360;
}

// Ecuatoriales (RA_h, Dec_deg) → Horizontales (az, alt)
function equatorialToHorizontal(RA_h, Dec_deg, Lat_deg, LST_deg) {
  const RA_deg = hoursToDegrees(RA_h);
  const HA_deg = (LST_deg - RA_deg + 360) % 360;
  const HA  = deg2rad(HA_deg);
  const Dec = deg2rad(Dec_deg);
  const Lat = deg2rad(Lat_deg);

  // alt
  const sinAlt = Math.sin(Dec)*Math.sin(Lat)
               + Math.cos(Dec)*Math.cos(Lat)*Math.cos(HA);
  const alt = rad2deg(Math.asin(sinAlt));

  // az
  const cosAz = (Math.sin(Dec) - Math.sin(deg2rad(alt))*Math.sin(Lat))
              / (Math.cos(deg2rad(alt))*Math.cos(Lat));
  const sinAz = -Math.cos(Dec)*Math.sin(HA)/Math.cos(deg2rad(alt));
  let az = rad2deg(Math.atan2(sinAz, cosAz));
  if (az < 0) az += 360;

  return { az, alt };
}
