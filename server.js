import express from "express";
import { startRecording, stopRecording } from "./recorder.js";

const app = express();

app.get("/start", (req, res) => {
  startRecording();
  res.send("Recording started");
});

app.get("/stop", (req, res) => {
  stopRecording();
  res.send("Recording stopped");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
