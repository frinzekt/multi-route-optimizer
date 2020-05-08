import React, { useEffect } from "react";
import { DirectionsRenderer, DirectionsService } from "@react-google-maps/api";

const MapDirectionsRenderer = ({
  setDirectionsState,
  directionsState,
  places,
}) => {
  const waypoints = places.map((place) => ({
    location: { lat: place.latitude, lng: place.longitude },
    stopover: true,
  }));
  const origin = waypoints.shift().location;
  const destination = waypoints.pop().location;

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsState(result);
        } else {
          console.log(result);
        }
      }
    );
  }, []);

  return (
    <div>
      {directionsState && <DirectionsRenderer directions={directionsState} />}
    </div>
  );
};

export default MapDirectionsRenderer;
