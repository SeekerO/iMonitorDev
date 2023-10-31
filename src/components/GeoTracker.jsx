import React, { Component } from 'react';

class LocationTracker extends Component {
  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(this.handleLocation, this.handleLocationError);
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }

  handleLocation = (position) => {
    const { latitude, longitude } = position.coords;

    // Use the Google Maps Geocoding API to get the location text
    const geocodingApiKey = 'YOUR_GOOGLE_GEOCODING_API_KEY';
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geocodingApiKey}`;

    fetch(geocodingApiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const locationText = data.results[0].formatted_address;
          console.log(`Location: ${locationText}`);
        } else {
          console.log('Location data not found.');
        }
      })
      .catch(error => {
        console.error(`Error fetching location data: ${error}`);
      });
  }

  handleLocationError = (error) => {
    console.error(`Error getting location: ${error.message}`);
  }

  render() {
    return (
      <div>
        {/* Your component's content */}
      </div>
    );
  }
}

export default LocationTracker;
