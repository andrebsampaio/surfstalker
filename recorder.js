import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

let recordingProcess = null;
let browser = null;

export async function startRecording() {
  browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(process.env.MAIN_URL);

  const videoIframe = await page.$("iframe");
  const frame = await videoIframe.contentFrame();
  await frame.waitForSelector("source");
  const videoSrc = await frame
    .$("source")
    .then((el) => el?.evaluate((node) => node.src));

  if (!videoSrc) {
    console.error("Video source not found");
    await browser.close();
    return;
  }

  // Create folder recordings in the root of the project
  // and save the recorded stream in that folder
  if (!fs.existsSync("recordings")) {
    fs.mkdirSync("recordings");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const videoPath = `recorded-stream-${timestamp}.webm`;
  const outputPath = `recordings/${videoPath}`;

  recordingProcess = ffmpeg(videoSrc)
    .outputOptions("-c:v libvpx-vp9")
    .outputOptions("-crf 30")
    .output(outputPath);

  recordingProcess.run();

  console.log(`Recording started. Saving to ${outputPath}`);
}

export function stopRecording() {
  if (recordingProcess) {
    recordingProcess.abort();
  }
  if (browser) {
    browser
      .close()
      .catch((error) => console.error("Error closing browser:", error));
  }
}
