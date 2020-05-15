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
  startTime,
}) => {
  // STATES
  const [dimension, setDimension] = useState({});
  const [shouldInfoWindowOpen, setShouldInfoWindowOpen] = useState({});

  // PRE COMPUTATION
  let coordinatesMarker = [...coordinates];
  if (isEndAtStart) {
    // remove extra marker coordinate for End At Start
    coordinatesMarker.pop();
  }

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

    // USED TO DISPLAY OR NOT DISPLAY FINAL DESTINATION AS START
    const length = distanceTravelledBetween.length;
    if (index == 0 && isEndAtStart) {
      index = length - 1;
    }

    //CANNOT BE CALCULATED FOR 0th index
    let totalDistanceTravelledToANode = 0;
    let totalTimeElapsedToANode = 0;
    if (index > 0) {
      totalDistanceTravelledToANode = sum(
        distanceTravelledBetween.slice(0, index)
      );
      totalTimeElapsedToANode = sum(timeElapsedBetween.slice(0, index));
    }

    return (
      <div>
        {index == 0 ? (
          // DISPLAY FOR STARTING POINT
          <p>
            <strong>This is the Starting Point</strong>
          </p>
        ) : (
          // DISPLAY FOR STARTING AND ENDING POINT
          index == length - 1 &&
          isEndAtStart && (
            <p>
              <strong>This is the Starting Point</strong>
              <strong>Details below are for Returning To Start Details</strong>
            </p>
          )
        )}
        <p>Address:{addresses[index]}</p>
        {/* ONLY DISPLAY AFTER THIS FOR ARRIVAL TIMES */}
        {0 < index && (
          <table>
            <tr>
              <td>Total Distance Travelled:</td>
              <td>{totalDistanceTravelledToANode}m</td>
            </tr>
            <tr>
              <td>Total Time Elapsed:</td>
              <td>
                {moment()
                  .startOf("day")
                  .seconds(totalTimeElapsedToANode)
                  .format("H:mm:ss")}
              </td>
            </tr>
            <tr>
              <td>Estimated Time of Arrival:</td>
              <td>
                {startTime
                  .add(totalTimeElapsedToANode, "seconds")
                  .format("LTS")}
              </td>
            </tr>
            <br />
            <tr>
              <td>Distance Travelled From Previous Node:</td>
              <td>{distanceTravelledBetween[index - 1]}m</td>
            </tr>
            <tr>
              <td>Time Elapsed From Previous Node: </td>
              <td>
                {moment()
                  .startOf("day")
                  .seconds(timeElapsedBetween[index - 1])
                  .format("H:mm:ss")}
              </td>
            </tr>
          </table>
        )}
        <style jsx>{"table td:nth-child(2) { font-weight: bold;}"}</style>
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
          {coordinatesMarker.map((coordinate, i) => {
            return (
              <Fragment key={i}>
                <Marker
                  animation="DROP"
                  label={{ text: (i + 1).toString(), color: "white" }}
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
          ></MapDirectionsRenderer>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapInterface;
