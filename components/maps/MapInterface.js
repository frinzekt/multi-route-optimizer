import React, { Component, Fragment, useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const googleMapsApiKey = process.env.GOOGLE_API_KEY;

const calculateCenter = (array) => {
  const sum = array.reduce((total, current) => total + current);
  return sum / array.length;
};

const MapInterface = ({
  coordinates = [
    { latitude: 55.93, longitude: -3.118 },
    { latitude: 50.087, longitude: 14.421 },
    { latitude: 51.482578, longitude: -0.007659 },
    { latitude: 59.329323, longitude: 18.068581 },
  ],
  addresses = [
    "6 Great Carleton Pl, Edinburgh EH16 4TX, UK",
    "College Way, Greenwich, London SE10 9NN, UK",
    "Gustav Adolfs torg 24, 111 52 Stockholm, Sweden",
    "IDK",
  ],
}) => {
  // STATES
  const [dimension, setDimension] = useState({});
  const [shouldInfoWindowOpen, setShouldInfoWindowOpen] = useState({});

  // HANDLERS
  const handleMarkerClick = (key) => {
    const previousValue = shouldInfoWindowOpen.hasOwnProperty(key)
      ? shouldInfoWindowOpen[key]
      : false;

    setShouldInfoWindowOpen({ ...shouldInfoWindowOpen, [key]: !previousValue });
    console.log(shouldInfoWindowOpen);
  };

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
            lat: calculateCenter(
              coordinates.map((coordinate) => coordinate.latitude)
            ), //-32.1043749,
            lng: calculateCenter(
              coordinates.map((coordinate) => coordinate.longitude)
            ), //115.8224726,
          }}
        >
          {coordinates.map((coordinate, i) => {
            return (
              <Fragment key={i}>
                <Marker
                  position={{
                    lat: parseFloat(coordinate.latitude),
                    lng: parseFloat(coordinate.longitude),
                  }}
                  onClick={() => handleMarkerClick(i)}
                ></Marker>
                {shouldInfoWindowOpen[i] && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(coordinate.latitude),
                      lng: parseFloat(coordinate.longitude),
                    }}
                    onCloseClick={() => handleMarkerClick(i)}
                  >
                    <div className="marker">{addresses[i]}</div>
                  </InfoWindow>
                )}
              </Fragment>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapInterface;
