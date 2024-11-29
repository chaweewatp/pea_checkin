// pages/index.tsx
import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function Home() {
  const [location, setLocation] = useState<GeolocationData | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDt5AkntEUGrakmwQiqwnPLLxY6pyH2P5o", // Replace with your API key
  });

  useEffect(() => {
    function updatePosition(position: GeolocationPosition) {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy, // Use accuracy as the radius
      });
    }

    function handleError(error: GeolocationPositionError) {
      console.error("Error getting location:", error.message);
    }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updatePosition, handleError);
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }

    getLocation();
  }, []);

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div>
      <h1>Google Map with Current Location and Accuracy</h1>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy} meters</p>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            zoom={15}
          >
            {/* Marker for the user's location */}
            <Marker
              position={{ lat: location.latitude, lng: location.longitude }}
            />

            {/* Circle representing the accuracy */}
            <Circle
              center={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              radius={location.accuracy} // Set the radius using accuracy
              options={{
                fillColor: "rgba(0, 123, 255, 0.2)",
                strokeColor: "rgba(0, 123, 255, 0.5)",
                strokeWeight: 1,
              }}
            />
          </GoogleMap>
        </div>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
}
