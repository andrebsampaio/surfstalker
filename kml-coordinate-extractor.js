const fs = require("fs");
const xml2js = require("xml2js");
const turf = require("@turf/turf");

function parseKML(kmlString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(kmlString, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function extractPolygons(kmlObj) {
  const placemarks = kmlObj.kml.Document[0].Placemark;
  return placemarks.map((placemark) => {
    const coordinates =
      placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
    return coordinates
      .trim()
      .split(" ")
      .map((coord) => {
        const [lon, lat] = coord.split(",");
        return [parseFloat(lon), parseFloat(lat)];
      });
  });
}

export async function processKMLFile(filePath) {
  try {
    const kmlString = fs.readFileSync(filePath, "utf8");
    const kmlObj = await parseKML(kmlString);
    const polygons = extractPolygons(kmlObj);

    return polygons;
  } catch (error) {
    console.error("Error processing KML file:", error);
  }
}

export function isPointInPolygons(point, polygons) {
  for (let i = 0; i < polygons.length; i++) {
    const polygon = turf.polygon([polygons[i]]);
    if (turf.booleanPointInPolygon(point, polygon)) {
      return true;
    }
  }
  return false;
}
