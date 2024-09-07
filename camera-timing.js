/* Cam - Timing - duration(s)
1 - 09:11:07.500 - 5
Move 2
2 - 09:11:14.500 - 5
Move 2
1 - 09:11:22.500 - 5
Move 2
3 - 09:11:28.500 - 5
Move 2
4 - 09:11:35.500 - 5
Move 4
5 - 09:11:45.500 - 5
Move 8
6 - 09:11:59.500 - 5
Move 2
7 - 09:12:06.500 - 5
Move 6
8 - 09:12:17.500 - 5
Move 8
9 - 09:12:30.500 - 5
Move 2
10 - 09:12:38.500 - 5
Zooms 5
...Repeats the same pattern but inverse going to 9 */

const firstCameraPosSeedInMillis = 1724836267000; // 28-08-2024 09:11:07.500 

const cameraMovementCycle = [
  { type: "static", cameraPos: 1, duration: 5000 },
  { type: "move", duration: 2000, toCameraPos: 2 },
  { type: "static", cameraPos: 2, duration: 5000 },
  { type: "move", duration: 2000, toCameraPos: 1 },
  { type: "static", cameraPos: 1, duration: 5000 },
  { type: "move", duration: 2000, toCameraPos: 3 },
  { type: "static", cameraPos: 3, duration: 5000 },
  { type: "move", duration: 2000, toCameraPos: 4 },
  { type: "static", cameraPos: 4, duration: 5000 },
  { type: "move", duration: 4000, toCameraPos: 5 },
  { type: "static", cameraPos: 5, duration: 5000 },
  { type: "move", duration: 8000, toCameraPos: 6 },
  { type: "static", cameraPos: 6, duration: 5000 },
  { type: "move", duration: 2000, toCameraPos: 7 },
  { type: "static", cameraPos: 7, duration: 5000 },
  { type: "move", duration: 6000, toCameraPos: 8 },
  { type: "static", cameraPos: 8, duration: 5000 },
  { type: "move", duration: 8000, toCameraPos: 9 },
  { type: "static", cameraPos: 9, duration: 5000 },
  { type: "move", duration: 2000, toCameraPos: 10 },
  { type: "static", cameraPos: 10, duration: 5000 },
];

const reverseCycle = cameraMovementCycle.slice().reverse().map(step => {
  if (step.type === "move") {
    return { ...step, toCameraPos: step.toCameraPos, duration: step.duration };
  }
  return step;
});

const fullCycle = [...cameraMovementCycle, ...reverseCycle];

export function getCurrentCameraForTime(time) {
  const timeElapsed = time - firstCameraPosSeedInMillis;
  const cycleDuration = fullCycle.reduce((acc, { duration }) => acc + duration, 0);
  const timeInCycle = (timeElapsed % cycleDuration + cycleDuration) % cycleDuration;

  let timeAcc = 0;
  for (let i = 0; i < fullCycle.length; i++) {
    const { duration } = fullCycle[i];
    timeAcc += duration;
    if (timeAcc >= timeInCycle) {
     return fullCycle[i];
    }
  }
}

