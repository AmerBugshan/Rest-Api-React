import http from "node:http";
import { getDataFromDB } from "./Database/db.js";
import { sendJSONResponse } from "./utils/sendJSONResponse.js";
import { getDataByPathParams } from "./utils/getDataByPathParams.js";
import { getDataByQueryParams } from "./utils/getDataByQueryParams.js";

const PORT = 8000;

const server = http.createServer(async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const destinations = await getDataFromDB();
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const queryObj = Object.fromEntries(urlObj.searchParams);

  if (urlObj.pathname === '/api' && req.method === 'GET') {
    let filteredData = getDataByQueryParams(destinations, queryObj);
    sendJSONResponse(res, 200, filteredData);
  } 
  else if (req.url.startsWith('/api/continent') && req.method === 'GET') {
    const continent = req.url.split('/').pop();
    const filteredData = getDataByPathParams(destinations, 'continent', continent);
    sendJSONResponse(res, 200, filteredData);
  } 
  else if (req.url.startsWith('/api/country') && req.method === 'GET') {
    const country = req.url.split('/').pop();
    const filteredData = getDataByPathParams(destinations, 'country', country);
    sendJSONResponse(res, 200, filteredData);
  } 
  else {
    res.setHeader('Content-Type', 'application/json');
    sendJSONResponse(res, 404, {
      error: "not found",
      message: "The requested route does not exist"
    });   
  }
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));