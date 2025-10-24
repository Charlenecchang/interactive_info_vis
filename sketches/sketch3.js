// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  function fillBetweenRings(centerX, centerY, innerRadius, outerRadius, proportion = 1, fillColor = '#000', pis=2.0) {
    p.push();
    p.fill(fillColor);
    p.beginShape();
 
 
    const xStretch = proportion; // Stretch factor for x-axis
    // Calculate noise amplitude based on inner radius and proportion
    const noiseAmplitude = innerRadius * 0.2;
 
 
    // Draw outer ring
    for (let angle = pis * p.PI; angle <= 2 * p.PI; angle += 0.1) {
      let noise = p.map(p.noise(angle * 2, outerRadius * 0.01), 0, 1, -noiseAmplitude, noiseAmplitude);
      let x = centerX + (outerRadius + noise) * p.cos(angle) * xStretch;
      let y = centerY + (outerRadius + noise) * p.sin(angle);
      p.vertex(x, y);
    }
 
 
    // Connect back to start of outer ring
    let startNoise = p.map(p.noise(0, outerRadius * 0.01), 0, 1, -noiseAmplitude, noiseAmplitude);
    p.vertex(centerX + (outerRadius + startNoise) * p.cos(0) * xStretch,
      centerY + (outerRadius + startNoise) * p.sin(0));
 
 
    // Draw inner ring (going backwards)
    for (let angle = 2 * p.PI; angle >= pis * p.PI; angle -= 0.1) {
      let noise = p.map(p.noise(angle * 2, innerRadius * 0.01), 0, 1, -noiseAmplitude, noiseAmplitude);
      let x = centerX + (innerRadius + noise) * p.cos(angle) * xStretch;
      let y = centerY + (innerRadius + noise) * p.sin(angle);
      p.vertex(x, y);
    }
 
 
    // Connect back to start of inner ring
    startNoise = p.map(p.noise(0, innerRadius * 0.01), 0, 1, -noiseAmplitude, noiseAmplitude);
    p.vertex(centerX + (innerRadius + startNoise) * p.cos(0) * xStretch,
      centerY + (innerRadius + startNoise) * p.sin(0));
 
 
    p.endShape(p.CLOSE);
    p.pop();
  }
 
 
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noiseDetail(2, 0.5); // Makes noise more organic
    p.noFill();
    p.strokeWeight(1);
  };
  p.draw = function () {
    p.background(255);
 
 
    // Example usage:
    p.stroke(0);
    const radious = [90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
 
 
    // Loop until second-to-last element to have pairs for filling
    for (let i = 0; i < radious.length - 1; i++) {
      // Map radius to darker brown color values
      const red = p.map(radious[i], 90, 200, 139, 101);
      const green = p.map(radious[i], 90, 200, 69, 67);
      const blue = p.map(radious[i], 90, 200, 19, 33);
      fillBetweenRings(p.width / 2, p.height / 2, radious[i], radious[i + 1], 1.2,
        p.color(red, green, blue, 150), pis=0);
    }
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
 });
 