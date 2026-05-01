(function(){
  var canvas = document.getElementById('three-bg');
  if (!window.THREE) { canvas.style.display='none'; return; }

  var renderer = new THREE.WebGLRenderer({ canvas:canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 1, 2000);
  camera.position.z = 500;

  // Theme detection
  function isLight(){ return document.documentElement.getAttribute('data-theme')==='light'; }
  var lightMode = isLight();

  var offCanvas = document.createElement('canvas');
  var RES = 200;
  offCanvas.width = RES; offCanvas.height = Math.round(RES * (795/714));
  var offCtx = offCanvas.getContext('2d');

  var img = new Image();
  var svgBlob = new Blob(['<svg viewBox="0 0 714 795" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M388.515 730.355C406.274 712.516 406.274 683.593 388.515 665.754C370.755 647.915 341.961 647.915 324.201 665.754C306.442 683.593 306.442 712.516 324.201 730.355C341.961 748.195 370.755 748.195 388.515 730.355Z"/><path fill="white" d="M367.98 447.263C395.209 440.807 412.072 413.402 405.646 386.052C399.219 358.701 371.936 341.762 344.708 348.217C317.479 354.673 300.616 382.078 307.042 409.428C313.469 436.779 340.752 453.718 367.98 447.263Z"/><path fill="white" d="M388.514 130.137C406.273 112.298 406.273 83.3749 388.514 65.5356C370.754 47.6964 341.96 47.6964 324.201 65.5356C306.441 83.3749 306.441 112.298 324.201 130.137C341.96 147.976 370.754 147.976 388.514 130.137Z"/><path fill="white" d="M519.58 79.0451C508.16 73.0998 496.377 67.7534 484.285 63.0549C487.266 74.1451 488.859 85.8016 488.859 97.8391C488.859 98.7701 488.848 99.7011 488.832 100.627C488.642 109.92 487.504 118.98 485.51 127.707C483.553 136.282 480.772 144.541 477.255 152.392C473.802 160.107 469.634 167.429 464.843 174.273C459.705 181.623 453.84 188.423 447.363 194.575C436.469 204.92 423.834 213.424 409.937 219.598L373.639 194.962C386.512 192.664 398.523 187.851 409.141 181.04C417.742 175.525 425.433 168.703 431.932 160.847C437.406 154.232 442.035 146.882 445.656 138.966C449.2 131.224 451.77 122.938 453.217 114.27C454.106 108.918 454.572 103.431 454.572 97.8282C454.572 94.2404 454.382 90.6906 454.008 87.2008C452.566 73.666 448.398 60.9533 442.068 49.6181C425.244 19.5269 393.162-0.818848 356.354-0.818848C319.546-0.818848 287.828 19.2928 270.934 49.1117C264.533 60.4089 260.289 73.1052 258.766 86.6237C258.348 90.3041 258.137 94.0498 258.137 97.8391C258.137 103.24 258.57 108.532 259.4 113.699C260.793 122.372 263.318 130.669 266.814 138.433C270.381 146.37 274.972 153.748 280.408 160.401C286.863 168.295 294.511 175.166 303.075 180.73L305.687 182.374L358.967 218.531L375.26 229.588L410.669 253.62L435.07 270.176C437.585 271.771 440.003 273.416 442.366 275.131C479.992 302.32 504.464 346.654 504.464 396.726C504.464 459.766 465.667 513.699 410.75 535.759L379.357 515.103C434.116 504.34 475.428 455.874 475.428 397.717C475.428 354.777 452.908 317.129 419.081 296.026L367.297 262.494L344.094 247.473C344.094 247.473 278.365 207.114 264.755 194.031C258.316 187.846 252.495 181.008 247.394 173.631C242.641 166.754 238.527 159.41 235.118 151.673C231.643 143.795 228.912 135.525 227.004 126.934C225.063 118.196 223.979 109.131 223.844 99.8372C223.833 99.1784 223.828 98.5088 223.828 97.8446C223.828 85.5293 225.492 73.6061 228.608 62.2872C216.483 66.9149 204.673 72.1906 193.22 78.0705C77.5557 137.42-1.65356 258.275-1.65356 397.717C-1.65356 537.159 77.6044 658.095 193.35 717.428C204.5 723.145 215.985 728.29 227.768 732.819C224.635 721.473 222.96 709.517 222.96 697.17C222.96 696.511 222.96 695.857 222.977 695.204C223.112 685.9 224.191 676.824 226.137 668.08C228.039 659.489 230.776 651.208 234.25 643.33C237.329 636.345 240.993 629.67 245.177 623.382L273.839 642.916C270.966 647.321 268.435 651.965 266.283 656.821C262.836 664.607 260.359 672.92 259.015 681.609C258.24 686.591 257.839 691.692 257.839 696.892C257.839 700.904 258.077 704.857 258.543 708.744C260.159 722.323 264.522 735.052 271.058 746.36C288.061 775.77 319.758 795.55 356.056 795.55C392.355 795.55 424.295 775.618 441.244 746.022C447.737 734.692 452.051 721.942 453.612 708.352C454.051 704.59 454.268 700.768 454.268 696.892C454.268 691.556 453.845 686.324 453.038 681.217C451.661 672.534 449.146 664.225 445.667 656.456C442.116 648.529 437.553 641.158 432.149 634.51C426.501 627.568 419.932 621.411 412.626 616.239L409.666 614.219C407.742 612.961 405.802 611.78 403.818 610.674L352.999 575.607L337.812 565.257L302.137 540.943L279.779 525.704C274.397 522.519 269.237 518.991 264.316 515.163C229.101 487.783 206.445 444.92 206.445 396.742C206.445 333.827 245.085 279.976 299.834 257.834L333.872 280.237C278.852 290.794 237.264 339.385 237.264 397.728C237.264 439.165 258.24 475.68 290.105 497.153L293.373 499.282H293.384L343.996 532.204L365.357 546.098C365.357 546.098 430.073 585.723 443.428 597.646C451.314 604.685 458.36 612.656 464.393 621.389C469.146 628.26 473.26 635.61 476.675 643.341C480.149 651.219 482.881 659.5 484.789 668.091C486.735 676.835 487.819 685.91 487.949 695.215C487.96 695.868 487.965 696.522 487.965 697.18C487.965 709.534 486.29 721.484 483.157 732.83C495.613 728.039 507.732 722.568 519.477 716.454C634.188 656.778 712.579 536.451 712.579 397.728C712.579 259.004 634.242 138.754 519.586 79.0559L519.58 79.0451Z"/></svg>'], {type:'image/svg+xml'});
  var url = URL.createObjectURL(svgBlob);

  img.onload = function() {
    offCtx.drawImage(img, 0, 0, RES, Math.round(RES * (795/714)));
    var imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    var rawPoints = [];
    var step = 2;
    for (var y = 0; y < offCanvas.height; y += step) {
      for (var x = 0; x < offCanvas.width; x += step) {
        var idx = (y * offCanvas.width + x) * 4;
        if (imageData.data[idx] > 128) {
          rawPoints.push(
            (x - offCanvas.width/2) * 2.5,
            -(y - offCanvas.height/2) * 2.5,
            (Math.random() - 0.5) * 60
          );
        }
      }
    }

    var N = rawPoints.length / 3;
    var i, r;
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(rawPoints);
    var colors = new Float32Array(N * 3);

    for (i = 0; i < N; i++) {
      r = Math.random();
      if (r < 0.6) { colors[i*3]=0.545; colors[i*3+1]=0.361; colors[i*3+2]=0.965; }
      else if (r < 0.85) { colors[i*3]=0.388; colors[i*3+1]=0.4; colors[i*3+2]=0.945; }
      else { colors[i*3]=0.91; colors[i*3+1]=0.475; colors[i*3+2]=0.976; }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var logoPos = new Float32Array(rawPoints);

    var nebulaPos = new Float32Array(N * 3);
    for (i = 0; i < N; i++) {
      var phi = Math.acos(2 * (i / N) - 1);
      var theta = 2.399963 * i;
      var rad = 200 + Math.sin(phi * 5 + theta * 3) * 50;
      nebulaPos[i*3] = rad * Math.sin(phi) * Math.cos(theta);
      nebulaPos[i*3+1] = rad * Math.cos(phi);
      nebulaPos[i*3+2] = rad * Math.sin(phi) * Math.sin(theta);
    }

    var auroraPos = new Float32Array(N * 3);
    for (i = 0; i < N; i++) {
      var t = i / N;
      var ax = (t - 0.5) * 800;
      var phase = t * Math.PI * 4;
      var ay = Math.sin(phase) * 120 + Math.sin(phase * 2.5) * 40;
      var az = Math.cos(phase * 1.3) * 80 + (Math.random() - 0.5) * 40;
      auroraPos[i*3] = ax; auroraPos[i*3+1] = ay; auroraPos[i*3+2] = az;
    }

    var helixPos = new Float32Array(N * 3);
    for (i = 0; i < N; i++) {
      var ht = (i / N) * Math.PI * 8;
      var hh = (i / N - 0.5) * 600;
      var hr = 100 + Math.sin(ht * 3) * 15;
      var strand = i % 2 === 0 ? 1 : -1;
      helixPos[i*3] = Math.cos(ht) * hr * strand;
      helixPos[i*3+1] = hh;
      helixPos[i*3+2] = Math.sin(ht) * hr * strand;
    }

    var starPos = new Float32Array(N * 3);
    for (i = 0; i < N; i++) {
      var sphi = Math.acos(2 * Math.random() - 1);
      var stheta = Math.random() * Math.PI * 2;
      var sr = 150 + Math.pow(Math.random(), 0.5) * 400;
      starPos[i*3] = sr * Math.sin(sphi) * Math.cos(stheta);
      starPos[i*3+1] = sr * Math.sin(sphi) * Math.sin(stheta);
      starPos[i*3+2] = sr * Math.cos(sphi);
    }

    var targets = [logoPos, nebulaPos, auroraPos, helixPos, starPos];
    var targetCount = targets.length;

    var mat = new THREE.PointsMaterial({
      size: lightMode ? 2 : 1.5,
      vertexColors: true, transparent: true,
      opacity: lightMode ? 0.5 : 0.4,
      blending: lightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true
    });

    var mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    var scrollProgress = 0;
    var smoothScroll = 0;

    window.addEventListener('scroll', function() {
      var maxScroll = document.documentElement.scrollHeight - innerHeight;
      scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
    }, { passive: true });

    var time = 0;
    var pos = geo.attributes.position.array;
    var col = geo.attributes.color.array;

    // Dark palettes (bright colors on dark bg)
    var darkPalettes = [
      [[0.545,0.361,0.965],[0.388,0.4,0.945],[0.655,0.546,0.98]],
      [[0.4,0.35,0.96],[0.3,0.5,0.95],[0.55,0.4,0.98]],
      [[0.0,0.75,0.3],[0.2,0.65,0.5],[0.35,0.85,0.5]],
      [[0.91,0.475,0.976],[0.7,0.4,0.96],[0.95,0.55,0.85]],
      [[0.6,0.55,0.97],[0.5,0.5,0.94],[0.75,0.65,0.88]]
    ];

    // Light palettes (deep saturated on light bg)
    var lightPalettes = [
      [[0.29,0.13,0.72],[0.22,0.18,0.68],[0.38,0.22,0.78]],
      [[0.2,0.15,0.7],[0.15,0.25,0.65],[0.3,0.18,0.75]],
      [[0.0,0.45,0.18],[0.1,0.4,0.28],[0.15,0.5,0.22]],
      [[0.6,0.2,0.72],[0.45,0.18,0.68],[0.65,0.25,0.6]],
      [[0.32,0.25,0.7],[0.28,0.22,0.65],[0.4,0.3,0.6]]
    ];

    var palettes = lightMode ? lightPalettes : darkPalettes;

    // Listen for theme changes
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'data-theme') {
          lightMode = isLight();
          palettes = lightMode ? lightPalettes : darkPalettes;
          mat.blending = lightMode ? THREE.NormalBlending : THREE.AdditiveBlending;
          mat.size = lightMode ? 2 : 1.5;
          mat.needsUpdate = true;
        }
      });
    }).observe(document.documentElement, { attributes: true });

    function smoothstep(x) { return x * x * (3 - 2 * x); }

    function animate() {
      requestAnimationFrame(animate);
      time += 0.002;

      smoothScroll += (scrollProgress - smoothScroll) * 0.035;

      var totalT = targetCount - 1;
      var rawState = smoothScroll * totalT;
      var si = Math.min(Math.floor(rawState), totalT - 1);
      if (si < 0) si = 0;
      var blend = smoothstep(Math.min(Math.max(rawState - si, 0), 1));

      var from = targets[si];
      var to = targets[Math.min(si + 1, totalT)];
      var fp = palettes[si];
      var tp = palettes[Math.min(si + 1, totalT)];

      var baseOp = lightMode ? 0.4 : 0.35;

      for (i = 0; i < N; i++) {
        var i3 = i * 3;
        var tx = from[i3]   + (to[i3]   - from[i3])   * blend;
        var ty = from[i3+1] + (to[i3+1] - from[i3+1]) * blend;
        var tz = from[i3+2] + (to[i3+2] - from[i3+2]) * blend;

        var fs = 1 + smoothScroll * 1.5;
        pos[i3]   = tx + Math.sin(time + i * 0.008) * 2.5 * fs;
        pos[i3+1] = ty + Math.cos(time + i * 0.012) * 2.5 * fs;
        pos[i3+2] = tz + Math.sin(time * 0.4 + i * 0.015) * 4 * fs;

        var ci = i % 3;
        var fc = fp[ci]; var tc = tp[ci];
        col[i3]   = fc[0] + (tc[0] - fc[0]) * blend;
        col[i3+1] = fc[1] + (tc[1] - fc[1]) * blend;
        col[i3+2] = fc[2] + (tc[2] - fc[2]) * blend;
      }
      
      // Mouse repulsion
      var mc = window.__cursorMouse;
      if (mc && mc.active) {
        var visH = 2 * Math.tan(Math.PI/6) * 500;
        var visW = visH * (innerWidth/innerHeight);
        var mx = mc.ndcX * visW/2;
        var my = mc.ndcY * visH/2;
        var rR = 80, rS = 35;
        for (var ri = 0; ri < N; ri++) {
          var ri3 = ri * 3;
          var dx = pos[ri3] - mx;
          var dy = pos[ri3+1] - my;
          var d2 = dx*dx + dy*dy;
          if (d2 < rR*rR) {
            var d = Math.sqrt(d2) || 1;
            var f = (1 - d/rR) * rS;
            pos[ri3] += (dx/d) * f;
            pos[ri3+1] += (dy/d) * f;
          }
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;

      mesh.rotation.y = smoothScroll * Math.PI * 0.4;
      mesh.rotation.x = Math.sin(smoothScroll * Math.PI) * 0.12;
      mesh.rotation.z = Math.sin(time * 0.25) * 0.015;

      mat.opacity = baseOp + Math.sin(smoothScroll * Math.PI) * 0.12;

      renderer.render(scene, camera);
    }
    animate();
    URL.revokeObjectURL(url);
  };
  img.src = url;

  window.addEventListener('resize', function() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
