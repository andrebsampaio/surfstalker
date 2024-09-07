import KMLExtractor from "./kml-coordinate-extractor.js";
import GPXExtractor from "./gpx-coordinate-extractor.js";
import { getCurrentCameraForTime } from "./camera-timing.js";
import { point } from "@turf/turf";

const kmlFilePath = './camera-fovs.kml';
const gpxFilePath = './test_data.gpx';

export async function getSightings() {
    const kmlPolygons = await KMLExtractor.processKMLFile(kmlFilePath);
    const gpxCoordinates = await GPXExtractor.processGPXFile(gpxFilePath);

    const matchingSightings = [];

    gpxCoordinates.forEach((coord) => {
        const pointObject = point([coord.lon, coord.lat]);
        const polygon = KMLExtractor.getPolygonForPoint(pointObject, kmlPolygons);

        if (polygon) {
            const cameraId = polygon.name[0];
            const curentCamera = getCurrentCameraForTime(coord.time);

            if (cameraId == curentCamera.cameraPos || cameraId == curentCamera.toCameraPos) {
                matchingSightings.push({ coord, curentCamera });
            }
        }
    });

    return matchingSightings;
}