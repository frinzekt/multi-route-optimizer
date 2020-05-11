import React, { Component, Fragment, useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  DrawingManager,
} from "@react-google-maps/api";
import moment from "moment";
import MapDirectionsRenderer from "./MapDirectionsRenderer";

const googleMapsApiKey = process.env.GOOGLE_API_KEY;

const calculateCenter = (array) => {
  const sum = array.reduce((total, current) => total + current);
  return sum / array.length;
};

const MapInterface = ({
  coordinates,
  addresses,
  weight,
  directionsState,
  setDirectionsState,
  isEndAtStart,
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
  };

  // COMPONENT FOR DISPLAYING THE CONTENTS OF INFOWINDOW
  const Content = ({ index }) => {
    const sum = (array) => array.reduce((total, current) => total + current);
    const { distanceTravelledBetween, timeElapsedBetween } = weight;
    const totalDistanceTravelledToANode = sum(
      distanceTravelledBetween.slice(index)
    );
    const totalTimeElapsedToANode = sum(timeElapsedBetween.slice(index));
    console.log(index);
    return (
      <div>
        <p>Address:{addresses[index]}</p>
        {/* ONLY DISPLAY AFTER THIS FOR ARRIVAL TIMES */}
        {index > 0 && (
          <Fragment>
            <p>
              Total Distance Travelled:
              {totalDistanceTravelledToANode}m
            </p>
            <p>
              Total Time Elapsed:
              {moment()
                .startOf("day")
                .seconds(totalTimeElapsedToANode)
                .format("H:mm:ss")}
            </p>
            <p>
              Estimated Time of Arrival:
              {moment()
                .startOf("day")
                .seconds(totalTimeElapsedToANode)
                .format("H:mm:ss")}
            </p>
            <p>
              Distance Travelled From Previous Node:
              {distanceTravelledBetween[index]}
            </p>
            <p>
              Time Elapsed From Previous Node:{" "}
              {moment()
                .startOf("day")
                .seconds(timeElapsedBetween[index])
                .format("H:mm:ss")}
            </p>
          </Fragment>
        )}
      </div>
    );
  };

  // SET MAP DIMENSION
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
          zoom={10} //10 Is optimal for Inside a State
          center={{
            lat: calculateCenter(
              coordinates.map((coordinate) => coordinate.latitude)
            ),
            lng: calculateCenter(
              coordinates.map((coordinate) => coordinate.longitude)
            ),
          }}
        >
          {coordinates.map((coordinate, i) => {
            return (
              <Fragment key={i}>
                <Marker
                  animation="DROP"
                  label={(i + 1).toString()}
                  title={(i + 1).toString()}
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
                    <Content index={i}></Content>
                  </InfoWindow>
                )}
              </Fragment>
            );
          })}
          <MapDirectionsRenderer
            directionsState={directionsState}
            setDirectionsState={setDirectionsState}
            places={coordinates}
            isEndAtStart={isEndAtStart}
          ></MapDirectionsRenderer>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapInterface;
