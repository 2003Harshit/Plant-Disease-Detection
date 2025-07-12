    // Select elements
    const showDetails = document.querySelector(".showDetails");
    const fullAddress = document.querySelector(".fullAddress");
    const formattedAddress = document.querySelector('.formattedAddress');
    const weatherInfo = document.querySelector('.weatherInfo');
    const details = document.getElementById('details');
    const diseaseDetectionBtn = document.getElementById('diseaseDetectionBtn');
    const cropYieldBtn = document.getElementById('cropYieldBtn');
    const showRecommendedBtn = document.getElementById('showRecommended');
    const showNotRecommendedBtn = document.getElementById('showNotRecommended');

    // API endpoint and keys
    const locationIqApiUrl = "https://us1.locationiq.com/v1/reverse.php";
    const locationIqApiKey = "pk.95e582ec0bdf442a15106faed05e3af3";
    const weatherApiUrl = "https://api.open-meteo.com/v1/forecast"; // Open-Meteo API endpoint

    // Function to recommend crops based on weather data
   function recommendCrops(temperature, humidity, precipitation) {
    let recommendations = {
        recommended: new Set(), // Use Set to prevent duplicates
        notRecommended: new Set(),
        advice: ""
    };

    // Example logic
    if (temperature > 30) {
        recommendations.recommended.add("Corn");
        recommendations.recommended.add("Rice");
        recommendations.recommended.add("Sorghum");
        recommendations.notRecommended.add("Wheat");
        recommendations.notRecommended.add("Barley");
    } else if (temperature < 15) {
        recommendations.recommended.add("Wheat");
        recommendations.recommended.add("Barley");
        recommendations.recommended.add("Peas");
        recommendations.notRecommended.add("Corn");
        recommendations.notRecommended.add("Rice");
    }

    if (humidity > 80) {
        recommendations.recommended.add("Rice");
        recommendations.recommended.add("Sugarcane");
        recommendations.notRecommended.add("Potatoes");
        recommendations.notRecommended.add("Onions");
    }

    if (precipitation > 10) {
        recommendations.recommended.add("Rice");
        recommendations.recommended.add("Sugarcane");
        recommendations.notRecommended.add("Cotton");
        recommendations.notRecommended.add("Tomatoes");
    }

    if (precipitation === 0 && temperature > 25) {
        recommendations.advice = "It's very dry, you might want to wait for some rain before planting.";
    }

    // Convert Sets back to arrays
    recommendations.recommended = Array.from(recommendations.recommended);
    recommendations.notRecommended = Array.from(recommendations.notRecommended);

    return recommendations;
}


    // Function to display crop recommendations with images     
    function displayRecommendations(recommendations) {
        // Check if the recommendation list already exists and remove it if it does
        const existingRecommendationDiv = document.getElementById('cropLists');
        if (existingRecommendationDiv) {
            existingRecommendationDiv.innerHTML = ''; // Clear existing content
        }

        // Helper function to get the image source for each crop
        function getImageSrc(crop) {
            const cropImages = {
                "Corn": "/public/images/corn.jpg",
                "Rice": "/public/images/rice.jpg",
                "Sorghum": "/public/images/Sorghum.jpg",
                "Wheat": "/public/images/wheat.jpg",
                "Barley": "/public/images/Barley.jpg",
                "Peas": "path/to/peas_image.jpg",
                "Sugarcane": "/public/images/sugarcane.jpg",
                "Potatoes": "/public/images/potato.jpeg",
                "Onions": "/public/images/onion.jpg",
                "Cotton": "path/to/cotton_image.jpg",
                "Tomatoes": "path/to/tomatoes_image.jpg"    
            };
            return cropImages[crop] || "path/to/default_image.jpg"; // Default image if crop is not found
        }

        // Create the table rows with images
        const createTableRows = (crops) => {
            return crops.map(crop => 
                `<li>
                    <img src="${getImageSrc(crop)}" alt="${crop}" style="width:50px; height:50px; vertical-align: middle;"> ${crop}
                </li>`
            ).join('');
        };
        

        // Create a new div to hold the crop recommendations
        const recommendationDiv = document.createElement('div');
        recommendationDiv.id = 'cropLists';
        recommendationDiv.innerHTML = `
            <div id="recommendedCrops" style="display: none;">
                <h3>Recommended Crops</h3>
                <ul style="list-style-type: none; padding: 0;">${createTableRows(recommendations.recommended)}</ul>
            </div>
            <div id="notRecommendedCrops" style="display: none;">
                <h3>Not Recommended Crops</h3>
                <ul style="list-style-type: none; padding: 0;">${createTableRows(recommendations.notRecommended)}</ul>
            </div>
            ${recommendations.advice ? `<p style="margin-top: 20px;">${recommendations.advice}</p>` : ''}
        `;
        
        // Append the recommendations after the weather info
        details.appendChild(recommendationDiv);
    }

    const getUserCurrentAddress = async (latitude, longitude) => {
        let apiUrl = `${locationIqApiUrl}?key=${locationIqApiKey}&lat=${latitude}&lon=${longitude}&format=json`;
    
        try {
            console.log("Fetching address from LocationIQ API...");
            console.log("API URL:", apiUrl); // Log the URL for debugging
            const res = await fetch(apiUrl);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
            }
            const data = await res.json();
            console.log('LocationIQ Response:', data);
    
            const address = data.display_name || "Unknown address";
            const city = data.address.village || data.address.city || data.address.town || "Unknown city";
            const state = data.address.state || "Unknown state";
            const postcode = data.address.postcode || "Unknown postcode";
            const country = data.address.country || "Unknown country";
    
            fullAddress.textContent = `User address: ${city}, ${postcode}, ${state}, ${country}`;
            formattedAddress.textContent = `User full address: ${address}`;
            
            getWeatherData(latitude, longitude);
        } catch (error) {
            console.error("Error fetching address:", error.message);
            fullAddress.textContent = `Error fetching address: ${error.message}`;
        }
    };
    

    // API to get user addre

    // API to get weather data from Open-Meteo
