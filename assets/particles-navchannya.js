// НАВЧАННЯ: seed → sprouting roots → growing tree → branching → blooming canopy
(function(){
  var canvas=document.getElementById('three-bg');
  function isLight(){return document.documentElement.getAttribute('data-theme')==='light'}
  var lightMode=isLight();
  if(!window.THREE){canvas.style.display='none';return}
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
  var scene=new THREE.Scene();var camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,1,2000);camera.position.z=500;
  var N=2800,i;
  var geo=new THREE.BufferGeometry();var positions=new Float32Array(N*3);var colors=new Float32Array(N*3);
  for(i=0;i<N;i++){positions[i*3]=(Math.random()-.5)*20;positions[i*3+1]=(Math.random()-.5)*20;positions[i*3+2]=(Math.random()-.5)*20;
    var r=Math.random();colors[i*3]=r<.5?0:.2;colors[i*3+1]=r<.5?.75:.65;colors[i*3+2]=r<.5?.3:.5}
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));

  // 0: Seed (tight cluster at bottom)
  var t0=new Float32Array(N*3);
  for(i=0;i<N;i++){var phi=Math.acos(2*Math.random()-1),th=Math.random()*Math.PI*2,r=20+Math.random()*15;
    t0[i*3]=r*Math.sin(phi)*Math.cos(th);t0[i*3+1]=-200+r*Math.sin(phi)*Math.sin(th);t0[i*3+2]=r*Math.cos(phi)}
  // 1: Roots spreading down + stem up
  var t1=new Float32Array(N*3);
  for(i=0;i<N;i++){var t=i/N;if(t<.4){var ra=t/.4*Math.PI*5,rr=t/.4*200,rd=-200-t/.4*100;
    t1[i*3]=Math.cos(ra)*rr*(Math.random()*.3+.1);t1[i*3+1]=rd;t1[i*3+2]=Math.sin(ra)*rr*(Math.random()*.3+.1)}
    else{var st=(t-.4)/.6;t1[i*3]=(Math.random()-.5)*20*(1-st*.7);t1[i*3+1]=-200+st*400;t1[i*3+2]=(Math.random()-.5)*20*(1-st*.7)}}
  // 2: Tree trunk + first branches
  var t2=new Float32Array(N*3);
  for(i=0;i<N;i++){var t=i/N;if(t<.3){t2[i*3]=(Math.random()-.5)*15;t2[i*3+1]=-200+t/.3*300;t2[i*3+2]=(Math.random()-.5)*15}
    else{var ba=(t-.3)/.7*Math.PI*3,bl=50+Math.random()*150,bh=100+Math.sin(ba)*80;
      t2[i*3]=Math.cos(ba)*bl+(Math.random()-.5)*30;t2[i*3+1]=bh+(Math.random()-.5)*60;t2[i*3+2]=Math.sin(ba)*bl+(Math.random()-.5)*30}}
  // 3: Full branching (wider)
  var t3=new Float32Array(N*3);
  for(i=0;i<N;i++){var t=i/N;if(t<.15){t3[i*3]=(Math.random()-.5)*12;t3[i*3+1]=-200+t/.15*250;t3[i*3+2]=(Math.random()-.5)*12}
    else{var ba=(t-.15)/.85*Math.PI*6,layer=Math.floor(Math.random()*3),bl=[80,150,230][layer],bh=[50,120,180][layer]+Math.random()*60;
      t3[i*3]=Math.cos(ba)*bl+(Math.random()-.5)*40;t3[i*3+1]=bh;t3[i*3+2]=Math.sin(ba)*bl+(Math.random()-.5)*40}}
  // 4: Blooming canopy (sphere at top + scattered petals)
  var t4=new Float32Array(N*3);
  for(i=0;i<N;i++){var t=i/N;if(t<.1){t4[i*3]=(Math.random()-.5)*10;t4[i*3+1]=-200+t/.1*300;t4[i*3+2]=(Math.random()-.5)*10}
    else{var bphi=Math.acos(2*Math.random()-1),bth=Math.random()*Math.PI*2,br=100+Math.pow(Math.random(),.7)*180;
      t4[i*3]=br*Math.sin(bphi)*Math.cos(bth);t4[i*3+1]=150+br*Math.cos(bphi)*.6;t4[i*3+2]=br*Math.sin(bphi)*Math.sin(bth)}}

  var targets=[t0,t1,t2,t3,t4];var TC=targets.length;
  var mat=new THREE.PointsMaterial({size:lightMode?1.8:1.4,vertexColors:true,transparent:true,opacity:lightMode?.45:.35,blending:lightMode?THREE.NormalBlending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  var mesh=new THREE.Points(geo,mat);scene.add(mesh);
  var scrollP=0,smoothS=0,time=0;
  var darkPal=[[[.2,.83,.52],[.13,.7,.4],[.3,.75,.45]],[[.15,.7,.35],[.1,.6,.3],[.25,.65,.4]],[[0,.75,.3],[.2,.65,.5],[.35,.85,.5]],[[.2,.8,.45],[.3,.7,.55],[.1,.75,.35]],[[.43,.88,.74],[.3,.82,.6],[.55,.9,.7]]];
    var lightPal=[[[.02,.42,.25],[.05,.35,.2],[.12,.38,.22]],[[.06,.35,.18],[.04,.3,.15],[.1,.32,.2]],[[0,.38,.15],[.08,.32,.25],[.14,.42,.25]],[[.08,.4,.22],[.12,.35,.28],[.04,.38,.18]],[[.18,.48,.38],[.12,.42,.3],[.25,.5,.35]]];
    var palettes=lightMode?lightPal:darkPal;
  new MutationObserver(function(m){m.forEach(function(mu){if(mu.attributeName==='data-theme'){lightMode=isLight();palettes=lightMode?lightPal:darkPal;mat.blending=lightMode?THREE.NormalBlending:THREE.AdditiveBlending;mat.size=lightMode?1.8:1.4;mat.needsUpdate=true}})}).observe(document.documentElement,{attributes:true});
    function ss(x){return x*x*(3-2*x)}
  window.addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;scrollP=m>0?Math.min(scrollY/m,1):0},{passive:true});
  var pos=geo.attributes.position.array,col=geo.attributes.color.array;
  function animate(){requestAnimationFrame(animate);time+=.002;smoothS+=(scrollP-smoothS)*.03;
    var raw=smoothS*(TC-1),si=Math.min(Math.floor(raw),TC-2);if(si<0)si=0;var bl=ss(Math.min(Math.max(raw-si,0),1));
    var from=targets[si],to=targets[Math.min(si+1,TC-1)],fp=palettes[si],tp=palettes[Math.min(si+1,TC-1)];
    for(i=0;i<N;i++){var i3=i*3,fs=1+smoothS;
      pos[i3]=from[i3]+(to[i3]-from[i3])*bl+Math.sin(time+i*.007)*2*fs;
      pos[i3+1]=from[i3+1]+(to[i3+1]-from[i3+1])*bl+Math.cos(time+i*.01)*1.5*fs;
      pos[i3+2]=from[i3+2]+(to[i3+2]-from[i3+2])*bl+Math.sin(time*.35+i*.012)*2.5*fs;
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
    mesh.rotation.y=time*.08;mesh.rotation.x=Math.sin(smoothS*Math.PI)*.08;
    mat.opacity=.3+Math.sin(smoothS*Math.PI)*.1;renderer.render(scene,camera)}
  animate();
  window.addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
})();
