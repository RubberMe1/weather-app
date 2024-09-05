const apiKeyWeather = '701200a0189a0baaf41b1751cea3395e';
const apiKeyUnsplash = 'tGoEKHZXi99mb1B_4n953N617BULpFB70Cy8Qq3Vtbc';

// Example famous cities for some states
const famousCities = {
    'US': {
        'California': ['Los Angeles', 'San Francisco', 'San Diego'],
        'New York': ['New York City', 'Buffalo'],
        'Florida': ['Miami', 'Orlando', 'Tampa'],
        'Texas': ['Austin', 'Dallas', 'Houston']
        // Add more states and their famous cities as needed
    }
    // Add other countries and their famous cities
};

document.getElementById("getWeather").addEventListener("click", function() {
    const city = document.getElementById("city").value;
    const apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;

    fetch(apiUrlWeather)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById("weatherResult").style.display = "block";
                document.getElementById("weatherResult").innerHTML = `<p>City not found. Please try again.</p>`;
            } else {
                const state = data.sys.country;  // Fetching the state/country
                const weather = `
                    <h2>${data.name}, ${state}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                document.getElementById("weatherResult").innerHTML = weather;
                document.getElementById("weatherResult").style.display = "block";

                // Determine famous cities for the state if available
                const stateFamousCities = famousCities['US'][state] || [];
                let query;

                if (stateFamousCities.length > 0 && !stateFamousCities.includes(city)) {
                    // If city is not a famous one, choose one of the famous cities from the state
                    query = stateFamousCities[Math.floor(Math.random() * stateFamousCities.length)];
                } else {
                    // If the city is a famous one or no famous cities are listed, use the city
                    query = city;
                }

                // Fetch an image from Unsplash based on the famous city or state
                const apiUrlUnsplash = `https://api.unsplash.com/photos/random?query=${query}&client_id=${apiKeyUnsplash}`;

                fetch(apiUrlUnsplash)
                    .then(response => response.json())
                    .then(imageData => {
                        document.body.style.backgroundImage = `url(${imageData.urls.full})`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                    })
                    .catch(err => {
                        console.error('Error fetching image from Unsplash:', err);
                    });
            }
        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML = `<p>Error fetching weather data</p>`;
            document.getElementById("weatherResult").style.display = "block";
        });
});
