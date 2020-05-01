import Head from "next/head";
import App, { AppProps } from "next/app";
import { Fragment, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";

import MapInterface from "../components/maps/MapInterface";
import EntryForm from "../components/maps/EntryForm";

export default function Home() {
  const [optimizationParams, setOptimizationParams] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const handleChangeOptimizationParams = (e) => {
    e.preventDefault();
    let { id, value } = e.target;
    if (id === "addresses") {
      value = value.split("\n");
    }
    setOptimizationParams({ ...optimizationParams, [id]: value });
  };
  const handleSubmitOptimizationParams = async (e) => {
    e.preventDefault();
    console.log(optimizationParams);
    const res = await (
      await fetch("/api", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(optimizationParams),
      })
    ).json();
    console.log(res);
    setCoordinates(res.coordinates);
    setAddresses(res.formattedAddresses);
  };

  return (
    <Container id="main">
      <Container fluid={true} id="mapContainer">
        {coordinates.length ? (
          <MapInterface
            coordinates={coordinates}
            addresses={addresses}
          ></MapInterface>
        ) : (
          <MapInterface></MapInterface>
        )}

        <EntryForm
          handleChange={handleChangeOptimizationParams}
          handleSubmit={handleSubmitOptimizationParams}
        ></EntryForm>
      </Container>
      <style jsx global>{`
        .container#main {
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

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
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
