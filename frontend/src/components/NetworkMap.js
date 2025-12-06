import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'; // Am scos Popup ca sa nu ne incurce, afisam detaliile in dreapta jos
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix iconițe
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const REAL_AIRPORTS_DB = [
  // ROMANIA (extinsă cu mai multe aeroporturi mici)
  { iata: 'OTP', name: 'Bucharest Otopeni', lat: 44.5707, lng: 26.0844 },
  { iata: 'BBU', name: 'Bucharest Baneasa', lat: 44.5032, lng: 26.1020 },
  { iata: 'CLJ', name: 'Cluj-Napoca', lat: 46.7852, lng: 23.6862 },
  { iata: 'TSR', name: 'Timisoara', lat: 45.8102, lng: 21.3365 },
  { iata: 'IAS', name: 'Iasi', lat: 47.1785, lng: 27.6206 },
  { iata: 'SBZ', name: 'Sibiu', lat: 45.7871, lng: 24.0913 },
  { iata: 'SCV', name: 'Suceava', lat: 47.6875, lng: 26.3541 },
  { iata: 'CND', name: 'Constanta', lat: 44.3622, lng: 28.4883 },
  { iata: 'CRA', name: 'Craiova', lat: 44.3181, lng: 23.8886 },
  { iata: 'BCM', name: 'Bacau', lat: 46.5219, lng: 26.9103 },
  { iata: 'OMR', name: 'Oradea', lat: 47.0253, lng: 21.9025 },
  { iata: 'TGM', name: 'Targu Mures', lat: 46.4678, lng: 24.4125 },
  { iata: 'BAY', name: 'Baia Mare', lat: 47.6584, lng: 23.4700 },
  { iata: 'ARW', name: 'Arad', lat: 46.1766, lng: 21.2620 },
  { iata: 'SUJ', name: 'Satu Mare', lat: 47.7033, lng: 22.8857 },

  // UK & IRELAND
  { iata: 'LHR', name: 'London Heathrow', lat: 51.4700, lng: -0.4543 },
  { iata: 'LGW', name: 'London Gatwick', lat: 51.1537, lng: -0.1821 },
  { iata: 'STN', name: 'London Stansted', lat: 51.8850, lng: 0.2350 },
  { iata: 'MAN', name: 'Manchester', lat: 53.3537, lng: -2.2749 },
  { iata: 'EDI', name: 'Edinburgh', lat: 55.9500, lng: -3.3725 },
  { iata: 'BFS', name: 'Belfast', lat: 54.6575, lng: -6.2158 },
  { iata: 'DUB', name: 'Dublin', lat: 53.4264, lng: -6.2499 },

  // FRANCE
  { iata: 'CDG', name: 'Paris Charles de Gaulle', lat: 49.0097, lng: 2.5479 },
  { iata: 'ORY', name: 'Paris Orly', lat: 48.7233, lng: 2.3594 },
  { iata: 'NCE', name: 'Nice', lat: 43.6653, lng: 7.2150 },
  { iata: 'MRS', name: 'Marseille', lat: 43.4393, lng: 5.2214 },
  { iata: 'LYS', name: 'Lyon', lat: 45.7256, lng: 5.0811 },
  { iata: 'TLS', name: 'Toulouse', lat: 43.6294, lng: 1.3678 },

  // GERMANY
  { iata: 'FRA', name: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
  { iata: 'MUC', name: 'Munich', lat: 48.3537, lng: 11.7750 },
  { iata: 'BER', name: 'Berlin Brandenburg', lat: 52.3667, lng: 13.5033 },
  { iata: 'DUS', name: 'Dusseldorf', lat: 51.2781, lng: 6.7650 },
  { iata: 'HAM', name: 'Hamburg', lat: 53.6304, lng: 9.9882 },
  { iata: 'CGN', name: 'Cologne Bonn', lat: 50.8658, lng: 7.1427 },

  // NETHERLANDS & BELGIUM
  { iata: 'AMS', name: 'Amsterdam Schiphol', lat: 52.3105, lng: 4.7683 },
  { iata: 'BRU', name: 'Brussels', lat: 50.9010, lng: 4.4856 },
  { iata: 'EIN', name: 'Eindhoven', lat: 51.4501, lng: 5.3745 },
  { iata: 'CRL', name: 'Charleroi', lat: 50.4592, lng: 4.4538 },

  // SPAIN & PORTUGAL
  { iata: 'MAD', name: 'Madrid Barajas', lat: 40.4839, lng: -3.5679 },
  { iata: 'BCN', name: 'Barcelona', lat: 41.2974, lng: 2.0833 },
  { iata: 'PMI', name: 'Palma de Mallorca', lat: 39.5517, lng: 2.7388 },
  { iata: 'AGP', name: 'Malaga', lat: 36.6749, lng: -4.4991 },
  { iata: 'LIS', name: 'Lisbon', lat: 38.7756, lng: -9.1354 },
  { iata: 'OPO', name: 'Porto', lat: 41.2379, lng: -8.6700 },

  // ITALY
  { iata: 'FCO', name: 'Rome Fiumicino', lat: 41.8003, lng: 12.2389 },
  { iata: 'MXP', name: 'Milan Malpensa', lat: 45.6301, lng: 8.7255 },
  { iata: 'LIN', name: 'Milan Linate', lat: 45.4451, lng: 9.2767 },
  { iata: 'VCE', name: 'Venice', lat: 45.5053, lng: 12.3519 },
  { iata: 'NAP', name: 'Naples', lat: 40.8860, lng: 14.2908 },
  { iata: 'CTA', name: 'Catania', lat: 37.4668, lng: 15.0664 },

  // SWITZERLAND & AUSTRIA
  { iata: 'ZRH', name: 'Zurich', lat: 47.4582, lng: 8.5555 },
  { iata: 'GVA', name: 'Geneva', lat: 46.2370, lng: 6.1091 },
  { iata: 'VIE', name: 'Vienna', lat: 48.1103, lng: 16.5697 },
  { iata: 'SZG', name: 'Salzburg', lat: 47.7933, lng: 13.0043 },

  // EASTERN EUROPE
  { iata: 'WAW', name: 'Warsaw Chopin', lat: 52.1672, lng: 20.9679 },
  { iata: 'KRK', name: 'Krakow', lat: 50.0777, lng: 19.7848 },
  { iata: 'PRG', name: 'Prague', lat: 50.1008, lng: 14.2600 },
  { iata: 'BUD', name: 'Budapest', lat: 47.4385, lng: 19.2523 },
  { iata: 'SOF', name: 'Sofia', lat: 42.6967, lng: 23.4114 },
  { iata: 'BEG', name: 'Belgrade', lat: 44.8184, lng: 20.3091 },
  { iata: 'ZAG', name: 'Zagreb', lat: 45.7429, lng: 16.0688 },
  { iata: 'KIV', name: 'Chisinau', lat: 46.9278, lng: 28.9308 },
  { iata: 'SKG', name: 'Thessaloniki', lat: 40.5197, lng: 22.9709 },

  // SCANDINAVIA
  { iata: 'CPH', name: 'Copenhagen', lat: 55.6180, lng: 12.6508 },
  { iata: 'ARN', name: 'Stockholm Arlanda', lat: 59.6498, lng: 17.9238 },
  { iata: 'OSL', name: 'Oslo', lat: 60.1976, lng: 11.1004 },
  { iata: 'HEL', name: 'Helsinki', lat: 60.3210, lng: 24.9529 },
  { iata: 'GOT', name: 'Gothenburg', lat: 57.6628, lng: 12.2798 },

  // TURKEY & GREECE
  { iata: 'IST', name: 'Istanbul', lat: 41.2753, lng: 28.7519 },
  { iata: 'SAW', name: 'Istanbul Sabiha Gokcen', lat: 40.8986, lng: 29.3092 },
  { iata: 'ATH', name: 'Athens', lat: 37.9364, lng: 23.9445 },
  { iata: 'HER', name: 'Heraklion', lat: 35.3397, lng: 25.1803 },

  // ALTE AEROPORTURI MICI DIN EUROPA PENTRU A EXTINDE LISTA
  { iata: 'LUX', name: 'Luxembourg', lat: 49.6289, lng: 6.2146 },
  { iata: 'MLA', name: 'Malta', lat: 35.8575, lng: 14.4775 },
  { iata: 'LCA', name: 'Larnaca', lat: 34.8722, lng: 33.6203 },
  { iata: 'TIA', name: 'Tirana', lat: 41.4147, lng: 19.7206 },
  { iata: 'SKP', name: 'Skopje', lat: 41.9616, lng: 21.6214 },
  { iata: 'POD', name: 'Podgorica', lat: 42.3594, lng: 19.2519 },
  { iata: 'SJJ', name: 'Sarajevo', lat: 43.8246, lng: 18.3315 },
  { iata: 'LJU', name: 'Ljubljana', lat: 46.2237, lng: 14.4576 },
  { iata: 'RIX', name: 'Riga', lat: 56.9236, lng: 23.9711 },
  { iata: 'VNO', name: 'Vilnius', lat: 54.6341, lng: 25.2858 },
  { iata: 'TLL', name: 'Tallinn', lat: 59.4133, lng: 24.8328 },
  { iata: 'IEV', name: 'Kyiv Zhuliany', lat: 50.4017, lng: 30.4497 },
  { iata: 'ODS', name: 'Odesa', lat: 46.4268, lng: 30.6765 },
  { iata: 'LWO', name: 'Lviv', lat: 49.8125, lng: 23.9561 },
  { iata: 'MSQ', name: 'Minsk', lat: 53.8825, lng: 28.0307 },
];

const HUB_COORDS = { lat: 44.5707, lng: 26.0844, name: 'Main HUB (OTP)' };

// PROPS: Primim funcția onAirportSelect de la părinte
const NetworkMap = ({ onAirportSelect }) => {
  const [airports, setAirports] = useState([]);
  const [hub, setHub] = useState(null);

  useEffect(() => {
    Papa.parse('/airports.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
      }
    });
  }, []);

  const processData = (data) => {
    const hubCsv = data.find(row => row.code === 'HUB1');
    const finalHub = hubCsv 
      ? { ...hubCsv, ...HUB_COORDS } 
      : { code: 'HUB1', ...HUB_COORDS, first_processing_cost: 0 };
    setHub(finalHub);

    const spokes = data.filter(row => row.code !== 'HUB1');
    const mappedSpokes = spokes.map((item, index) => {
      const realLocation = REAL_AIRPORTS_DB[index % REAL_AIRPORTS_DB.length];
      return {
        ...item,
        lat: realLocation.lat,
        lng: realLocation.lng,
        displayLocation: realLocation.name,
        displayCode: realLocation.iata
      };
    });
    setAirports(mappedSpokes);
  };

  if (!hub) return <div style={{textAlign:'center', padding:'20px'}}>Loading Map...</div>;

  return (
      <MapContainer center={[48, 15]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* HUB MARKER */}
        <Marker 
          position={[hub.lat, hub.lng]}
          eventHandlers={{
            click: () => onAirportSelect(hub), // Trimitem datele hub-ului
          }}
        />

        {/* SPOKES MARKERS */}
        {airports.map((ap, idx) => (
          <React.Fragment key={idx}>
            <Polyline 
              positions={[[hub.lat, hub.lng], [ap.lat, ap.lng]]}
              pathOptions={{ color: '#3b82f6', weight: 1, opacity: 0.3 }} 
            />
            <Marker 
              position={[ap.lat, ap.lng]}
              eventHandlers={{
                click: () => onAirportSelect(ap), // Când dai click, trimitem datele aeroportului în App.js
              }}
            >
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
  );
};

export default NetworkMap;