// Modify the weather API parameters to get daily data
const getWeatherData = async (latitude, longitude) => {
    let weatherApiParams = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,relative_humidity_2m_min",
        timezone: "auto" // Automatically set the timezone
    });
    
    let weatherApiFullUrl = `${weatherApiUrl}?${weatherApiParams.toString()}`;

    try {
        const res = await fetch(weatherApiFullUrl);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const weatherData = await res.json();

        // Verify if 'daily' data exists in the response
        if (weatherData.daily) {
            const temperatureMax = weatherData.daily.temperature_2m_max[0];  // Maximum temperature for the day
            const temperatureMin = weatherData.daily.temperature_2m_min[0];  // Minimum temperature for the day
            const humidityMax = weatherData.daily.relative_humidity_2m_max[0]; // Maximum humidity for the day
            const humidityMin = weatherData.daily.relative_humidity_2m_min[0]; // Minimum humidity for the day
            const precipitation = weatherData.daily.precipitation_sum[0];  // Total precipitation for the day
            
            console.log(`Max Temperature: ${temperatureMax}°C, Min Temperature: ${temperatureMin}°C, Max Humidity: ${humidityMax}%, Min Humidity: ${humidityMin}%, Precipitation: ${precipitation} mm`);

            weatherInfo.textContent = `
                Today's Max temperature: ${temperatureMax}°C,
                Min temperature: ${temperatureMin}°C,
                Max humidity: ${humidityMax}%, 
                Min humidity: ${humidityMin}%, 
                Total precipitation: ${precipitation} mm (Daily)
            `;

            // Recommend crops based on weather data
            const recommendations = recommendCrops(temperatureMax, humidityMax, precipitation);
            displayRecommendations(recommendations);
            details.style.display = 'block'; // Show the details
        } else {
            weatherInfo.textContent = "Weather data not available.";
        }
    } catch (error) {
        console.log("Error fetching weather data:", error);
    }
};


    // Function to handle geolocation success
    const onGeoSuccess = (position) => {
        const { latitude, longitude } = position.coords;

        showDetails.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;

        // Fetch user's current address using latitude and longitude
        getUserCurrentAddress(latitude, longitude);
    };

    // Function to handle geolocation errors
    const onGeoError = (error) => {
        console.error('Geolocation Error:', error.message);
        showDetails.textContent = `Error getting location: ${error.message}`;
    };

    // Get geolocation
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
        } else {
            showDetails.textContent = "Geolocation is not supported by this browser.";
        }
    };

    // Event listener for geolocation button
    document.querySelector(".geoBtn").addEventListener("click", getUserLocation);

    // Show the crop yield form when the button is clicked
    cropYieldBtn.addEventListener('click', () => {
        document.getElementById('cropYieldForm').style.display = 'block';
    });

    // Function to calculate crop yield
    function calculateYield() {
        const cropType = document.getElementById('cropType').value;
        const soilQuality = document.getElementById('soilQuality').value;
        const fertilizerUsed = document.getElementById('fertilizerUsed').value;
        const waterSupply = document.getElementById('waterSupply').value;

        let yieldEstimate;

        // Example logic for yield calculation
        if (cropType === 'corn') {
            yieldEstimate = (fertilizerUsed * 1.2) + (waterSupply * 0.8);
        } else if (cropType === 'wheat') {
            yieldEstimate = (fertilizerUsed * 1.1) + (waterSupply * 0.9);
        } else if (cropType === 'rice') {
            yieldEstimate = (fertilizerUsed * 1.3) + (waterSupply * 0.7);
        }

        // Display the result
        document.getElementById('yieldResult').textContent = `Estimated yield for ${cropType}: ${yieldEstimate.toFixed(2)} tons/ha`;
    }

    // Handle soil moisture analysis
    const analyzeSoilBtn = document.getElementById('analyzeSoilBtn');
    const soilImageInput = document.getElementById('soilImageInput');
    showRecommendedBtn.addEventListener('click', () => {
        const recommendedCrops = document.getElementById('recommendedCrops');
        recommendedCrops.style.display = recommendedCrops.style.display === 'none' ? 'block' : 'none';
    });

    showNotRecommendedBtn.addEventListener('click', () => {
        const notRecommendedCrops = document.getElementById('notRecommendedCrops');
        notRecommendedCrops.style.display = notRecommendedCrops.style.display === 'none' ? 'block' : 'none';
    });

    // Function to handle the image upload and send it to the backend for prediction


    // Event listener for when an image is selected
    // cropDiseaseImage.addEventListener('change', handleImageUpload);

    function openDiseaseDetection() {
        console.log("runnin");
        window.open("http://localhost:8501", "_blank"); // Replace with your Streamlit URL if different
        }

        // function openDiseaseDetection() {
        //     console.log("Running Disease Detection button");
            
        //     // Start the Streamlit server
        //     fetch('http://localhost:3000/start-streamlit')
        //         .then(response => {
        //             if (response.ok) {
        //                 console.log("Streamlit server started successfully");
        //                 // Now open the Streamlit app in a new tab
        //                 window.open("http://localhost:8501", "_blank"); 
        //             } else {
        //                 console.error("Failed to start Streamlit server");
        //             }
        //         })
        //         .catch(error => {
        //             console.error("Error starting Streamlit server:", error);
        //         });
        // }
        