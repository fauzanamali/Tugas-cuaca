import { useState } from "react";
import axios from "./api/axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  const searchLocation = async (event) => {
    if (event.key === "Enter" && location !== "") {
      fetchWeather(`/weather?q=${location}`);
    }
  };

  const fetchWeather = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}&units=metric&appid=${API_KEY}`
      );
      setData(response.data);
    } catch {
      alert("Kota tidak ditemukan!");
    } finally {
      setLoading(false);
      setLocation("");
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`/weather?lat=${latitude}&lon=${longitude}`);
    });
  };

  // 🎨 SOFT BLUE BACKGROUND
  const getBg = () => {
    if (!data.main) return "from-sky-200 via-blue-200 to-indigo-200";

    const t = data.main.temp;
    if (t >= 30) return "from-blue-300 via-sky-300 to-indigo-300";
    if (t >= 20) return "from-sky-200 via-blue-200 to-indigo-200";
    return "from-slate-300 via-blue-200 to-indigo-300";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getBg()} text-slate-800 flex flex-col items-center px-4 py-16 transition-all duration-700`}>

      {/* Title */}
      <h1 className="text-xl text-slate-500 mb-8 tracking-wide">
        Weather App
      </h1>

      {/* SEARCH */}
      <div className="w-full max-w-md relative flex gap-2">

        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            🔍
          </span>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={searchLocation}
            placeholder="Cari kota..."
            className="w-full pl-10 pr-10 py-3 rounded-xl 
            bg-white/40 border border-white/50 
            backdrop-blur-md outline-none 
            text-slate-800 placeholder:text-slate-500
            focus:ring-2 focus:ring-blue-300/50 
            transition"
          />

          {location && (
            <button
              onClick={() => setLocation("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
          )}
        </div>

        {/* 📍 Location Button */}
        <button
          onClick={getCurrentLocation}
          className="px-4 rounded-xl bg-white/40 border border-white/50 backdrop-blur-md hover:bg-white/60 transition"
        >
          📍
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-8 animate-pulse text-slate-500">
          Loading...
        </p>
      )}

      {/* WEATHER */}
      {data.name && !loading && (
        <div className="mt-12 w-full max-w-md text-center">

          <p className="text-slate-500 text-sm">
            {data.sys?.country}
          </p>

          <h1 className="text-3xl font-semibold text-slate-800">
            {data.name}
          </h1>

          {/* ICON */}
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt="weather"
            className="mx-auto w-32"
          />

          {/* TEMP */}
          <h2 className="text-7xl font-light -mt-4 text-slate-800">
            {data.main?.temp.toFixed()}°
          </h2>

          <p className="text-slate-500 capitalize">
            {data.weather[0].description}
          </p>

          {/* CARD */}
          <div className="mt-8 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6">

            <div className="grid grid-cols-2 gap-6 text-center">

              <div>
                <p className="text-slate-500 text-xs">Humidity</p>
                <p className="text-lg font-medium mt-1">
                  {data.main?.humidity}%
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-xs">Wind</p>
                <p className="text-lg font-medium mt-1">
                  {data.wind?.speed} m/s
                </p>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default App;