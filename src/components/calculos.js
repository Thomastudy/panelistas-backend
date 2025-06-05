///////////////////////////////////
////    Calculos
///////////////////////////////////

// 1. Función para convertir RA/Dec a Alt/Az
function raDecToAltAz(raHours, decDeg, latDeg, lonDeg, dtUtc) {
  // Conversión a radianes/grados
  const raDeg = raHours * 15;
  const decRad = toRad(decDeg);
  const latRad = toRad(latDeg);

  // Cálculo del Julian Date
  function julianDate(dt) {
    let year = dt.getUTCFullYear();
    let month = dt.getUTCMonth() + 1; // JS: enero = 0
    let day =
      dt.getUTCDate() +
      dt.getUTCHours() / 24 +
      dt.getUTCMinutes() / 1440 +
      dt.getUTCSeconds() / 86400;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const jd =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5;
    return jd;
  }

  const jd = julianDate(dtUtc);
  const d = jd - 2451545.0; // días desde J2000.0

  // 2. GMST en grados
  let gmst = 280.46061837 + 360.98564736629 * d;
  gmst = ((gmst % 360) + 360) % 360;

  // 3. LST (Local Sidereal Time)
  const lst = (gmst + lonDeg) % 360;

  // 4. Hour Angle
  let ha = (lst - raDeg) % 360;
  if (ha > 180) ha -= 360; // rango [-180,180]
  const haRad = toRad(ha);

  // 5. Altitud
  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altRad = Math.asin(sinAlt);

  // 6. Azimut
  const cosAz =
    (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) /
    (Math.cos(altRad) * Math.cos(latRad));
  const sinAz = (-Math.cos(decRad) * Math.sin(haRad)) / Math.cos(altRad);
  let azRad = Math.atan2(sinAz, cosAz);

  // Normalizar a [0,360)
  let azDeg = (toDeg(azRad) + 360) % 360;
  let altDeg = toDeg(altRad);

  return { altitude: round(altDeg, 2), azimuth: round(azDeg, 2) };
}

// Helpers
function toRad(deg) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad) {
  return (rad * 180) / Math.PI;
}
function round(val, decimals) {
  const p = Math.pow(10, decimals || 0);
  return Math.round(val * p) / p;
}

// Funcion 