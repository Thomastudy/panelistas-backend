from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

import math
from datetime import datetime, timezone

coordenadas = [
    {"id": "Aqr", "AR": 22.45, "Dec": -13.08},
    {"id": "Ari", "AR": 2.37,  "Dec": 23.55},
    {"id": "Cnc", "AR": 8.69,  "Dec": 19.51},
    {"id": "Cap", "AR": 21.11, "Dec": -17.96},
    {"id": "Gem", "AR": 6.92,  "Dec": 26.17},
    {"id": "Leo", "AR": 10.66, "Dec": 18.95},
    {"id": "Lib", "AR": 15.33, "Dec": -16.40},
    {"id": "Oph", "AR": 17.58, "Dec": -5.72},
    {"id": "Psc", "AR": 0.76,  "Dec": 10.35},
    {"id": "Sgr", "AR": 18.96, "Dec": -29.36},
    {"id": "Sco", "AR": 16.79, "Dec": -31.96},
    {"id": "Tau", "AR": 4.47,  "Dec": 17.99}
]

def ra_dec_to_alt_az(ra_hours, dec_deg, lat_deg, lon_deg, dt_utc):
    ra_deg = ra_hours * 15
    dec_rad = math.radians(dec_deg)
    lat_rad = math.radians(lat_deg)

    def julian_date(dt):
        year = dt.year
        month = dt.month
        day = dt.day + dt.hour / 24 + dt.minute / 1440 + dt.second / 86400

        if month <= 2:
            year -= 1
            month += 12

        A = math.floor(year / 100)
        B = 2 - A + math.floor(A / 4)
        jd = math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day + B - 1524.5
        return jd

    jd = julian_date(dt_utc)
    d = jd - 2451545.0 

    gmst = 280.46061837 + 360.98564736629 * d
    gmst = gmst % 360

    lst = (gmst + lon_deg) % 360

    ha = (lst - ra_deg) % 360
    if ha > 180:
        ha -= 360 
    ha_rad = math.radians(ha)

    sin_alt = math.sin(dec_rad) * math.sin(lat_rad) + math.cos(dec_rad) * math.cos(lat_rad) * math.cos(ha_rad)
    alt_rad = math.asin(sin_alt)

    cos_az = (math.sin(dec_rad) - math.sin(alt_rad) * math.sin(lat_rad)) / (math.cos(alt_rad) * math.cos(lat_rad))
    sin_az = -math.cos(dec_rad) * math.sin(ha_rad) / math.cos(alt_rad)
    az_rad = math.atan2(sin_az, cos_az)

    alt_deg = math.degrees(alt_rad)
    az_deg = (math.degrees(az_rad) + 360) % 360

    return round(alt_deg, 2), round(az_deg, 2)


@app.route('/convert', methods=['POST'])
def convert_coords():
    try:
        data = request.get_json()
        now = datetime.now()

        const = str(data['const'])

        for i in range(len(coordenadas)):
            print(i)
            if coordenadas[i]['id'] == const:
                print('sshfskdh')
                print(coordenadas[i]['AR'], coordenadas[i]['Dec'])
                ra_hours = coordenadas[i]['AR']
                dec_deg = coordenadas[i]['Dec']
        
        lon = -54.950
        lat = -34.967 
        now_utc = datetime.now(timezone.utc)

        alt, az = ra_dec_to_alt_az(ra_hours, dec_deg, lat, lon, now_utc)

        return jsonify({
            'altitude_degrees': round(alt, 2),
            'azimuth_degrees': round(az, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
