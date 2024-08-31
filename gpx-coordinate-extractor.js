const fs = require("fs");
const xml2js = require("xml2js");

function parseGPX(gpxString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(gpxString, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function extractCoordinates(gpxObj) {
  const coordinates = [];

  // Extract waypoints
  if (gpxObj.gpx.wpt) {
    gpxObj.gpx.wpt.forEach((wpt) => {
      coordinates.push({
        type: "waypoint",
        lat: parseFloat(wpt.$.lat),
        lon: parseFloat(wpt.$.lon),
        ele: wpt.ele ? parseFloat(wpt.ele[0]) : null,
        time: wpt.time ? new Date(wpt.time[0]) : null,
        speed:
          wpt.extensions && wpt.extensions[0].speed
            ? parseFloat(wpt.extensions[0].speed[0])
            : null,
      });
    });
  }

  // Extract track points
  if (gpxObj.gpx.trk) {
    gpxObj.gpx.trk.forEach((trk) => {
      trk.trkseg.forEach((seg) => {
        seg.trkpt.forEach((trkpt) => {
          coordinates.push({
            type: "trackpoint",
            lat: parseFloat(trkpt.$.lat),
            lon: parseFloat(trkpt.$.lon),
            ele: trkpt.ele ? parseFloat(trkpt.ele[0]) : null,
            time: trkpt.time ? new Date(trkpt.time[0]) : null,
            speed:
              trkpt.extensions && trkpt.extensions[0].speed
                ? parseFloat(trkpt.extensions[0].speed[0])
                : null,
          });
        });
      });
    });
  }

  // Extract route points
  if (gpxObj.gpx.rte) {
    gpxObj.gpx.rte.forEach((rte) => {
      rte.rtept.forEach((rtept) => {
        coordinates.push({
          type: "routepoint",
          lat: parseFloat(rtept.$.lat),
          lon: parseFloat(rtept.$.lon),
          ele: rtept.ele ? parseFloat(rtept.ele[0]) : null,
          time: rtept.time ? new Date(rtept.time[0]) : null,
          speed:
            rtept.extensions && rtept.extensions[0].speed
              ? parseFloat(rtept.extensions[0].speed[0])
              : null,
        });
      });
    });
  }

  return coordinates;
}

export async function processGPXFile(filePath) {
  try {
    const gpxString = fs.readFileSync(filePath, "utf8");
    const gpxObj = await parseGPX(gpxString);
    const coordinates = extractCoordinates(gpxObj);
    return coordinates;
  } catch (error) {
    console.error("Error processing GPX file:", error);
  }
}
