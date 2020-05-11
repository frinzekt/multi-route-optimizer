import Head from "next/head";
import App, { AppProps } from "next/app";
import { Fragment, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";

import MapInterface from "../components/maps/MapInterface";
import EntryForm from "../components/maps/EntryForm";
import {
  requestDistanceMatrix,
  requestRouteOptimized,
} from "../components/Request";

export default function Home() {
  const [optimizationParams, setOptimizationParams] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [weight, setWeight] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [directionsState, setDirectionsState] = useState([]);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
  const [routes, setRoutes] = useState([]);

  const handleChangeOptimizationParams = (e) => {
    let { id, value } = e.target;
    if (id === "addresses") {
      value = value.trim().split("\n");
    }
    setOptimizationParams({ ...optimizationParams, [id]: value });
  };
  const handleCheckOptimizationParams = (e) => {
    const { id, checked } = e.target;
    setOptimizationParams({ ...optimizationParams, [id]: checked });
  };
  const handleSubmitOptimizationParams = async (e) => {
    e.preventDefault();
    // UPDATE GEOLOCATIONS AND DISTANCE MATRIX
    const resDistanceMatrix = await requestDistanceMatrix(optimizationParams);
    // setCoordinates(resDistanceMatrix.coordinates);
    setAdjacencyMatrix(resDistanceMatrix.matrix);

    // ROUTE GENERATION
    console.log(optimizationParams);
    const resRoutes = await requestRouteOptimized(
      resDistanceMatrix.matrix,
      optimizationParams.isEndAtStart
    );

    // THE FIRST INDEX IS THE ONE WITH THE LOWEST TIME
    const orderedCoordinates = resRoutes[0].order.map(
      (index) => resDistanceMatrix.coordinates[index]
    );
    const orderedAddresses = resRoutes[0].order.map(
      (index) => resDistanceMatrix.formattedAddresses[index]
    );
    const orderedWeight = resRoutes[0].weight;
    setCoordinates(orderedCoordinates);
    setAddresses(orderedAddresses);
    setWeight(orderedWeight);

    console.log(orderedAddresses);
  };

  return (
    <Container id="main" fluid={true}>
      <Container fluid={true} id="mapContainer">
        {coordinates.length ? (
          <MapInterface
            coordinates={coordinates}
            addresses={addresses}
            weight={weight}
            directionsState={directionsState}
            setDirectionsState={setDirectionsState}
            isEndAtStart={optimizationParams.endAtStart}
          ></MapInterface>
        ) : (
          // <MapInterface
          //   directionsState={directionsState}
          //   setDirectionsState={setDirectionsState}
          // ></MapInterface>
          <Fragment></Fragment>
        )}

        <EntryForm
          handleChange={handleChangeOptimizationParams}
          handleSubmit={handleSubmitOptimizationParams}
          handleCheck={handleCheckOptimizationParams}
          formattedAddress={addresses}
        ></EntryForm>
      </Container>
      <style jsx global>{`
        .container-fluid#main {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        #mapContainer {
          min-height: 50vh;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </Container>
  );
}
