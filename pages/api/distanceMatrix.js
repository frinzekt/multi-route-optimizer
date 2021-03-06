// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import distance from "google-distance-matrix";
import NodeGeoCoder from "node-geocoder";

const googleMapsApiKey = process.env.GOOGLE_API_KEY;
const geocoderOptions = {
  provider: "google",
  apiKey: googleMapsApiKey,
};
const geocoder = NodeGeoCoder(geocoderOptions);

distance.key(googleMapsApiKey);

// SAMPLE RESPONSE DATA
const responseData = {
  destination_addresses: [
    "6 Great Carleton Pl, Edinburgh EH16 4TX, UK",
    "College Way, Greenwich, London SE10 9NN, UK",
    "Gustav Adolfs torg 24, 111 52 Stockholm, Sweden",
    "Staroměstské nám. 483/21, 110 00 Praha-Staré Město, Czechia",
  ],
  origin_addresses: [
    "6 Great Carleton Pl, Edinburgh EH16 4TX, UK",
    "College Way, Greenwich, London SE10 9NN, UK",
    "Gustav Adolfs torg 24, 111 52 Stockholm, Sweden",
    "Staroměstské nám. 483/21, 110 00 Praha-Staré Město, Czechia",
  ],
  rows: [
    {
      elements: [
        {
          distance: {
            text: "1 m",
            value: 0,
          },
          duration: {
            text: "1 min",
            value: 0,
          },
          status: "OK",
        },
        {
          distance: {
            text: "651 km",
            value: 651367,
          },
          duration: {
            text: "7 hours 6 mins",
            value: 25555,
          },
          status: "OK",
        },
        {
          distance: {
            text: "2,519 km",
            value: 2518655,
          },
          duration: {
            text: "1 day 3 hours",
            value: 97444,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,894 km",
            value: 1893725,
          },
          duration: {
            text: "19 hours 30 mins",
            value: 70226,
          },
          status: "OK",
        },
      ],
    },
    {
      elements: [
        {
          distance: {
            text: "651 km",
            value: 651176,
          },
          duration: {
            text: "7 hours 2 mins",
            value: 25340,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1 m",
            value: 0,
          },
          duration: {
            text: "1 min",
            value: 0,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,884 km",
            value: 1884299,
          },
          duration: {
            text: "20 hours 32 mins",
            value: 73917,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,259 km",
            value: 1259368,
          },
          duration: {
            text: "12 hours 58 mins",
            value: 46699,
          },
          status: "OK",
        },
      ],
    },
    {
      elements: [
        {
          distance: {
            text: "2,530 km",
            value: 2529899,
          },
          duration: {
            text: "1 day 3 hours",
            value: 97905,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,890 km",
            value: 1890500,
          },
          duration: {
            text: "20 hours 39 mins",
            value: 74324,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1 m",
            value: 0,
          },
          duration: {
            text: "1 min",
            value: 0,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,429 km",
            value: 1429423,
          },
          duration: {
            text: "16 hours 23 mins",
            value: 58952,
          },
          status: "OK",
        },
      ],
    },
    {
      elements: [
        {
          distance: {
            text: "1,889 km",
            value: 1888920,
          },
          duration: {
            text: "19 hours 44 mins",
            value: 71037,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,250 km",
            value: 1249521,
          },
          duration: {
            text: "13 hours 11 mins",
            value: 47457,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1,429 km",
            value: 1428672,
          },
          duration: {
            text: "16 hours 26 mins",
            value: 59164,
          },
          status: "OK",
        },
        {
          distance: {
            text: "1 m",
            value: 0,
          },
          duration: {
            text: "1 min",
            value: 0,
          },
          status: "OK",
        },
      ],
    },
  ],
  status: "OK",
};
export default async (req, res) => {
  const places = req.body.addresses;
  distance.matrix(places, places, async (err, responseData) => {
    if (!err) console.log(err);

    const geoCoding = async (addresses) => {
      const res = await geocoder.batchGeocode(addresses);
      return res;
    };
    const { addresses } = req.body;
    const geoCodes = await geoCoding(addresses);

    // PARSING THE COORDINATE PAIR
    const coordinates = geoCodes.map((geoCode) => {
      const { latitude, longitude } = geoCode.value[0];
      return { latitude, longitude };
    });
    const formattedAddresses = geoCodes.map(
      (geoCode) => geoCode.value[0].formattedAddress
    );
    const googlePlaceId = geoCodes.map(
      (geoCode) => geoCode.value[0].extra.googlePlaceId
    );

    // CONVERSION OF RESPONSE DATA TO ADJACENCY MATRIX
    // 2D Loop Origin x Destination Matrix
    // WHERE EACH CELL WILL CONTAIN ARRAY OF SIZE 2: [distance, time]
    console.log(responseData);
    const matrix = responseData.rows.map((origin) => {
      const travelData = origin.elements.map((travelDatum) => {
        const weight = {
          distance: travelDatum.distance.value,
          time: travelDatum.duration.value,
        };
        return weight;
      });
      return travelData;
    });
    res.statusCode = 200;
    res.json({
      coordinates,
      formattedAddresses,
      googlePlaceId,
      matrix,
    });
  });
};
