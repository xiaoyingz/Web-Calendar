import axios from "axios";

class WeatherSerive {
    getWeather() {
        const web = axios.create({
            baseURL: 'https://api.openweathermap.org',
            headers: {
                "Content-type": "application/json"
            }
        });
        // const apiKey = process.env.API_KEY;
        const apiKey = 'c809dbb3b01acc661355896a25796dd1';
        return web.get(`/data/2.5/weather?q=Champaign,61820&appid=${apiKey}`);
    }
}

export default new WeatherSerive();