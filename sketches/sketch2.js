// Instance-mode sketch for tab 2
let model = null;        // CHANGED: explicit init
let face = null;
let capture = null;
let estimating = false;

registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // CHANGED: keep instance-mode call and use the capture itself everywhere
    capture = p.createCapture('video');
    capture.size(640, 480);
    capture.hide();

    loadFaceModel();
  };

  async function loadFaceModel() {
    model = await blazeface.load();
  }

  p.draw = function () {
    p.background(220); // CHANGED: use p.* in instance mode

    // Draw the video so we can see it
    if (capture && capture.elt && capture.elt.readyState >= 2) {
      p.image(capture, 0, 0, p.width, p.height); // CHANGED: p.image + p.width/height
    }

    const videoReady = capture && capture.elt && capture.elt.readyState >= 2;
    if (videoReady && model && !estimating) {
      estimating = true;
      getFace().finally(() => { estimating = false; });
    }

    if (face) {
      // Example: pull landmarks and scale to canvas
      // NOTE: BlazeFace returns 6 landmarks: [rightEye, leftEye, nose, mouth, rightEar, leftEar]
      let rightEye = scalePoint(face.landmarks[0]);
      let leftEye  = scalePoint(face.landmarks[1]);
      let nose     = scalePoint(face.landmarks[2]);
      // Optional: ears if present
      // let rightEar = scalePoint(face.landmarks[4]);
      // let leftEar  = scalePoint(face.landmarks[5]);

      // Draw small circles on landmarks
      p.noStroke();
      p.fill(0);
      p.circle(rightEye.x, rightEye.y, 8);
      p.circle(leftEye.x,  leftEye.y,  8);
      p.circle(nose.x,     nose.y,     8);

      fill(255);
      noStroke();
      square(leftEye.x, leftEye.y, 40);
      square(rightEye.x, rightEye.y, 40);
      fill(0);

      // If you want to stop after first detection:
      // p.noLoop(); // CHANGED: prefix with p.
    }
  };

  // CHANGED: proper function syntax + use p.map/p.createVector and capture dimensions
  function scalePoint(pt) {
    const x = p.map(pt[0], 0, capture.width,  0, p.width);
    const y = p.map(pt[1], 0, capture.height, 0, p.height);
    return p.createVector(x, y);
  }

  async function getFace() {
    // CHANGED: pass the actual <video> element, not querySelector
    const predictions = await model.estimateFaces(capture.elt, false);

    if (!predictions || predictions.length === 0) {
      face = null; // CHANGED: null instead of undefined
    } else {
      face = predictions[0];
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
