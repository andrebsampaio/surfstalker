# surfstalker

Surfstalker is a Node.js project for automatically recording live video streams from a specified URL. It uses Puppeteer to navigate to the stream page, extract the video source, and then uses FFmpeg to record the stream to a local file.

## Features
- Starts and stops recording via HTTP endpoints
- Saves recordings as WebM files with timestamps
- Configurable through environment variables

## Requirements
- Node.js
- FFmpeg installed and available in PATH

## Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Set the following environment variables:
   - `MAIN_URL`: The URL of the page containing the video stream
   - `PORT`: The port for the HTTP server

## Usage
1. Start the server: `node kitecord/server.js`
2. To start recording: Send a GET request to `http://localhost:<PORT>/start`
3. To stop recording: Send a GET request to `http://localhost:<PORT>/stop`

Recordings will be saved in the `recordings` directory.
