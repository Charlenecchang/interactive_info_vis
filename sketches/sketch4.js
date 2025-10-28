registerSketch('sk4', function (p) {
  // Setup racetrack variables
  let startLine = 0;
  let finishLine = p.windowWidth - 100;

  // Setup circle variables
  let circX = startLine;
  let circY = 250;
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.frameRate(3);
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
    
    // Label finish line
    p.textSize(22);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Goal', p.width /1.2, p.height / 5);

    // Draw horse emoji (mirrored to facing finish line)
    p.push();
    p.translate(circX, circY);
    p.scale(-1, 1); 
    p.textSize(80);
    p.text('🐎', 0, 0); 
    p.pop();

    // Move the circle
    circX += 20;
    // End the loop when x reaches the line
    if (circX > finishLine) {
      noLoop();
    }

  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
