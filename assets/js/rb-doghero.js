/* global rb-doghero animation — isolated IIFE, no global scope pollution */
(function () {
  'use strict';

  // ─── CONFIG ────────────────────────────────────────────────────────────────
  var Cfg = {
    titleSelector : '#page-title',
    wrapperClass  : 'rb-doghero',

    // Gaps & arc geometry (px at scale 1.0)
    sideGap    : 22,   // space between title edge and robot/dog
    arcHeight  : 82,   // how far the bone peaks above the title top
    belowGap   : 16,   // px below .site-intro-center bottom for dog run path

    // Display sizes (px) at scaleDesktop = 1.0 — match SVG viewBox dimensions
    rW: 80,  rH: 112,   // robot
    dW: 78,  dH: 88,    // dog
    bW: 44,  bH: 20,    // bone

    // Robot arm geometry (in viewBox units, pivot = shoulder = arm-group top-center)
    armRest   :  15,    // deg at rest (gentle forward lean)
    armWindup : -52,    // deg pulled back (CCW in SVG = behind robot)
    armThrow  :  68,    // deg snapped forward

    // Robot hand center at THROW pose (viewBox units):
    // shoulder(67,56) + 44px * sin(68°), cos(68°) ≈ (67+40.8, 56+16.5) = (108, 72)
    handThrowVX: 108,  handThrowVY: 72,

    // Dog mouth center (left tip of snout) in dog viewBox units
    mouthVX: 3,  mouthVY: 32,

    // Scaling
    scaleDesktop : 1.0,
    scaleMobile  : 0.72,
    mobileBreak  : 640,   // px — matches CSS breakpoint that hides stage

    // Brand colours (aligned with site design tokens)
    col: {
      b  : '#111827',   // body dark
      ba : '#1a2235',   // body alt
      ac : '#f59e0b',   // amber accent
      or : '#fb923c',   // orange (tongue, warm glow)
      wh : '#ffffff',   // white glints
      gr : '#10b981',   // green LED
      dk : '#080c14',   // deepest dark (eye sockets, bone fill)
    },

    zIndex : 20,
    debug  : true,
  };

  // ─── PHASE DURATIONS (ms) ──────────────────────────────────────────────────
  // Total loop ≈ 5 000 ms
  var PH = {
    windUp    : 390,   // arm pulls back
    snapDelay :  80,   // ms after snap starts before bone launches
    snap      : 230,   // arm snaps forward
    flight    : 830,   // bone in the air  (snap+snapDelay+flight = 1140; +windUp = 1530)
    armReturn : 340,   // arm drifts back to rest (concurrent with flight)
    catch_    : 480,   // dog bounce + tail wag
    runDrop   : 180,   // dog drops to below-title run path
    run       : 1360,  // dog crosses under title right→left
    handoff   : 460,   // pause + bone hides
    dogFade   : 170,   // dog fades out before repositioning
    dogFadeIn : 190,   // dog fades back in at idle
    idle      : 780,   // pause before next throw
    // Total: 1530 + 480 + (180+1360) + (460+170+190+780) ≈ 5150 ms
  };

  // ─── SVG HELPERS ───────────────────────────────────────────────────────────
  var NS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    if (attrs) {
      var keys = Object.keys(attrs);
      for (var i = 0; i < keys.length; i++) {
        e.setAttribute(keys[i], String(attrs[i]));
      }
    }
    return e;
  }

  function append(parent) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) parent.appendChild(args[i]);
    return parent;
  }

  function bodyGradDef(id) {
    var g = svgEl('linearGradient', { id: id, x1:'0', y1:'0', x2:'0', y2:'1' });
    append(g,
      svgEl('stop', { offset:'0%',   'stop-color': Cfg.col.b  }),
      svgEl('stop', { offset:'100%', 'stop-color': Cfg.col.ba })
    );
    return g;
  }

  function glowFilterDef(id) {
    var f = svgEl('filter', { id: id, x:'-60%', y:'-60%', width:'220%', height:'220%' });
    var blur = svgEl('feGaussianBlur', { stdDeviation:'2.2', result:'bl' });
    var merge = svgEl('feMerge', {});
    append(merge,
      svgEl('feMergeNode', { in:'bl' }),
      svgEl('feMergeNode', { in:'SourceGraphic' })
    );
    append(f, blur, merge);
    return f;
  }

  // ─── SVG ART: ROBOT ────────────────────────────────────────────────────────
  // viewBox 0 0 80 112  |  facing RIGHT  |  arm pivot = top-center of arm group
  function buildRobot() {
    var C = Cfg.col;
    var gId = 'rbr-g', bId = 'rbr-b';
    var svg = svgEl('svg', { viewBox:'0 0 80 112', xmlns:NS,
                              style:'overflow:visible;display:block' });
    var defs = svgEl('defs', {});
    append(defs, bodyGradDef(bId), glowFilterDef(gId));
    svg.appendChild(defs);

    var bf = 'url(#' + bId + ')';
    var gf = 'url(#' + gId + ')';

    // Antenna
    append(svg,
      svgEl('line',   { x1:'40', y1:'2',  x2:'40', y2:'11',
                        stroke:C.ac, 'stroke-width':'2.5', 'stroke-linecap':'round' }),
      svgEl('circle', { cx:'40', cy:'2', r:'5.5',
                        fill:C.ac, filter:gf, opacity:'0.9' })
    );

    // Head
    svg.appendChild(svgEl('rect', { x:'16', y:'8', width:'48', height:'38', rx:'10',
      fill:bf, stroke:C.ac, 'stroke-width':'1.5', 'stroke-opacity':'0.55' }));

    // Left eye socket + iris + glint
    append(svg,
      svgEl('rect',   { x:'19', y:'14', width:'18', height:'12', rx:'5', fill:C.dk }),
      svgEl('circle', { cx:'28', cy:'20', r:'5.5', fill:C.ac, filter:gf, opacity:'0.9' }),
      svgEl('circle', { cx:'31', cy:'17', r:'2',   fill:C.wh })
    );

    // Right eye socket + iris + glint
    append(svg,
      svgEl('rect',   { x:'43', y:'14', width:'18', height:'12', rx:'5', fill:C.dk }),
      svgEl('circle', { cx:'52', cy:'20', r:'5.5', fill:C.ac, filter:gf, opacity:'0.9' }),
      svgEl('circle', { cx:'55', cy:'17', r:'2',   fill:C.wh })
    );

    // Wink — rect covers right eye; toggled via opacity in JS
    var wink = svgEl('rect', { x:'43', y:'13', width:'18', height:'14', rx:'5',
                               fill:bf, opacity:'0', class:'rb-robot-wink' });
    svg.appendChild(wink);

    // Smile
    svg.appendChild(svgEl('path', {
      d:'M 26 36 Q 40 43 54 36',
      stroke:C.ac, 'stroke-width':'2', 'stroke-linecap':'round',
      fill:'none', opacity:'0.45'
    }));

    // Neck
    svg.appendChild(svgEl('rect', { x:'30', y:'46', width:'20', height:'8', rx:'4',
      fill:bf, stroke:C.ac, 'stroke-width':'1', 'stroke-opacity':'0.25' }));

    // Body
    svg.appendChild(svgEl('rect', { x:'13', y:'52', width:'54', height:'42', rx:'8',
      fill:bf, stroke:C.ac, 'stroke-width':'1.5', 'stroke-opacity':'0.45' }));

    // Chest panel — progress bar
    append(svg,
      svgEl('rect', { x:'23', y:'64', width:'34', height:'5', rx:'2.5',
                      fill:C.ac, opacity:'0.1' }),
      svgEl('rect', { x:'23', y:'64', width:'21', height:'5', rx:'2.5',
                      fill:C.ac, opacity:'0.55' })
    );

    // LEDs
    append(svg,
      svgEl('circle', { cx:'26', cy:'79', r:'3.5', fill:C.gr, filter:gf, opacity:'0.85' }),
      svgEl('circle', { cx:'38', cy:'79', r:'3.5', fill:C.ac, filter:gf, opacity:'0.85' })
    );

    // Left arm (static)
    append(svg,
      svgEl('rect',   { x:'3',  y:'54', width:'12', height:'28', rx:'6',
                        fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' }),
      svgEl('circle', { cx:'9', cy:'86', r:'7',
                        fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' })
    );

    // RIGHT (throwing) arm — class drives CSS transform-box + transform-origin
    // Bounding box: x 61–75, y 56–105 → top-center = (68, 56) = shoulder pivot ✓
    var arm = svgEl('g', { class:'rb-robot-arm' });
    append(arm,
      svgEl('rect',   { x:'61', y:'56', width:'12', height:'24', rx:'6',
                        fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.4' }),
      svgEl('rect',   { x:'63', y:'78', width:'10', height:'18', rx:'5',
                        fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.35' }),
      svgEl('circle', { cx:'68', cy:'98', r:'7',
                        fill:bf, stroke:C.ac, 'stroke-width':'1.3', 'stroke-opacity':'0.5' })
    );
    svg.appendChild(arm);

    // Legs
    append(svg,
      svgEl('rect', { x:'23', y:'92', width:'14', height:'16', rx:'6',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' }),
      svgEl('rect', { x:'43', y:'92', width:'14', height:'16', rx:'6',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' })
    );

    // Feet
    append(svg,
      svgEl('rect', { x:'18', y:'105', width:'22', height:'7', rx:'3.5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.28' }),
      svgEl('rect', { x:'40', y:'105', width:'22', height:'7', rx:'3.5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.28' })
    );

    return { svg:svg, arm:arm, wink:wink };
  }

  // ─── SVG ART: DOG ──────────────────────────────────────────────────────────
  // viewBox 0 0 78 88  |  facing LEFT (snout at low-x, tail at high-x)
  function buildDog() {
    var C = Cfg.col;
    var gId = 'rbd-g', bId = 'rbd-b';
    var svg = svgEl('svg', { viewBox:'0 0 78 88', xmlns:NS,
                              style:'overflow:visible;display:block' });
    var defs = svgEl('defs', {});
    append(defs, bodyGradDef(bId), glowFilterDef(gId));
    svg.appendChild(defs);

    var bf = 'url(#' + bId + ')';
    var gf = 'url(#' + gId + ')';

    // Snout — protrudes left (this is the bone-catch point)
    svg.appendChild(svgEl('rect', { x:'0', y:'24', width:'24', height:'16', rx:'7',
      fill:bf, stroke:C.ac, 'stroke-width':'1.3', 'stroke-opacity':'0.45' }));

    // Nose
    svg.appendChild(svgEl('circle', { cx:'3', cy:'32', r:'3.5',
      fill:C.ac, filter:gf, opacity:'0.7' }));

    // Mouth
    svg.appendChild(svgEl('path', {
      d:'M 4 38 Q 12 44 22 38',
      stroke:C.ac, 'stroke-width':'1.8', 'stroke-linecap':'round',
      fill:'none', opacity:'0.5'
    }));

    // Tongue (visible during CATCH — excited)
    var tongue = svgEl('path', {
      d:'M 5 40 Q 12 50 21 40',
      stroke:C.or, 'stroke-width':'3.5', 'stroke-linecap':'round',
      fill:'none', opacity:'0', class:'rb-dog-tongue'
    });
    svg.appendChild(tongue);

    // Head
    svg.appendChild(svgEl('rect', { x:'16', y:'10', width:'38', height:'32', rx:'9',
      fill:bf, stroke:C.ac, 'stroke-width':'1.5', 'stroke-opacity':'0.52' }));

    // Ears (slightly tilted outward)
    append(svg,
      svgEl('rect', { x:'20', y:'1',  width:'10', height:'14', rx:'5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.3', 'stroke-opacity':'0.45',
                      transform:'rotate(-9,25,8)' }),
      svgEl('rect', { x:'36', y:'1',  width:'10', height:'14', rx:'5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.3', 'stroke-opacity':'0.45',
                      transform:'rotate(9,41,8)' })
    );

    // Eyebrows (raised — excited look)
    append(svg,
      svgEl('path', { d:'M 19 12 Q 26 7 33 12',
                      stroke:C.ac, 'stroke-width':'2', 'stroke-linecap':'round',
                      fill:'none', opacity:'0.82' }),
      svgEl('path', { d:'M 35 12 Q 42 7 49 12',
                      stroke:C.ac, 'stroke-width':'2', 'stroke-linecap':'round',
                      fill:'none', opacity:'0.82' })
    );

    // Left eye socket + iris (pupil shifted LEFT — dog faces left)
    append(svg,
      svgEl('rect',   { x:'19', y:'16', width:'14', height:'11', rx:'4', fill:C.dk }),
      svgEl('circle', { cx:'23', cy:'21', r:'4.5', fill:C.ac, filter:gf, opacity:'0.9' }),
      svgEl('circle', { cx:'25', cy:'18', r:'1.5', fill:C.wh })
    );

    // Right eye socket + iris
    append(svg,
      svgEl('rect',   { x:'35', y:'16', width:'14', height:'11', rx:'4', fill:C.dk }),
      svgEl('circle', { cx:'39', cy:'21', r:'4.5', fill:C.ac, filter:gf, opacity:'0.9' }),
      svgEl('circle', { cx:'41', cy:'18', r:'1.5', fill:C.wh })
    );

    // Neck
    svg.appendChild(svgEl('rect', { x:'50', y:'30', width:'10', height:'12', rx:'4',
      fill:bf, stroke:C.ac, 'stroke-width':'1', 'stroke-opacity':'0.25' }));

    // Body
    svg.appendChild(svgEl('rect', { x:'46', y:'40', width:'28', height:'28', rx:'8',
      fill:bf, stroke:C.ac, 'stroke-width':'1.5', 'stroke-opacity':'0.45' }));

    // Chest panel
    append(svg,
      svgEl('rect', { x:'51', y:'50', width:'18', height:'4', rx:'2',
                      fill:C.ac, opacity:'0.1' }),
      svgEl('rect', { x:'51', y:'50', width:'11', height:'4', rx:'2',
                      fill:C.ac, opacity:'0.55' }),
      svgEl('circle', { cx:'53', cy:'62', r:'2.5',
                        fill:C.gr, filter:gf, opacity:'0.8' })
    );

    // Tail — wagging element; pivot at base (0%,100% of bounding box ≈ (72,46))
    // Path: M 72 46 C 80 36 88 26 82 16
    var tail = svgEl('g', { class:'rb-dog-tail' });
    append(tail,
      svgEl('path', {
        d:'M 72 46 C 80 36 88 26 82 16',
        stroke:C.ac, 'stroke-width':'5', 'stroke-linecap':'round',
        fill:'none', 'stroke-opacity':'0.65'
      }),
      svgEl('circle', { cx:'82', cy:'16', r:'4',
                        fill:C.ac, filter:gf, opacity:'0.65' })
    );
    svg.appendChild(tail);

    // Front legs (under head area)
    var fl = svgEl('g', { class:'rb-dog-frontlegs' });
    append(fl,
      svgEl('rect', { x:'22', y:'60', width:'10', height:'22', rx:'5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' }),
      svgEl('rect', { x:'34', y:'60', width:'10', height:'22', rx:'5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' })
    );
    svg.appendChild(fl);

    // Back legs (under body rear)
    var bl = svgEl('g', { class:'rb-dog-backlegs' });
    append(bl,
      svgEl('rect', { x:'50', y:'66', width:'10', height:'16', rx:'5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' }),
      svgEl('rect', { x:'62', y:'66', width:'10', height:'16', rx:'5',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.3' })
    );
    svg.appendChild(bl);

    // Feet (four)
    append(svg,
      svgEl('rect', { x:'16', y:'78', width:'18', height:'8', rx:'4',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.28' }),
      svgEl('rect', { x:'28', y:'78', width:'18', height:'8', rx:'4',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.28' }),
      svgEl('rect', { x:'44', y:'78', width:'18', height:'8', rx:'4',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.28' }),
      svgEl('rect', { x:'56', y:'78', width:'18', height:'8', rx:'4',
                      fill:bf, stroke:C.ac, 'stroke-width':'1.2', 'stroke-opacity':'0.28' })
    );

    // Carry-bone (visible only while dog runs back to robot)
    // Positioned at mouth/snout — small bone icon centered around (11, 32)
    var cb = svgEl('g', { class:'rb-carry-bone', opacity:'0' });
    append(cb,
      svgEl('rect',   { x:'5',  y:'29', width:'16', height:'6', rx:'3',
                        fill:C.dk, stroke:C.ac, 'stroke-width':'1.2' }),
      svgEl('circle', { cx:'5',  cy:'30', r:'3.5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.2' }),
      svgEl('circle', { cx:'5',  cy:'35', r:'3.5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.2' }),
      svgEl('circle', { cx:'21', cy:'30', r:'3.5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.2' }),
      svgEl('circle', { cx:'21', cy:'35', r:'3.5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.2' })
    );
    svg.appendChild(cb);

    return { svg:svg, tail:tail, fl:fl, bl:bl, tongue:tongue, carryBone:cb };
  }

  // ─── SVG ART: BONE ─────────────────────────────────────────────────────────
  // viewBox 0 0 44 20  |  classic bone icon centred at (22, 10)
  function buildBone() {
    var C = Cfg.col;
    var svg = svgEl('svg', { viewBox:'0 0 44 20', xmlns:NS,
                              style:'overflow:visible;display:block' });
    append(svg,
      svgEl('rect',   { x:'9',  y:'7',  width:'26', height:'6', rx:'3',
                        fill:C.dk, stroke:C.ac, 'stroke-width':'1.5' }),
      svgEl('circle', { cx:'9',  cy:'8',  r:'5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.5' }),
      svgEl('circle', { cx:'9',  cy:'13', r:'5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.5' }),
      svgEl('circle', { cx:'35', cy:'8',  r:'5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.5' }),
      svgEl('circle', { cx:'35', cy:'13', r:'5', fill:C.dk, stroke:C.ac, 'stroke-width':'1.5' }),
      // Highlight glint on shaft
      svgEl('rect',   { x:'14', y:'8', width:'10', height:'2.5', rx:'1.2',
                        fill:C.wh, opacity:'0.2' })
    );
    return svg;
  }

  // ─── ANIMATION HELPERS ─────────────────────────────────────────────────────
  function wait(ms) {
    return new Promise(function (res) { setTimeout(res, ms); });
  }

  var activeAnims = [];

  // go(): run a Web Animations API animation; commit inline styles on completion
  function go(el, keyframes, opts) {
    var defaults = { easing:'ease-in-out', fill:'both' };
    var merged = {};
    var k;
    for (k in defaults) merged[k] = defaults[k];
    for (k in opts)     merged[k] = opts[k];

    var a = el.animate(keyframes, merged);
    activeAnims.push(a);

    return a.finished.then(function () {
      try { a.commitStyles(); } catch (e) { /* element detached or already cancelled */ }
      try { a.cancel();       } catch (e) { /* same */ }
    }).catch(function () {
      /* AbortError — animation cancelled during resize, silently ignore */
    }).then(function () {
      activeAnims = activeAnims.filter(function (x) { return x !== a; });
    });
  }

  function cancelAll() {
    var copy = activeAnims.slice();
    activeAnims = [];
    copy.forEach(function (a) { try { a.cancel(); } catch (e) {} });
  }

  // Quadratic Bezier sample: n+1 points along the curve
  function bezierPts(x0, y0, cx, cy, x1, y1, n) {
    n = n || 14;
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, mt = 1 - t;
      pts.push({
        x: mt*mt*x0 + 2*mt*t*cx + t*t*x1,
        y: mt*mt*y0 + 2*mt*t*cy + t*t*y1
      });
    }
    return pts;
  }

  // ─── DOM STATE ─────────────────────────────────────────────────────────────
  var stage, robotDiv, dogDiv, boneDiv;
  var robotEls, dogEls;
  var geo = {};
  var running = false;
  var prefersReduced = false;

  // ─── MEASURE ───────────────────────────────────────────────────────────────
  function measure() {
    var title   = document.querySelector(Cfg.titleSelector);
    var wrapper = title.closest('.' + Cfg.wrapperClass);
    var center  = title.closest('.site-intro-center');

    var tR = title.getBoundingClientRect();
    var wR = wrapper.getBoundingClientRect();
    var cR = center ? center.getBoundingClientRect() : tR;

    var isMob = window.innerWidth <= Cfg.mobileBreak;
    var s = isMob ? Cfg.scaleMobile : Cfg.scaleDesktop;

    var rW = Cfg.rW * s,  rH = Cfg.rH * s;
    var dW = Cfg.dW * s,  dH = Cfg.dH * s;
    var bW = Cfg.bW * s,  bH = Cfg.bH * s;
    var gap = Cfg.sideGap;

    // Stage extends outward from .rb-doghero wrapper in all directions
    var exTop  = Cfg.arcHeight + 36;
    var exLeft = rW + gap + 20;
    var exRight= dW + gap + 20;
    var exBot  = Cfg.belowGap + dH + 20;

    // Stage top-left in viewport coords
    var soX = wR.left - exLeft;
    var soY = wR.top  - exTop;

    // Robot: left of title, vertically centred on title midpoint
    var robotX = tR.left  - soX - rW - gap;
    var robotY = tR.top   - soY + (tR.height - rH) / 2;

    // Dog: right of title, same vertical alignment
    var dogIdleX = tR.right - soX + gap;
    var dogIdleY = tR.top   - soY + (tR.height - dH) / 2;

    // Robot hand at THROW pose (viewBox coords scaled to display)
    var handX = robotX + Cfg.handThrowVX * s;
    var handY = robotY + Cfg.handThrowVY * s;

    // Dog mouth (centre of bone catch point)
    var mouthX = dogIdleX + Cfg.mouthVX * s;
    var mouthY = dogIdleY + Cfg.mouthVY * s;

    // Bone arc control point: midpoint x, arcHeight above title top
    var arcCX = (handX + mouthX) / 2;
    var arcCY = tR.top - soY - Cfg.arcHeight;

    // Dog run path — below the full .site-intro-center block
    var runY      = cR.bottom - soY + Cfg.belowGap;
    var runStartX = dogIdleX;
    var runEndX   = robotX + rW + gap;

    geo = {
      s:s, rW:rW, rH:rH, dW:dW, dH:dH, bW:bW, bH:bH,
      robotX:robotX, robotY:robotY,
      dogIdleX:dogIdleX, dogIdleY:dogIdleY,
      handX:handX, handY:handY,
      mouthX:mouthX, mouthY:mouthY,
      arcCX:arcCX, arcCY:arcCY,
      runY:runY, runStartX:runStartX, runEndX:runEndX,
      exTop:exTop, exLeft:exLeft, exRight:exRight, exBot:exBot
    };
  }

  // ─── PLACE ─────────────────────────────────────────────────────────────────
  function place() {
    var g = geo;

    // Size and position stage
    Object.assign(stage.style, {
      top    : '-' + g.exTop   + 'px',
      left   : '-' + g.exLeft  + 'px',
      right  : '-' + g.exRight + 'px',
      bottom : '-' + g.exBot   + 'px'
    });

    // Size the container divs
    robotDiv.style.width  = g.rW + 'px';
    robotDiv.style.height = g.rH + 'px';
    dogDiv.style.width    = g.dW + 'px';
    dogDiv.style.height   = g.dH + 'px';
    boneDiv.style.width   = g.bW + 'px';
    boneDiv.style.height  = g.bH + 'px';

    // Size the SVGs inside
    robotDiv.querySelector('svg').setAttribute('width',  g.rW);
    robotDiv.querySelector('svg').setAttribute('height', g.rH);
    dogDiv.querySelector('svg').setAttribute('width',    g.dW);
    dogDiv.querySelector('svg').setAttribute('height',   g.dH);
    boneDiv.querySelector('svg').setAttribute('width',   g.bW);
    boneDiv.querySelector('svg').setAttribute('height',  g.bH);

    // Positions (all elements at stage origin; transform moves them into place)
    robotDiv.style.transform = 'translate(' + g.robotX   + 'px,' + g.robotY   + 'px)';
    dogDiv.style.transform   = 'translate(' + g.dogIdleX + 'px,' + g.dogIdleY + 'px)';
    boneDiv.style.transform  =
      'translate(' + (g.handX - g.bW/2) + 'px,' + (g.handY - g.bH/2) + 'px)';
    boneDiv.style.opacity    = '0';

    // Arm rest pose
    robotEls.arm.style.transform = 'rotate(' + Cfg.armRest + 'deg)';

    // Reset dog sub-elements
    dogEls.carryBone.setAttribute('opacity', '0');
    dogEls.tongue.setAttribute('opacity', '0');
    dogEls.tail.style.transform = '';
    dogEls.fl.style.transform   = '';
    dogEls.bl.style.transform   = '';
  }

  // ─── STATE MACHINE ─────────────────────────────────────────────────────────

  async function throwPhase() {
    var g = geo;

    // 1. Wind-up: arm pulls back
    await go(robotEls.arm,
      [{ transform: 'rotate(' + Cfg.armRest   + 'deg)' },
       { transform: 'rotate(' + Cfg.armWindup + 'deg)' }],
      { duration: PH.windUp, easing: 'ease-in' });

    // 2. Arm snaps forward (non-awaited — concurrent with bone flight below)
    robotEls.wink.style.opacity = '1';
    var snapDone = go(robotEls.arm,
      [{ transform: 'rotate(' + Cfg.armWindup + 'deg)' },
       { transform: 'rotate(' + Cfg.armThrow  + 'deg)' }],
      { duration: PH.snap, easing: 'cubic-bezier(0.1,0,0.15,1)' });

    // 3. After short delay the bone launches and arcs to the dog's mouth
    await wait(PH.snapDelay);

    var pts = bezierPts(
      g.handX, g.handY,
      g.arcCX, g.arcCY,
      g.mouthX, g.mouthY
    );
    var boneKf = pts.map(function (p, i) {
      var deg = i * (360 / pts.length);
      return {
        transform: 'translate(' + (p.x - g.bW/2) + 'px,' + (p.y - g.bH/2) + 'px)' +
                   ' rotate(' + deg + 'deg)',
        opacity: '1'
      };
    });

    boneDiv.style.opacity = '1';
    var flightDone = go(boneDiv, boneKf,
      { duration: PH.flight, easing: 'linear' });

    // 4. Arm drifts back to rest (concurrent with flight)
    var armReturnDone = go(robotEls.arm,
      [{ transform: 'rotate(' + Cfg.armThrow + 'deg)' },
       { transform: 'rotate(' + Cfg.armRest  + 'deg)' }],
      { duration: PH.armReturn, easing: 'ease-out' });

    // Wait for snap + full flight to complete
    await Promise.all([snapDone, flightDone, armReturnDone]);

    robotEls.wink.style.opacity = '0';
  }

  async function catchPhase() {
    var g = geo;

    // Bone arrived — switch to carry-bone in the dog SVG
    boneDiv.style.opacity = '0';
    dogEls.carryBone.setAttribute('opacity', '1');
    dogEls.tongue.setAttribute('opacity', '0.9');

    // Dog bounces + tail wags (concurrent)
    var bounceDone = go(dogDiv,
      [{ transform: 'translate(' + g.dogIdleX + 'px,' + g.dogIdleY + 'px)' },
       { transform: 'translate(' + g.dogIdleX + 'px,' + (g.dogIdleY - 10) + 'px)' },
       { transform: 'translate(' + g.dogIdleX + 'px,' + g.dogIdleY + 'px)' }],
      { duration: PH.catch_, easing: 'ease-in-out' });

    var tailDone = go(dogEls.tail,
      [{ transform: 'rotate(0deg)' },
       { transform: 'rotate(28deg)' },
       { transform: 'rotate(-22deg)' },
       { transform: 'rotate(22deg)' },
       { transform: 'rotate(0deg)' }],
      { duration: PH.catch_, easing: 'ease-in-out' });

    await Promise.all([bounceDone, tailDone]);
  }

  async function returnPhase() {
    var g = geo;

    // Dog drops from idle position to run-path Y (below the content block)
    await go(dogDiv,
      [{ transform: 'translate(' + g.dogIdleX  + 'px,' + g.dogIdleY + 'px)' },
       { transform: 'translate(' + g.runStartX + 'px,' + g.runY     + 'px)' }],
      { duration: PH.runDrop, easing: 'ease-in' });

    // Dog runs right → left, carrying the bone (carryBone moves with the SVG automatically)
    var runDone = go(dogDiv,
      [{ transform: 'translate(' + g.runStartX + 'px,' + g.runY + 'px)' },
       { transform: 'translate(' + g.runEndX   + 'px,' + g.runY + 'px)' }],
      { duration: PH.run, easing: 'ease-in-out' });

    // Leg alternation for the run duration (8 half-swings over PH.run ms)
    var legKf = [
      { transform: 'rotate(0deg)'   },
      { transform: 'rotate(20deg)'  },
      { transform: 'rotate(0deg)'   },
      { transform: 'rotate(-20deg)' },
      { transform: 'rotate(0deg)'   },
      { transform: 'rotate(20deg)'  },
      { transform: 'rotate(0deg)'   },
      { transform: 'rotate(-20deg)' },
      { transform: 'rotate(0deg)'   }
    ];
    var legKfRev = legKf.slice().reverse();

    var flDone = go(dogEls.fl, legKf,    { duration: PH.run, easing: 'linear' });
    var blDone = go(dogEls.bl, legKfRev, { duration: PH.run, easing: 'linear' });

    await Promise.all([runDone, flDone, blDone]);
  }

  async function handoffPhase() {
    // Dog arrived near robot — hide carry-bone and tongue
    dogEls.carryBone.setAttribute('opacity', '0');
    dogEls.tongue.setAttribute('opacity', '0');

    // Brief pause at the robot
    await wait(PH.handoff);

    // Dog fades out
    await go(dogDiv,
      [{ opacity: '1' }, { opacity: '0' }],
      { duration: PH.dogFade, easing: 'ease-in' });

    // Instantly reposition dog to idle (right side of title) — invisible so no flicker
    dogDiv.style.transform = 'translate(' + geo.dogIdleX + 'px,' + geo.dogIdleY + 'px)';

    // Reset leg and tail transforms
    dogEls.fl.style.transform   = '';
    dogEls.bl.style.transform   = '';
    dogEls.tail.style.transform = '';

    // Dog fades back in
    await go(dogDiv,
      [{ opacity: '0' }, { opacity: '1' }],
      { duration: PH.dogFadeIn, easing: 'ease-out' });

    // Final idle pause before next throw
    await wait(PH.idle);
  }

  async function runLoop() {
    while (running) {
      // Pause loop when viewport is too narrow (CSS hides stage anyway)
      if (window.innerWidth <= Cfg.mobileBreak) {
        await wait(400);
        continue;
      }
      await throwPhase();   if (!running) break;
      await catchPhase();   if (!running) break;
      await returnPhase();  if (!running) break;
      await handoffPhase();
    }
  }

  // ─── REDUCED MOTION ────────────────────────────────────────────────────────
  function staticPose() {
    var g = geo;
    // Robot arm at rest, bone visible in hand
    robotEls.arm.style.transform = 'rotate(' + Cfg.armRest + 'deg)';
    boneDiv.style.transform =
      'translate(' + (g.handX - g.bW/2) + 'px,' + (g.handY - g.bH/2) + 'px)';
    boneDiv.style.opacity = '0.85';
    // Dog in idle position, tail slightly raised
    dogDiv.style.transform = 'translate(' + g.dogIdleX + 'px,' + g.dogIdleY + 'px)';
    dogEls.tail.style.transform = 'rotate(12deg)';
  }

  // ─── INIT ──────────────────────────────────────────────────────────────────
  function init() {
    var title = document.querySelector(Cfg.titleSelector);
    if (!title) return;

    var wrapper = title.closest('.' + Cfg.wrapperClass);
    if (!wrapper) return;

    prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build stage div
    stage = document.createElement('div');
    stage.className = 'rb-doghero-stage';
    stage.setAttribute('aria-hidden', 'true');
    Object.assign(stage.style, {
      position     : 'absolute',
      pointerEvents: 'none',
      overflow     : 'visible',
      zIndex       : String(Cfg.zIndex)
    });
    if (Cfg.debug) wrapper.classList.add('rb-doghero--debug');
    wrapper.appendChild(stage);

    // Robot
    robotDiv = document.createElement('div');
    robotDiv.className = 'rb-doghero-robot';
    robotEls = buildRobot();
    robotDiv.appendChild(robotEls.svg);
    stage.appendChild(robotDiv);

    // Dog
    dogDiv = document.createElement('div');
    dogDiv.className = 'rb-doghero-dog';
    dogEls = buildDog();
    dogDiv.appendChild(dogEls.svg);
    stage.appendChild(dogDiv);

    // Bone
    boneDiv = document.createElement('div');
    boneDiv.className = 'rb-doghero-bone';
    boneDiv.appendChild(buildBone());
    stage.appendChild(boneDiv);

    // Initial geometry + placement
    measure();
    place();

    if (prefersReduced) {
      staticPose();
      return;
    }

    running = true;
    runLoop();
  }

  // ─── RESIZE ────────────────────────────────────────────────────────────────
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!stage) return;
      running = false;
      cancelAll();
      measure();
      place();
      if (prefersReduced) {
        staticPose();
      } else {
        running = true;
        runLoop();
      }
    }, 200);
  });

  // ─── BOOT ──────────────────────────────────────────────────────────────────
  // Use window load (after fonts paint) for reliable getBoundingClientRect()
  function boot() {
    try { init(); } catch (err) { console.error('[rb-doghero] init failed:', err); }
  }

  if (document.readyState === 'complete') {
    // Page (and fonts) already fully loaded
    boot();
  } else {
    // Wait for fonts to load so layout is final before measuring geometry
    window.addEventListener('load', boot);
  }

})();
