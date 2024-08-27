import Tool from "src/lib/tool";

const OPEN_WEATHER_API_KEY = "YOUR_API_KEY_HERE";
const OPEN_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export default Tool.create({
  name: "fetch_weather_by_zip",
  description:
    "Fetch the current weather conditions for a given zip code using an open weather API.",
  inputs: [
    {
      name: "zip_code",
      type: "string",
      description: "The zip code to fetch the weather for",
      required: true,
    },
  ],
  fn: async ({ zip_code }) => {
    const url = `${OPEN_WEATHER_API_URL}?zip=${zip_code}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      const { name, weather, main } = data;
      return {
        location: name,
        temperature: main.temp,
        description: weather[0].description,
        icon: `http://openweathermap.org/img/w/${weather[0].icon}.png`,
      };
    } else {
      console.error(data);
      return {
        error: `Failed to fetch weather for zip code ${zip_code}`,
        is_error: true,
      };
    }
  },
});
