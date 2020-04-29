import React, { Component, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const googleMapsApiKey = process.env.GOOGLE_API_KEY;
const places = [
  "55.930,-3.118",
  "50.087,14.421",
  "51.482578,-0.007659",
  "59.329323,18.068581",
];

const MapInterface = () => {
  const [dimension, setDimension] = useState({});
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimension({
        ...window,
      });
    }
  }, []);
  return (
    <div>
      <LoadScript id="script-loader" googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          id="example-map"
          mapContainerStyle={{
            height: `${dimension.innerHeight - 100}px`,
            width: `${dimension.innerWidth / 1.75}px`,
          }}
          zoom={5} // 10 is Optimal For State
          center={{
            lat: 50.087, //-32.1043749,
            lng: 14.421, //115.8224726,
          }}
        >
          {places.map((place) => {
            const [lat, lng] = place.split(",");
            return (
              <Marker
                position={{
                  lat: parseFloat(lat),
                  lng: parseFloat(lng),
                }}
              ></Marker>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapInterface;
