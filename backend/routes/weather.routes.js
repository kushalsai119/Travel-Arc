import express from "express";

const router = express.Router();

// Coordinates mapping for TravelArc destinations
const CITY_COORDINATES = {
    goa: { lat: 15.2993, lon: 74.124, name: "Goa" },
    kashmir: { lat: 34.0837, lon: 74.7973, name: "Kashmir (Srinagar)" },
    kerala: { lat: 9.9312, lon: 76.2673, name: "Kerala (Kochi)" },
    rajasthan: { lat: 26.9124, lon: 75.7873, name: "Rajasthan (Jaipur)" },
    "himachal pradesh": { lat: 31.1048, lon: 77.1734, name: "Himachal Pradesh (Shimla)" },
    himachal: { lat: 31.1048, lon: 77.1734, name: "Himachal Pradesh" },
    varanasi: { lat: 25.3176, lon: 82.9739, name: "Varanasi" },
    meghalaya: { lat: 25.5788, lon: 91.8933, name: "Meghalaya (Shillong)" },
    ladakh: { lat: 34.1526, lon: 77.5771, name: "Ladakh (Leh)" }
};

// Weather code description interpreter (WMO standards)
const getWeatherDesc = (code) => {
    if (code === 0) return "Clear Sky ☀️";
    if (code <= 3) return "Partly Cloudy ⛅";
    if (code <= 48) return "Foggy 🌫️";
    if (code <= 67) return "Rainy 🌧️";
    if (code <= 77) return "Snow Flurries ❄️";
    if (code <= 99) return "Thunderstorm ⛈️";
    return "Pleasant 🌤️";
};

router.get("/", async (req, res) => {
    try {
        const queryCity = (req.query.destination || req.query.city || "Goa").toLowerCase().trim();
        const cityData = CITY_COORDINATES[queryCity] || CITY_COORDINATES["goa"];

        // Call Open-Meteo free API (no API key required, reliable worldwide)
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`External API responded with status ${response.status}`);
        }

        const data = await response.json();
        const current = data.current;

        return res.status(200).json({
            destination: cityData.name,
            coordinates: { latitude: cityData.lat, longitude: cityData.lon },
            currentWeather: {
                temperature: `${current.temperature_2m}°C`,
                condition: getWeatherDesc(current.weather_code),
                humidity: `${current.relative_humidity_2m}%`,
                windSpeed: `${current.wind_speed_10m} km/h`
            },
            source: "Open-Meteo Global Meteorological API (Live External API)"
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to fetch live weather data",
            details: error.message
        });
    }
});

export default router;
