import generateRoutes from "../../helper/generateRoute.mjs";

export default async (req, res) => {
  // CHECK IF PARAMS ARE CORRECT
  try {
    const routes = generateRoutes(
      req.body.adjacencyMatrix,
      req.body.isEndAtStart
    );
    console.log(routes);
    res.statusCode = 200;
    res.json(routes);
  } catch (err) {
    res.statusCode = 400;
    res.json({ error: "Incorrect or Missing Parameters" });
  }
};
