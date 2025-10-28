registerSketch('sk4', function (p) {
  // Setup racetrack variables
  let startLine = 0;
  let finishLine = p.windowWidth - 100;

  // Setup coordinates
  let circX = startLine;
  let circY = 250;

  // Setup the one hour goal timer
  const TOTAL_MS = 1 * 60 * 60 * 1000;
  let running = false;
  let startMs = 0; 
  // Horse run progress
  let elapsedMs = 0;

  // Set start button location
  const btn = { x: 16, y: 66, w: 120, h: 36 };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(30);
  };

  p.draw = function () {
    p.background(121, 96, 76);

    // Update remaining time
    if (running) {
      elapsedMs = p.constrain(p.millis() - startMs, 0, TOTAL_MS);
      if (elapsedMs >= TOTAL_MS) running = false;
    }
    const remainingMs = Math.max(0, TOTAL_MS - elapsedMs);

    // Add clock title and remaining time
    p.textAlign(p.LEFT, p.TOP);
    p.fill(255);
    p.textSize(20);
    p.text('One Hour Study Goal Tracker', 16, 16);
    p.textSize(16);
    p.text('Remaining: ' + formatTime(remainingMs), 16, 36);

    // Add button
    drawButton();

    // Draw start line
    p.noStroke();
    p.fill(0);
    p.rect(startLine, 0, 5, p.height);

    // Draw finish line
    p.fill(0, 255, 0);
    p.rect(finishLine, 0, 20, p.height);

    // Label finish line
    p.fill(255);
    p.textSize(22);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Goal', p.width / 1.2, p.height / 5);

    // Add progress bar
    const axisY = circY + 70;
    p.stroke(255);
    p.strokeWeight(2);
    p.line(startLine, axisY, finishLine, axisY);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    const x0 = startLine;
    const x1 = p.lerp(startLine, finishLine, 0.5);
    const x2 = finishLine;
    tick(x0, axisY, '0 min');
    tick(x1, axisY, '30 min');
    tick(x2, axisY, '1 h');

    // Move horse along racetrack based on elapsed time
    circX = p.map(elapsedMs, 0, TOTAL_MS, startLine, finishLine);

    // Draw horse emoji (mirrored to face finish line)
    p.push();
    p.translate(circX, circY);
    p.scale(-1, 1);
    p.textSize(80);
    p.text('🐎', 0, 0);
    p.pop();

    // Stop drawing once finished
    if (!running && elapsedMs >= TOTAL_MS) {
      p.noLoop();
    }
  };

  function tick(x, y, label) {
    p.stroke(255, 255, 255, 180);
    p.line(x, y - 8, x, y + 8);
    p.noStroke();
    p.fill(255, 255, 255, 180);
    p.text(label, x, y + 10);
  }
  // Change button appearance when clicked
  function drawButton() {
    p.noStroke();
    p.fill(55, 180, 70);
    p.rect(btn.x, btn.y, btn.w, btn.h, 8);
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text(running ? 'Running...' : 'Start Race', btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  function formatTime(ms) {
    const totalSec = Math.round(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Click to start time tracker
  p.mousePressed = function () {
    if (p.mouseX >= btn.x && p.mouseX <= btn.x + btn.w &&
        p.mouseY >= btn.y && p.mouseY <= btn.y + btn.h) {
      running = true;
      startMs = p.millis();
      elapsedMs = 0;
      p.loop(); // resume if previously stopped
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    finishLine = p.width - 100; // keep your original logic
  };
});
