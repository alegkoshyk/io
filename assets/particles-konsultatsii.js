// КОНСУЛЬТАЦІЇ: scattered chaos → converging laser → arrow → burst → focused point
(function(){
  var canvas=document.getElementById('three-bg');
  if(!window.THREE){canvas.style.display='none';return}
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
  var scene=new THREE.Scene();var camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,1,2000);camera.position.z=500;
  var N=2500,i;
  var geo=new THREE.BufferGeometry();var positions=new Float32Array(N*3);var colors=new Float32Array(N*3);
  for(i=0;i<N;i++){positions[i*3]=(Math.random()-.5)*800;positions[i*3+1]=(Math.random()-.5)*600;positions[i*3+2]=(Math.random()-.5)*300;
    var r=Math.random();colors[i*3]=r<.6?.388:.3;colors[i*3+1]=r<.6?.4:.45;colors[i*3+2]=r<.6?.945:.95}
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));

  // 0: Scattered chaos (wide random cloud)
  var t0=new Float32Array(N*3);
  for(i=0;i<N;i++){var phi=Math.acos(2*Math.random()-1),th=Math.random()*Math.PI*2,sr=150+Math.random()*350;
    t0[i*3]=sr*Math.sin(phi)*Math.cos(th);t0[i*3+1]=sr*Math.sin(phi)*Math.sin(th);t0[i*3+2]=sr*Math.cos(phi)}
  // 1: Converging funnel (laser focus)
  var t1=new Float32Array(N*3);
  for(i=0;i<N;i++){var t=i/N,rad=300*(1-t*t),angle=t*Math.PI*6+Math.random()*.3;
    t1[i*3]=Math.cos(angle)*rad*(1-t)+(Math.random()-.5)*20*t;t1[i*3+1]=(t-.5)*500;t1[i*3+2]=Math.sin(angle)*rad*(1-t)+(Math.random()-.5)*20*t}
  // 2: Arrow pointing right
  var t2=new Float32Array(N*3);
  for(i=0;i<N;i++){var t=i/N;if(t<.6){t2[i*3]=(t/.6-.5)*400;t2[i*3+1]=(Math.random()-.5)*30;t2[i*3+2]=(Math.random()-.5)*30}
    else{var at=(t-.6)/.4,spread=at*200;t2[i*3]=200-at*200;t2[i*3+1]=(Math.random()-.5)*spread;t2[i*3+2]=(Math.random()-.5)*spread}}
  // 3: Explosion burst (expanding ring)
  var t3=new Float32Array(N*3);
  for(i=0;i<N;i++){var bphi=Math.acos(2*(i/N)-1),bth=2.399963*i,br=200+Math.sin(bphi*3+bth*2)*80;
    t3[i*3]=br*Math.sin(bphi)*Math.cos(bth);t3[i*3+1]=br*Math.cos(bphi);t3[i*3+2]=br*Math.sin(bphi)*Math.sin(bth)}
  // 4: Tight focused orb
  var t4=new Float32Array(N*3);
  for(i=0;i<N;i++){var fphi=Math.acos(2*Math.random()-1),fth=Math.random()*Math.PI*2,fr=40+Math.random()*30;
    t4[i*3]=fr*Math.sin(fphi)*Math.cos(fth);t4[i*3+1]=fr*Math.sin(fphi)*Math.sin(fth);t4[i*3+2]=fr*Math.cos(fphi)}

  var targets=[t0,t1,t2,t3,t4];var TC=targets.length;
  var mat=new THREE.PointsMaterial({size:1.3,vertexColors:true,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  var mesh=new THREE.Points(geo,mat);scene.add(mesh);
  var scrollP=0,smoothS=0,time=0;
  var palettes=[[[.388,.4,.945],[.3,.45,.95],[.5,.4,.97]],[[.4,.5,.96],[.35,.55,.94],[.5,.45,.97]],[[.5,.55,.97],[.4,.5,.95],[.6,.5,.98]],[[.7,.5,.98],[.55,.45,.97],[.8,.6,.95]],[[.388,.4,.945],[.5,.55,.97],[.4,.5,.96]]];
  function ss(x){return x*x*(3-2*x)}
  window.addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;scrollP=m>0?Math.min(scrollY/m,1):0},{passive:true});
  var pos=geo.attributes.position.array,col=geo.attributes.color.array;
  function animate(){requestAnimationFrame(animate);time+=.0025;smoothS+=(scrollP-smoothS)*.04;
    var raw=smoothS*(TC-1),si=Math.min(Math.floor(raw),TC-2);if(si<0)si=0;var bl=ss(Math.min(Math.max(raw-si,0),1));
    var from=targets[si],to=targets[Math.min(si+1,TC-1)],fp=palettes[si],tp=palettes[Math.min(si+1,TC-1)];
    for(i=0;i<N;i++){var i3=i*3,fs=1+smoothS;
      pos[i3]=from[i3]+(to[i3]-from[i3])*bl+Math.sin(time+i*.01)*2*fs;
      pos[i3+1]=from[i3+1]+(to[i3+1]-from[i3+1])*bl+Math.cos(time+i*.013)*2*fs;
      pos[i3+2]=from[i3+2]+(to[i3+2]-from[i3+2])*bl+Math.sin(time*.5+i*.017)*3*fs;
      var ci=i%3,fc=fp[ci],tc=tp[ci];col[i3]=fc[0]+(tc[0]-fc[0])*bl;col[i3+1]=fc[1]+(tc[1]-fc[1])*bl;col[i3+2]=fc[2]+(tc[2]-fc[2])*bl}
    geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;
    mesh.rotation.y=smoothS*Math.PI*.3;mesh.rotation.z=Math.sin(time*.3)*.02;
    mat.opacity=.3+Math.sin(smoothS*Math.PI)*.15;renderer.render(scene,camera)}
  animate();
  window.addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
})();
