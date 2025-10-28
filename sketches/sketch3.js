// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(20, 20, 60);
    p.clock();

    // Add Y/M/D Information

    // Create Background Firework Animation
    // p.ellipse(p.width / 2, p.height / 2, 200, 200);

    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    // p.text('HWK #3. C', p.width / 2, p.height / 2); // Display Study affirmation here 
  }

  p.clock = function () {
    let yr = p.year();
    let mo = p.month();
    let da = p.day();

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    p.fill(255, 255, 255, 150)
    // p.textFont(clockFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(p.width / 30);
    let noon = hr >= 12 ? " PM" : " AM"
    if (mn < 10)
      mn = "0" + mn
    hr %= 12
    p.text(yr + "/" + mo + "/" + da, p.width / 2, p.height / 7);
    p.text(hr + ":" + mn + ":" + sc + noon, p.width / 2, p.height / 5);

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});