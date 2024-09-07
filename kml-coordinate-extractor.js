import fs from "fs";
import xml2js from "xml2js";
import { polygon, booleanPointInPolygon } from "@turf/turf";

class KMLExtractor {
  static parseKML(kmlString) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(kmlString, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static extractPolygons(kmlObj) {
    const placemarks = kmlObj.kml.Document[0].Placemark;
    return placemarks.map((placemark) => {
      const name = placemark.name[0];
      const coordinates =
        placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
      return {
        name,
        coordinates: coordinates
          .trim()
          .split(" ")
          .map((coord) => {
            const [lon, lat] = coord.split(",");
            return [parseFloat(lon), parseFloat(lat)];
          }),
      };
    });
  }

  static async processKMLFile(filePath) {
    try {
      const kmlString = fs.readFileSync(filePath, "utf8");
      const kmlObj = await KMLExtractor.parseKML(kmlString);
      const polygons = KMLExtractor.extractPolygons(kmlObj);

      return polygons;
    } catch (error) {
      console.error("Error processing KML file:", error);
    }
  }

  static getPolygonForPoint(point, polygons) {
    for (let i = 0; i < polygons.length; i++) {
      const { name, coordinates } = polygons[i];
      const polygonObject = polygon([coordinates]);
      if (booleanPointInPolygon(point, polygonObject)) {
        return { name, polygon: polygonObject };
      }
    }
    return null;
  }
}

export default KMLExtractor;
