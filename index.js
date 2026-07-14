// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="


// ---------------------------------------------------
// STEP 1: Fetch alerts for a state from the NWS API
// ---------------------------------------------------
function fetchWeatherAlerts(state) {
  return fetch(`${weatherApi}${state}`)
    .then((response) => {
      if (!response.ok) {
        // The API responded, but with an error status (e.g. bad state code)
        throw new Error("Unable to fetch weather alerts. Please check the state code and try again.");
      }
      return response.json();
    })
    .then((data) => {
      displayAlerts(data);
    })
    .catch((errorObject) => {
      displayError(errorObject.message);
    });
}

// ---------------------------------------------------
// STEP 2: Display the alerts on the page
// ---------------------------------------------------
function displayAlerts(data) {
  const alertsContainer = document.getElementById("alerts-display");

  // Clear out any previous alerts first
  alertsContainer.innerHTML = "";

  // Build the summary message, e.g. "Current watches, warnings, and advisories for New York: 7"
  const summary = document.createElement("h2");
  summary.textContent = `Current watches, warnings, and advisories for ${data.title}: ${data.features.length}`;
  alertsContainer.appendChild(summary);

  // Build a list of alert headlines
  const list = document.createElement("ul");
  data.features.forEach((alert) => {
    const listItem = document.createElement("li");
    listItem.textContent = alert.properties.headline;
    list.appendChild(listItem);
  });
  alertsContainer.appendChild(list);

  // A successful fetch should clear/hide any previous error
  clearError();
}

// ---------------------------------------------------
// STEP 4: Error handling
// ---------------------------------------------------
function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function clearError() {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

// ---------------------------------------------------
// STEP 3: Handle the button click — clear input, validate, fetch
// ---------------------------------------------------
function handleSubmit() {
  const input = document.getElementById("state-input");
  const state = input.value.trim().toUpperCase();

  // Clear the input right away, per the lab instructions
  input.value = "";

  // Basic validation: must be exactly two letters
  if (!state || !/^[A-Z]{2}$/.test(state)) {
    displayError("Please enter a valid two-letter state abbreviation.");
    return;
  }

  fetchWeatherAlerts(state);
}

// ---------------------------------------------------
// Wire up the button once the DOM is ready
// ---------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("fetch-alerts");
  if (button) {
    button.addEventListener("click", handleSubmit);
  }
});

// If your test file imports these functions, keep this at the bottom:
// (Only needed if package.json/tests use CommonJS require — check your repo's existing exports style)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { fetchWeatherAlerts, displayAlerts, displayError, clearError, handleSubmit };
}
// Your code here!