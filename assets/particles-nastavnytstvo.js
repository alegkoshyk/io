// НАСТАВНИЦТВО: spiral → crystal lattice → expanding sphere → constellation → DNA helix
(function(){
  var canvas=document.getElementById('three-bg');
  function isLight(){return document.documentElement.getAttribute('data-theme')==='light'}
  var lightMode=isLight();
  if(!window.THREE){canvas.style.display='none';return}
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
  var scene=new THREE.Scene();var camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,1,2000);camera.position.z=500;
  var N=3000,i;
  var geo=new THREE.BufferGeometry();var positions=new Float32Array(N*3);var colors=new Float32Array(N*3);
  for(i=0;i<N;i++){positions[i*3]=(Math.random()-.5)*600;positions[i*3+1]=(Math.random()-.5)*600;positions[i*3+2]=(Math.random()-.5)*200;
    var r=Math.random();colors[i*3]=r<.6?.545:.388;colors[i*3+1]=r<.6?.361:.4;colors[i*3+2]=r<.6?.965:.945}
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));

  // 0: Ascending spiral
  var t0=new Float32Array(N*3);
  for(i=0;i<N;i++){var a=(i/N)*Math.PI*12,h=(i/N-.5)*600,rad=80+Math.sin(a*2)*30;
    t0[i*3]=Math.cos(a)*rad;t0[i*3+1]=h;t0[i*3+2]=Math.sin(a)*rad}
  // 1: Crystal lattice
  var t1=new Float32Array(N*3);var side=Math.ceil(Math.pow(N,1/3));
  for(i=0;i<N;i++){var ix=i%side,iy=Math.floor(i/side)%side,iz=Math.floor(i/(side*side));
    t1[i*3]=(ix-side/2)*30+Math.sin(iy*.5)*10;t1[i*3+1]=(iy-side/2)*30;t1[i*3+2]=(iz-side/2)*30+Math.cos(ix*.5)*10}
  // 2: Expanding sphere
  var t2=new Float32Array(N*3);
  for(i=0;i<N;i++){var phi=Math.acos(2*(i/N)-1),theta=2.399963*i,rad2=180+Math.sin(phi*7)*40;
    t2[i*3]=rad2*Math.sin(phi)*Math.cos(theta);t2[i*3+1]=rad2*Math.cos(phi);t2[i*3+2]=rad2*Math.sin(phi)*Math.sin(theta)}
  // 3: Constellation (clustered groups)
  var t3=new Float32Array(N*3);var centers=[[0,150,0],[-200,-50,0],[200,-50,0],[0,-200,0],[-150,50,100],[150,50,-100],[0,0,-150]];
  for(i=0;i<N;i++){var c=centers[i%centers.length];t3[i*3]=c[0]+(Math.random()-.5)*120;t3[i*3+1]=c[1]+(Math.random()-.5)*120;t3[i*3+2]=c[2]+(Math.random()-.5)*80}
  // 4: DNA double helix
  var t4=new Float32Array(N*3);
  for(i=0;i<N;i++){var ht=(i/N)*Math.PI*10,hh=(i/N-.5)*700,hr=110,strand=i%2===0?1:-1;
    t4[i*3]=Math.cos(ht)*hr*strand;t4[i*3+1]=hh;t4[i*3+2]=Math.sin(ht)*hr*strand}

  var targets=[t0,t1,t2,t3,t4];var TC=targets.length;
  var mat=new THREE.PointsMaterial({size:lightMode?1.8:1.4,vertexColors:true,transparent:true,opacity:lightMode?.45:.35,blending:lightMode?THREE.NormalBlending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  var mesh=new THREE.Points(geo,mat);scene.add(mesh);
  var scrollP=0,smoothS=0,time=0;
  var darkPal=[[[.545,.361,.965],[.655,.546,.98],[.4,.35,.96]],[[.4,.5,.95],[.3,.55,.9],[.5,.45,.97]],[[.545,.361,.965],[.388,.4,.945],[.655,.546,.98]],[[.7,.55,.98],[.5,.6,.95],[.6,.5,.97]],[[.91,.475,.976],[.7,.4,.96],[.55,.4,.98]]];
    var lightPal=[[[.29,.13,.72],[.38,.22,.78],[.2,.15,.7]],[[.2,.25,.68],[.15,.28,.62],[.25,.2,.7]],[[.29,.13,.72],[.22,.18,.68],[.38,.22,.78]],[[.4,.25,.72],[.28,.28,.65],[.32,.22,.7]],[[.6,.2,.72],[.45,.18,.68],[.3,.18,.75]]];
    var palettes=lightMode?lightPal:darkPal;
  new MutationObserver(function(m){m.forEach(function(mu){if(mu.attributeName==='data-theme'){lightMode=isLight();palettes=lightMode?lightPal:darkPal;mat.blending=lightMode?THREE.NormalBlending:THREE.AdditiveBlending;mat.size=lightMode?1.8:1.4;mat.needsUpdate=true}})}).observe(document.documentElement,{attributes:true});
    function ss(x){return x*x*(3-2*x)}
  window.addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;scrollP=m>0?Math.min(scrollY/m,1):0},{passive:true});
  var pos=geo.attributes.position.array,col=geo.attributes.color.array;
  function animate(){requestAnimationFrame(animate);time+=.002;smoothS+=(scrollP-smoothS)*.035;
    var raw=smoothS*(TC-1),si=Math.min(Math.floor(raw),TC-2);if(si<0)si=0;var bl=ss(Math.min(Math.max(raw-si,0),1));
    var from=targets[si],to=targets[Math.min(si+1,TC-1)],fp=palettes[si],tp=palettes[Math.min(si+1,TC-1)];
    for(i=0;i<N;i++){var i3=i*3,fs=1+smoothS*1.5;
      pos[i3]=from[i3]+(to[i3]-from[i3])*bl+Math.sin(time+i*.008)*2.5*fs;
      pos[i3+1]=from[i3+1]+(to[i3+1]-from[i3+1])*bl+Math.cos(time+i*.012)*2.5*fs;
      pos[i3+2]=from[i3+2]+(to[i3+2]-from[i3+2])*bl+Math.sin(time*.4+i*.015)*4*fs;
      var ci=i%3,fc=fp[ci],tc=tp[ci];col[i3]=fc[0]+(tc[0]-fc[0])*bl;col[i3+1]=fc[1]+(tc[1]-fc[1])*bl;col[i3+2]=fc[2]+(tc[2]-fc[2])*bl}
    
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
      geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;
    mesh.rotation.y=smoothS*Math.PI*.4;mesh.rotation.x=Math.sin(smoothS*Math.PI)*.12;mesh.rotation.z=Math.sin(time*.25)*.015;
    mat.opacity=.3+Math.sin(smoothS*Math.PI)*.12;renderer.render(scene,camera)}
  animate();
  window.addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
})();
