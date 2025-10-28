let model = null;
let face = null;
let capture = null;
let estimating = false;
// Set session parameters: 20 minute 
const SESSION_MS = 20 * 60 * 1000;
let remainingMs = SESSION_MS;
let lastTickMs = 0;
let lookingNow = false;
let prevLooking = false;
let stopsCount = 0;

registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    capture = p.createCapture('video');
    capture.size(640, 480);
    capture.hide();
    loadFaceModel();
  };

  async function loadFaceModel() {
    if (typeof tf !== 'undefined' && tf.ready) { await tf.ready(); }
    model = await blazeface.load();
  }

  p.draw = function () {
    p.background(245);

    // Show camera
    if (capture && capture.elt && capture.elt.readyState >= 2) {
      p.image(capture, 0, 0, p.width, p.height);
    }

    const videoReady = capture && capture.elt && capture.elt.readyState >= 2;
    if (videoReady && model && !estimating) {
      estimating = true;
      getFace().finally(() => { estimating = false; });
    }

    // Timer logic
    const now = p.millis();

    // Update "looking" status affects countdown
    if (lookingNow) {
      if (lastTickMs > 0) {
        const dt = now - lastTickMs;
        remainingMs = Math.max(0, remainingMs - dt);
      }
    }
    lastTickMs = now;

    // Count stop counts by counting transitions from looking -> not looking
    if (prevLooking && !lookingNow) { stopsCount += 1; }
    prevLooking = lookingNow;

    // Display heads up display
    drawHUD(p);

    // Draw a few landmarks for feedback
    if (face) {
      const re = scalePoint(face.landmarks[0]); // rightEye
      const le = scalePoint(face.landmarks[1]); // leftEye
      // const nose = scalePoint(face.landmarks[2]);

      p.noStroke();
      p.fill(0);
      p.circle(re.x, re.y);
      p.circle(le.x, le.y);
      // p.circle(nose.x, nose.y, 8);
    }
  };

  // Map BlazeFace coordinates on to canvas
  function scalePoint(pt) {
    const x = p.map(pt[0], 0, capture.width,  0, p.width);
    const y = p.map(pt[1], 0, capture.height, 0, p.height);
    return p.createVector(x, y);
  }

  // Decide if user is looking using a simple heuristic
  function isLookingAtCamera(pred) {
    if (!pred || !pred.landmarks || pred.landmarks.length < 2) return false;

    const re = pred.landmarks[0];
    const le = pred.landmarks[1];
    const [tlx, tly] = pred.topLeft;
    const [brx, bry] = pred.bottomRight;

    const boxW = Math.max(1, brx - tlx); 
    const eyeDist = Math.hypot(le[0] - re[0], le[1] - re[1]);

    // Heuristic: larger ratio => more frontal. Tune ~0.30–0.36.
    const ratio = eyeDist / boxW;

    // Optional additional checks: face size, vertical position, etc.
    const minBoxWidth = 80; // ignore tiny faces far away
    const boxOK = boxW >= minBoxWidth;

    return boxOK && ratio >= 0.32;
  }

  async function getFace() {
    const predictions = await model.estimateFaces(capture.elt, false);
    if (!predictions || predictions.length === 0) {
      face = null;
      lookingNow = false;
      return;
    }
    face = predictions[0];
    lookingNow = isLookingAtCamera(face);
  }

  function drawHUD(p) {
    // Create panel
    const pad = 16;
    const w = 210, h = 130;
    const x = p.width - w - pad, y = pad;

    p.noStroke();
    p.fill(255, 255, 255, 210);
    p.rect(x, y, w, h, 14);

    // Add Title to Countdown Timer
    p.fill(20);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(16);
    p.text('20 Minute Countdown', x + 12, y + 10);

    // Add Remaining Countdown Time
    p.textSize(28);
    p.text(formatTime(remainingMs), x + 12, y + 38);

    // Update Status
    p.textSize(14);
    p.fill(lookingNow ? 20 : 180, lookingNow ? 150 : 40, 40);
    p.text(lookingNow ? 'status: studying 👀' : 'status: paused ⏸️', x + 12, y + 78);

    // Stops counter
    p.fill(60);
    p.text(`stopped: ${stopsCount}`, x + 12, y + 100);

  }

  function formatTime(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
