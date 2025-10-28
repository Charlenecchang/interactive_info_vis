registerSketch('sk3', function (p) {
  let particles = [];
  const AFFIRMATIONS = [
    "You are capable!",
    "One page at a time.",
    "Small steps add up.",
    "Focus beats motivation.",
    "You’ve got this.",
    "Progress, not perfection.",
    "Deep work, deep rewards.",
    "Show up > give up.",
    "Future you says thanks."
  ];
  let currentAffirm = AFFIRMATIONS[0];
  let lastAffirmKey = -1;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(20, 20, 60);
    p.clock();

    // Firework in the middle for the inspiring visual effect
    if (p.frameCount % 3 === 0) {
      spawnBurst(p.width / 2, p.height / 2, 8, 2, 6);
    }

    // Change affirmation every 10 minutes
    const minuteKey = p.hour() * 60 + p.minute();
    if (p.minute() % 10 === 0 && p.second() <= 2 && minuteKey !== lastAffirmKey) {
      let next = currentAffirm;
      while (next === currentAffirm) {
        next = AFFIRMATIONS[Math.floor(p.random(AFFIRMATIONS.length))];
      }
      currentAffirm = next;
      lastAffirmKey = minuteKey;
    }

    // Update & draw particles
    p.colorMode(p.RGB);
    p.noStroke();
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.vy += 0.03;
      pt.vx *= 0.985;
      pt.vy *= 0.985;
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 3;

      p.fill(pt.h, 255, 255, pt.life);
      p.circle(pt.x, pt.y, pt.size);

      if (pt.life <= 0) particles.splice(i, 1);
    }

    // Add affirmation text
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255);
    p.textSize(p.width / 30);
    p.text(currentAffirm, p.width / 2, p.height * 0.62);
  };

  // Spawn the firework particles
  function spawnBurst(x, y, count = 30, vmin = 1, vmax = 5) {
    for (let i = 0; i < count; i++) {
      const ang = p.random(p.TAU);
      const speed = p.random(vmin, vmax);
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        h: p.random(360),
        life: 255,
        size: p.random(2, 4)
      });
    }
  }

  // Current date and time
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

  };
});