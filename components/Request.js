import axios from "axios";

const api = (
  path,
  method = "GET",
  body = null,
  requiresAuth = false,
  credentials = null
) => {
  const url = path;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }
  if (requiresAuth) {
    const encodedCredentials = btoa(
      `${credentials.email}:${credentials.password}`
    );
    options.headers["Authorization"] = `Basic ${encodedCredentials}`;
  }

  return axios({
    url: url,
    method: options.method,
    headers: options.headers,
    data: body,
    withCredentials: true,
  });
};

export const requestDistanceMatrix = async (optimizationParams) => {
  try {
    const response = await api(
      `/api/distanceMatrix`,
      "POST",
      optimizationParams
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const requestRouteOptimized = async (adjacencyMatrix, isEndAtStart) => {
  try {
    const response = await api(`/api/routeCalculations`, "POST", {
      adjacencyMatrix,
      isEndAtStart,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
