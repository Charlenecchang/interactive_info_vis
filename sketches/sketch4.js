// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  // Setup racetrack variables
  let startLine = 0;
  let finishLine = p.windowWidth - 100;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
    p.background(121, 96, 76);
    
    // Draw start line
    p.noStroke();
    p.fill(0);
    p.rect(startLine, 0, 5, p.height);
    
    // Draw finish line
    p.fill(0, 255, 0);
    p.rect(finishLine, 0, 20, p.height);

    p.textSize(22);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Goal', p.width /1.2, p.height / 5);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
