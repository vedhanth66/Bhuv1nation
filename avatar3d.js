/* ===================================================================
   BHUVAN 3D CHIBI AVATAR - polished vinyl-toy style figurine
   Features: mouse-following head and eyes, blinking, soft wave,
   idle bob, warm lighting, rounded limbs, and camera prop.
   =================================================================== */
(function () {
  var canvas = document.getElementById('avatarCanvas');
  var wrap = document.getElementById('avatar3d-wrap');
  if (!canvas || !wrap || typeof THREE === 'undefined') return;

  var W = wrap.clientWidth || 420;
  var H = wrap.clientHeight || 500;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(27, W / H, 0.1, 100);
  camera.position.set(0, 2.0, 9.8);
  camera.lookAt(0, 1.62, 0);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene.add(new THREE.AmbientLight(0xfff3e8, 0.72));

  var key = new THREE.DirectionalLight(0xffffff, 0.92);
  key.position.set(4.5, 7.5, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  var rim = new THREE.DirectionalLight(0x9b7fd4, 0.45);
  rim.position.set(-4.5, 4.4, -5);
  scene.add(rim);

  var fill = new THREE.PointLight(0xffb17f, 0.34, 20);
  fill.position.set(-3.2, 2.2, 4.4);
  scene.add(fill);

  function M(color, rough, metal) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: rough !== undefined ? rough : 0.58,
      metalness: metal !== undefined ? metal : 0.02
    });
  }

  var mSkin = M(0xc78e61, 0.62);
  var mSkinLt = M(0xe0ae83, 0.56);
  var mHair = M(0x120804, 0.78);
  var mHairSoft = M(0x221009, 0.8);
  var mJacket = M(0x075ff2, 0.52);
  var mJacketLt = M(0x1d9bf0, 0.5);
  var mShirt = M(0xfff7ec, 0.46);
  var mTie = M(0xf0525f, 0.48);
  var mWhite = M(0xfffbf3, 0.48);
  var mEye = M(0x120b06, 0.72);
  var mMouth = M(0x871f22, 0.62);
  var mTeeth = M(0xfff8ed, 0.42);
  var mGlass = M(0xd9bd82, 0.2, 0.42);
  var mShoe = M(0x2f3136, 0.64);
  var mPant = M(0x252b35, 0.68);
  var mCam = M(0x202126, 0.34, 0.2);
  var mCamLens = M(0x0d0d10, 0.16, 0.5);
  var mCamTrim = M(0x9ea4aa, 0.22, 0.48);

  var mLens = new THREE.MeshStandardMaterial({
    color: 0xe8f5ff,
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.055,
    depthWrite: false
  });
  var mBlush = new THREE.MeshStandardMaterial({
    color: 0xff8f83,
    roughness: 0.9,
    transparent: true,
    opacity: 0.08,
    depthWrite: false
  });
  function P(geo, mat, x, y, z, parent, sx, sy, sz) {
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x || 0, y || 0, z || 0);
    if (sx !== undefined) {
      mesh.scale.set(sx, sy !== undefined ? sy : sx, sz !== undefined ? sz : sx);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    (parent || scene).add(mesh);
    return mesh;
  }

  function makeShape(points, mat, x, y, z, parent) {
    var shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
    shape.closePath();
    var mesh = P(new THREE.ShapeGeometry(shape), mat, x, y, z, parent);
    return mesh;
  }

  function makeFrame(cx, cy, cz, parent) {
    var grp = new THREE.Group();
    grp.position.set(cx, cy, cz);
    parent.add(grp);

    var w = 0.36;
    var h = 0.24;
    var t = 0.016;
    var d = 0.026;
    P(new THREE.BoxGeometry(w, t, d), mGlass, 0, h / 2, 0, grp);
    P(new THREE.BoxGeometry(w, t, d), mGlass, 0, -h / 2, 0, grp);
    P(new THREE.BoxGeometry(t, h, d), mGlass, -w / 2, 0, 0, grp);
    P(new THREE.BoxGeometry(t, h, d), mGlass, w / 2, 0, 0, grp);
    var lens = P(new THREE.PlaneGeometry(w - t * 2.6, h - t * 2.4), mLens, 0, 0, 0.012, grp);
    lens.castShadow = false;
    return grp;
  }

  function limb(parent, from, to, radius, mat, capRadius) {
    var a = new THREE.Vector3(from[0], from[1], from[2]);
    var b = new THREE.Vector3(to[0], to[1], to[2]);
    var mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    var dir = new THREE.Vector3().subVectors(b, a);
    var len = dir.length();
    dir.normalize();

    var cyl = P(new THREE.CylinderGeometry(radius * 0.88, radius, len, 16), mat, mid.x, mid.y, mid.z, parent);
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    var r = capRadius || radius;
    P(new THREE.SphereGeometry(r, 16, 10), mat, a.x, a.y, a.z, parent);
    P(new THREE.SphereGeometry(r * 0.96, 16, 10), mat, b.x, b.y, b.z, parent);
    return cyl;
  }

  function makeSubscribeTexture() {
    var texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 320;
    var ctx = texCanvas.getContext('2d');
    var r = 104;

    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(texCanvas.width - r, 0);
    ctx.quadraticCurveTo(texCanvas.width, 0, texCanvas.width, r);
    ctx.lineTo(texCanvas.width, texCanvas.height - r);
    ctx.quadraticCurveTo(texCanvas.width, texCanvas.height, texCanvas.width - r, texCanvas.height);
    ctx.lineTo(r, texCanvas.height);
    ctx.quadraticCurveTo(0, texCanvas.height, 0, texCanvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(128, 100);
    ctx.lineTo(128, 220);
    ctx.lineTo(232, 160);
    ctx.closePath();
    ctx.fill();

    ctx.font = '900 96px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '1px';
    ctx.fillText('SUBSCRIBE', 286, 164);

    var texture = new THREE.CanvasTexture(texCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;
    return texture;
  }

  var avatar = new THREE.Group();
  avatar.position.y = -0.02;
  scene.add(avatar);

  P(new THREE.CylinderGeometry(1.12, 1.2, 0.1, 48), M(0x8064c8, 0.34, 0.12), 0, 0, 0, avatar);
  var ring = P(new THREE.TorusGeometry(1.09, 0.02, 10, 64), M(0xffa766, 0.28, 0.18), 0, 0.055, 0, avatar);
  ring.rotation.x = Math.PI / 2;

  var shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1, depthWrite: false });
  var shadow = new THREE.Mesh(new THREE.CircleGeometry(1.0, 48), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.065;
  avatar.add(shadow);

  var legGeo = new THREE.CylinderGeometry(0.2, 0.18, 0.7, 14);
  P(legGeo, mPant, -0.27, 0.46, 0, avatar);
  P(legGeo, mPant, 0.27, 0.46, 0, avatar);

  var shoeGeo = new THREE.SphereGeometry(0.23, 18, 10);
  P(shoeGeo, mShoe, -0.28, 0.12, 0.08, avatar, 1.05, 0.5, 1.35);
  P(shoeGeo, mShoe, 0.28, 0.12, 0.08, avatar, 1.05, 0.5, 1.35);

  P(new THREE.SphereGeometry(0.8, 32, 22), mJacket, 0, 1.34, 0, avatar, 0.98, 1.08, 0.82);

  var shirt = P(new THREE.PlaneGeometry(0.32, 0.54), mShirt, 0, 1.32, 0.715, avatar);
  shirt.castShadow = false;

  var collarL = makeShape([[-0.18, 0.08], [-0.02, 0.08], [-0.09, -0.06]], mShirt, 0, 1.62, 0.745, avatar);
  var collarR = makeShape([[0.02, 0.08], [0.18, 0.08], [0.09, -0.06]], mShirt, 0, 1.62, 0.745, avatar);
  collarL.castShadow = collarR.castShadow = false;

  var tieKnot = makeShape([[-0.065, 0.055], [0, 0.12], [0.065, 0.055], [0, -0.025]], mTie, 0, 1.56, 0.755, avatar);
  var tieBody = makeShape([[-0.055, 0.14], [0.055, 0.14], [0.075, -0.19], [0, -0.42], [-0.075, -0.19]], mTie, 0, 1.22, 0.755, avatar);
  tieKnot.castShadow = tieBody.castShadow = false;

  P(new THREE.CylinderGeometry(0.24, 0.27, 0.2, 16), mSkin, 0, 1.94, 0, avatar);

  var headGrp = new THREE.Group();
  headGrp.position.set(0, 2.54, 0);
  avatar.add(headGrp);

  P(new THREE.SphereGeometry(0.82, 40, 30), mSkin, 0, 0, 0, headGrp, 1.0, 0.94, 0.9);
  P(new THREE.SphereGeometry(0.56, 24, 18), mSkin, 0, -0.34, 0.16, headGrp, 1.08, 0.62, 0.72);

  var blushL = P(new THREE.SphereGeometry(0.09, 14, 8), mBlush, -0.45, -0.12, 0.75, headGrp, 1.35, 0.6, 0.12);
  var blushR = P(new THREE.SphereGeometry(0.09, 14, 8), mBlush, 0.45, -0.12, 0.75, headGrp, 1.35, 0.6, 0.12);
  blushL.castShadow = blushR.castShadow = false;

  var eyeWhiteGeo = new THREE.SphereGeometry(0.15, 18, 14);
  P(eyeWhiteGeo, mWhite, -0.29, 0.07, 0.705, headGrp, 1.08, 0.86, 0.36);
  P(eyeWhiteGeo, mWhite, 0.29, 0.07, 0.705, headGrp, 1.08, 0.86, 0.36);

  var irisGeo = new THREE.SphereGeometry(0.078, 16, 12);
  var pupL = P(irisGeo, mEye, -0.29, 0.06, 0.765, headGrp, 1.02, 1.02, 0.55);
  var pupR = P(irisGeo, mEye, 0.29, 0.06, 0.765, headGrp, 1.02, 1.02, 0.55);

  var shineGeo = new THREE.SphereGeometry(0.024, 8, 6);
  var shineL = P(shineGeo, mWhite, -0.265, 0.095, 0.807, headGrp);
  var shineR = P(shineGeo, mWhite, 0.315, 0.095, 0.807, headGrp);
  shineL.castShadow = shineR.castShadow = false;

  var lidGeo = new THREE.SphereGeometry(0.165, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  var lidL = P(lidGeo, mSkin, -0.29, 0.07, 0.708, headGrp, 1.1, 0.01, 0.42);
  lidL.rotation.x = Math.PI;
  var lidR = P(lidGeo, mSkin, 0.29, 0.07, 0.708, headGrp, 1.1, 0.01, 0.42);
  lidR.rotation.x = Math.PI;

  var browGeo = new THREE.BoxGeometry(0.22, 0.04, 0.05);
  var brL = P(browGeo, mHairSoft, -0.29, 0.255, 0.655, headGrp);
  brL.rotation.z = 0.12;
  var brR = P(browGeo, mHairSoft, 0.29, 0.255, 0.655, headGrp);
  brR.rotation.z = -0.12;

  makeFrame(-0.29, 0.065, 0.775, headGrp);
  makeFrame(0.29, 0.065, 0.775, headGrp);
  P(new THREE.BoxGeometry(0.19, 0.016, 0.026), mGlass, 0, 0.065, 0.775, headGrp);

  var templeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.44, 8);
  var tmL = P(templeGeo, mGlass, -0.56, 0.06, 0.55, headGrp);
  tmL.rotation.z = Math.PI / 2;
  tmL.rotation.y = 0.42;
  var tmR = P(templeGeo, mGlass, 0.56, 0.06, 0.55, headGrp);
  tmR.rotation.z = Math.PI / 2;
  tmR.rotation.y = -0.42;

  P(new THREE.SphereGeometry(0.085, 14, 10), mSkinLt, 0, -0.075, 0.805, headGrp, 0.65, 0.55, 0.5);

  var moustacheGeo = new THREE.SphereGeometry(0.1, 16, 8);
  var mustL = P(moustacheGeo, mHairSoft, -0.08, -0.215, 0.79, headGrp, 1.25, 0.42, 0.34);
  mustL.rotation.z = -0.08;
  var mustR = P(moustacheGeo, mHairSoft, 0.08, -0.215, 0.79, headGrp, 1.25, 0.42, 0.34);
  mustR.rotation.z = 0.08;

  var smileShape = new THREE.Shape();
  smileShape.moveTo(-0.21, -0.01);
  smileShape.quadraticCurveTo(-0.13, -0.18, 0, -0.195);
  smileShape.quadraticCurveTo(0.13, -0.18, 0.21, -0.01);
  smileShape.quadraticCurveTo(0.08, -0.075, 0, -0.075);
  smileShape.quadraticCurveTo(-0.08, -0.075, -0.21, -0.01);
  var smile = P(new THREE.ShapeGeometry(smileShape), mMouth, 0, -0.205, 0.817, headGrp);
  smile.castShadow = false;

  var teethShape = new THREE.Shape();
  teethShape.moveTo(-0.145, -0.01);
  teethShape.quadraticCurveTo(-0.08, -0.072, 0, -0.076);
  teethShape.quadraticCurveTo(0.08, -0.072, 0.145, -0.01);
  teethShape.quadraticCurveTo(0.05, -0.038, -0.145, -0.01);
  var teeth = P(new THREE.ShapeGeometry(teethShape), mTeeth, 0, -0.202, 0.823, headGrp);
  teeth.castShadow = false;

  var hairMass = P(new THREE.SphereGeometry(0.68, 36, 24), mHair, 0, 0.42, -0.14, headGrp, 1.3, 0.72, 0.9);
  hairMass.rotation.x = -0.05;
  var topSweep = P(new THREE.SphereGeometry(0.17, 18, 12), mHairSoft, -0.1, 0.73, 0.03, headGrp, 1.65, 0.45, 0.6);
  topSweep.rotation.z = -0.14;
  topSweep.rotation.x = -0.08;

  var hairMeshes = [];
  var clumpGeo = new THREE.SphereGeometry(0.15, 16, 10);
  var hairData = [
    [-0.26, 0.72, 0.08, 1.28, 0.82, 0.72, 0.06, 0.18],
    [0.08, 0.78, 0.04, 1.36, 0.9, 0.76, 0.08, -0.08],
    [0.38, 0.68, -0.06, 1.08, 0.8, 0.72, 0.06, -0.34],
    [-0.52, 0.5, -0.04, 0.96, 0.94, 0.74, 0.08, 0.42],
    [0.54, 0.46, -0.04, 0.92, 0.94, 0.72, 0.1, -0.48],
    [-0.62, 0.18, -0.02, 0.7, 1.18, 0.7, 0.04, 0.42],
    [0.62, 0.18, -0.02, 0.7, 1.18, 0.7, 0.04, -0.42],
    [-0.24, 0.62, -0.38, 1.12, 0.76, 0.82, 0.35, 0.08],
    [0.22, 0.62, -0.38, 1.12, 0.76, 0.82, 0.35, -0.08],
    [0, 0.68, -0.44, 1.2, 0.78, 0.85, 0.36, 0]
  ];

  for (var hi = 0; hi < hairData.length; hi++) {
    var h = hairData[hi];
    var hm = P(clumpGeo, hi < 2 || hi % 4 === 0 ? mHairSoft : mHair, h[0], h[1], h[2], headGrp, h[3], h[4], h[5]);
    hm.rotation.x = h[6];
    hm.rotation.z = h[7];
    hairMeshes.push(hm);
  }

  var earGeo = new THREE.SphereGeometry(0.12, 14, 10);
  P(earGeo, mSkin, -0.78, -0.04, 0.05, headGrp, 0.5, 0.76, 0.42);
  P(earGeo, mSkin, 0.78, -0.04, 0.05, headGrp, 0.5, 0.76, 0.42);

  var leftArm = new THREE.Group();
  avatar.add(leftArm);
  limb(leftArm, [-0.63, 1.58, 0.06], [-0.88, 1.22, 0.12], 0.13, mJacket, 0.14);
  limb(leftArm, [-0.88, 1.22, 0.12], [-0.82, 0.88, 0.3], 0.12, mJacket, 0.13);
  P(new THREE.SphereGeometry(0.13, 16, 10), mSkin, -0.81, 0.76, 0.35, leftArm, 0.92, 0.82, 0.72);

  var camGrp = new THREE.Group();
  camGrp.position.set(-0.82, 0.68, 0.48);
  camGrp.rotation.y = 0.22;
  camGrp.rotation.z = -0.03;
  avatar.add(camGrp);
  P(new THREE.BoxGeometry(0.36, 0.23, 0.18), mCam, 0, 0, 0, camGrp);
  P(new THREE.BoxGeometry(0.09, 0.055, 0.08), mCamTrim, 0.12, 0.135, 0.0, camGrp);
  var barrel = P(new THREE.CylinderGeometry(0.075, 0.085, 0.14, 18), mCamLens, 0, -0.015, 0.14, camGrp);
  barrel.rotation.x = Math.PI / 2;
  var lensRing = P(new THREE.TorusGeometry(0.078, 0.014, 10, 24), mCamTrim, 0, -0.015, 0.215, camGrp);
  lensRing.rotation.z = 0.03;
  P(new THREE.SphereGeometry(0.034, 10, 8), mWhite, 0.11, 0.045, 0.095, camGrp, 1.0, 0.65, 0.35);

  var rightArm = new THREE.Group();
  rightArm.position.set(0.64, 1.58, 0.05);
  rightArm.rotation.z = -0.04;
  avatar.add(rightArm);
  limb(rightArm, [0, 0, 0], [0.31, -0.18, 0.08], 0.13, mJacket, 0.14);
  limb(rightArm, [0.31, -0.18, 0.08], [0.48, 0.18, 0.18], 0.12, mJacket, 0.13);

  var handRGrp = new THREE.Group();
  handRGrp.position.set(0.5, 0.24, 0.2);
  rightArm.add(handRGrp);
  P(new THREE.SphereGeometry(0.135, 16, 10), mSkin, 0, 0, 0, handRGrp, 0.95, 1.05, 0.55);
  P(new THREE.SphereGeometry(0.046, 10, 8), mSkin, -0.095, 0.01, 0.02, handRGrp, 0.8, 1.05, 0.6);
  P(new THREE.SphereGeometry(0.037, 10, 8), mSkin, -0.045, 0.12, 0.02, handRGrp, 0.7, 1.1, 0.55);
  P(new THREE.SphereGeometry(0.038, 10, 8), mSkin, 0.01, 0.135, 0.02, handRGrp, 0.72, 1.12, 0.55);
  P(new THREE.SphereGeometry(0.035, 10, 8), mSkin, 0.064, 0.115, 0.02, handRGrp, 0.7, 1.05, 0.55);

  var subscribeMat = new THREE.MeshBasicMaterial({
    map: makeSubscribeTexture(),
    transparent: true,
    depthWrite: false
  });
  subscribeMat.toneMapped = false;
  var subscribeBtn = P(new THREE.PlaneGeometry(0.88, 0.28), subscribeMat, 0.055, 0.035, 0.115, handRGrp);
  subscribeBtn.rotation.z = -0.06;
  subscribeBtn.castShadow = false;
  subscribeBtn.receiveShadow = false;

  var mX = 0;
  var mY = 0;
  var blinkT = 0;
  var blinking = false;
  var blinkD = 0.12;
  var nextBlink = 2.2 + Math.random() * 3;
  var clock = new THREE.Clock();

  document.addEventListener('mousemove', function (e) {
    mX = (e.clientX / window.innerWidth) * 2 - 1;
    mY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  document.addEventListener('touchmove', function (e) {
    if (!e.touches.length) return;
    mX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    mY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    var dt = clock.getDelta();
    var t = clock.getElapsedTime();

    headGrp.rotation.y += (mX * 0.32 - headGrp.rotation.y) * 0.055;
    headGrp.rotation.x += (mY * -0.14 - headGrp.rotation.x) * 0.055;

    var px = mX * 0.026;
    var py = mY * 0.017;
    pupL.position.x = -0.29 + px;
    pupR.position.x = 0.29 + px;
    pupL.position.y = 0.06 + py;
    pupR.position.y = 0.06 + py;
    shineL.position.x = -0.265 + px;
    shineR.position.x = 0.315 + px;
    shineL.position.y = shineR.position.y = 0.095 + py * 0.6;

    blinkT += dt;
    if (!blinking && blinkT > nextBlink) {
      blinking = true;
      blinkT = 0;
    }

    if (blinking) {
      var bp = blinkT / blinkD;
      if (bp < 0.5) {
        lidL.scale.y = lidR.scale.y = 0.01 + bp * 2 * 1.1;
      } else if (bp < 1) {
        lidL.scale.y = lidR.scale.y = 1.11 - (bp - 0.5) * 2 * 1.1;
      } else {
        lidL.scale.y = lidR.scale.y = 0.01;
        blinking = false;
        blinkT = 0;
        nextBlink = 2 + Math.random() * 3.6;
      }
    }

    avatar.position.y = -0.02 + Math.sin(t * 1.55) * 0.022;
    avatar.rotation.y = Math.sin(t * 0.48) * 0.025;

    rightArm.rotation.z = -0.04 + Math.sin(t * 2.35) * 0.11;
    handRGrp.rotation.z = Math.sin(t * 3.2 + 0.7) * 0.16;

    for (var i = 0; i < hairMeshes.length; i++) {
      var base = hairData[i];
      hairMeshes[i].rotation.x = base[6] + Math.sin(t * 1.7 + i * 0.5) * 0.028;
      hairMeshes[i].rotation.z = base[7] + Math.cos(t * 1.25 + i * 0.63) * 0.024;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', function () {
    W = wrap.clientWidth || 420;
    H = wrap.clientHeight || 500;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
  });
})();
