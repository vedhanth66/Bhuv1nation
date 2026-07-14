(function () {
  var canvas = document.getElementById('fountainCanvas');
  var wrap = document.getElementById('avatar3d-wrap');
  if (!canvas || !wrap) return;

  var ctx = canvas.getContext('2d');
  
  // List of words and emojis to splash in the fountain
  var termsList = [
    { text: "Like", type: "word" },
    { text: "Share", type: "word" },
    { text: "Subscribe", type: "word" },
    { text: "Vlog", type: "word" },
    { text: "Guysss", type: "word" },
    { text: "Namaskara", type: "word" },
    { text: "Comment", type: "word" },
    { text: "Bhuv1nation", type: "word" },
    { text: "Bengaluru", type: "word" },
    { text: "Content", type: "word" },
    { text: "Creator", type: "word" },
    { text: "Watch", type: "word" },
    { text: "Vibe", type: "word" },
    { text: "👍", type: "emoji" },
    { text: "❤️", type: "emoji" },
    { text: "🔔", type: "emoji" },
    { text: "🔥", type: "emoji" },
    { text: "🎥", type: "emoji" },
    { text: "🙌", type: "emoji" },
    { text: "✨", type: "emoji" },
    { text: "💯", type: "emoji" },
    { text: "🎉", type: "emoji" },
    { text: "🤩", type: "emoji" },
    { text: "🎬", type: "emoji" }
  ];

  // Website theme coordinates colors
  var colors = [
    "#ff7675", // Coral
    "#74b9ff", // Blue/Lavender
    "#ffeaa7", // Gold
    "#a29bfe", // Purple
    "#55efc4", // Sage/Mint
    "#fd79a8"  // Soft pink
  ];

  var particles = [];
  var dpr = window.devicePixelRatio || 1;
  var cw, ch;

  // Handle High-DPI Retina displays for crisp text rendering
  function resize() {
    cw = wrap.clientWidth || 420;
    ch = wrap.clientHeight || 500;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.scale(dpr, dpr);
  }
  
  window.addEventListener('resize', resize);
  resize();

  // Helper to escape characters for safety
  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function Particle(x, y, isInteractive, customVel) {
    var item = termsList[Math.floor(Math.random() * termsList.length)];
    this.text = item.text;
    this.type = item.type;
    this.x = x;
    this.y = y;
    
    if (customVel) {
      this.vx = customVel.x;
      this.vy = customVel.y;
    } else if (isInteractive) {
      // Gentle outward drift on click
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 1.5 + 0.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1; 
    } else {
      // Float up and drift left (middle ground)
      this.vx = -(Math.random() * 1.0 + 0.6); // Drift left, balanced
      this.vy = -(Math.random() * 1.5 + 0.5); // Drift up
    }

    this.gravity = -0.005; // Slight upward buoyancy
    this.opacity = 0;      // Start transparent
    this.life = 0;
    this.maxLife = 200 + Math.random() * 100; // Live longer
    this.size = this.type === "emoji" ? (18 + Math.random() * 14) : (13 + Math.random() * 8);
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.rotation = (Math.random() - 0.5) * 0.15; // Slight fixed tilt
    this.rotationSpeed = (Math.random() - 0.5) * 0.005; // Almost imperceptible spin
  }

  Particle.prototype.update = function() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.life++;
    
    // Fade in and fade out gracefully
    if (this.life < 30) {
      this.opacity = this.life / 30;
    } else if (this.life > this.maxLife - 60) {
      this.opacity = 1 - (this.life - (this.maxLife - 60)) / 60;
    } else {
      this.opacity = 1;
    }
  };

  Particle.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);

    if (this.type === "emoji") {
      ctx.font = this.size + "px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.text, 0, 0);
    } else {
      ctx.font = "bold " + this.size + "px 'Plus Jakarta Sans', 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw glassmorphic background pill for text readability
      var textWidth = ctx.measureText(this.text).width;
      var px = 10;
      var py = 5;
      var w = textWidth + px * 2;
      var h = this.size + py * 2;

      ctx.fillStyle = "rgba(13, 9, 20, 0.65)";
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      
      // Draw rounded rectangle
      ctx.beginPath();
      var rx = -w / 2;
      var ry = -h / 2;
      var radius = 12;
      
      if (ctx.roundRect) {
        ctx.roundRect(rx, ry, w, h, radius);
      } else {
        // Fallback for browsers without CanvasRenderingContext2D.roundRect
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + w - radius, ry);
        ctx.quadraticCurveTo(rx + w, ry, rx + w, ry + radius);
        ctx.lineTo(rx + w, ry + h - radius);
        ctx.quadraticCurveTo(rx + w, ry + h, rx + w - radius, ry + h);
        ctx.lineTo(rx + radius, ry + h);
        ctx.quadraticCurveTo(rx, ry + h, rx, ry + h - radius);
        ctx.lineTo(rx, ry + radius);
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      }
      ctx.fill();
      ctx.stroke();

      // Render actual text inside the pill
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, 0, 0);
    }
    ctx.restore();
  };

  var spawnTimer = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    // Clear canvas every frame
    ctx.clearRect(0, 0, cw, ch);
    
    // 1. Continuous fountain spawn from bottom-right area
    spawnTimer++;
    if (spawnTimer >= 25) {
      spawnTimer = 0;
      // Spawn at bottom-right of the wrapper area
      particles.push(new Particle(cw - 20, ch - 25, false));
    }

    // Update and render all active particles
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.update();
      if (p.life >= p.maxLife || p.x < -100 || p.x > cw + 100 || p.y > ch + 100) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }
  }
  
  animate();

  // Mouse/Touch Interaction Coordinates
  function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    var clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    var clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function handleClick(e) {
    var pos = getMousePos(e);
    if (pos.x >= 0 && pos.x <= cw && pos.y >= 0 && pos.y <= ch) {
      // Spawn just 4 subtle interactive particles on click
      for (var i = 0; i < 4; i++) {
        particles.push(new Particle(pos.x, pos.y, true));
      }
    }
  }

  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('touchstart', handleClick, { passive: true });

})();
