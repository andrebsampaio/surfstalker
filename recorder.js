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

  if (!fs.existsSync("recordings")) {
    fs.mkdirSync("recordings");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const videoPath = `recorded-stream-${timestamp}.webm`;
  const outputPath = `recordings/${videoPath}`;

  recordingProcess = ffmpeg(videoSrc)
    .outputOptions("-c:v libvpx-vp9")
    .outputOptions("-crf 30")
    .on("end", () => {
      console.log("Recording finished");
    })
    .on("error", (error) => {
      if (error.message.includes("Exiting normally, received signal 2")) {
        console.log("Recording stopped");
      } else {
        console.error("Error recording stream:", error);
      }
    })
    .output(outputPath);

  recordingProcess.run();

  console.log(`Recording started. Saving to ${outputPath}`);
}

export function stopRecording() {
  if (recordingProcess) {
    recordingProcess.kill("SIGINT");
    recordingProcess = null;
  }
  if (browser) {
    browser
      .close()
      .catch((error) => console.error("Error closing browser:", error));
  }
}
