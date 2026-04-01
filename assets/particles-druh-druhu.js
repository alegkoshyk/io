// ДРУГ ДРУГУ: single point → orbital ring → honeycomb → neural network → galaxy cluster
(function(){
  var canvas=document.getElementById('three-bg');
  if(!window.THREE){canvas.style.display='none';return}
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
  var scene=new THREE.Scene();var camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,1,2000);camera.position.z=500;
  var N=2800,i;
  var geo=new THREE.BufferGeometry();var positions=new Float32Array(N*3);var colors=new Float32Array(N*3);
  for(i=0;i<N;i++){positions[i*3]=(Math.random()-.5)*100;positions[i*3+1]=(Math.random()-.5)*100;positions[i*3+2]=(Math.random()-.5)*100;
    var r=Math.random();colors[i*3]=r<.5?.91:.7;colors[i*3+1]=r<.5?.475:.4;colors[i*3+2]=r<.5?.976:.96}
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));

  // 0: Single tight cluster (one person)
  var t0=new Float32Array(N*3);
  for(i=0;i<N;i++){var phi=Math.acos(2*Math.random()-1),th=Math.random()*Math.PI*2,r=30+Math.random()*20;
    t0[i*3]=r*Math.sin(phi)*Math.cos(th);t0[i*3+1]=r*Math.sin(phi)*Math.sin(th);t0[i*3+2]=r*Math.cos(phi)}
  // 1: Orbital rings (multiple orbits around center)
  var t1=new Float32Array(N*3);
  for(i=0;i<N;i++){var ring=Math.floor(Math.random()*3),rad=[120,180,240][ring],a=(i/N)*Math.PI*2*7+ring*2.09,tilt=ring*.4;
    t1[i*3]=Math.cos(a)*rad;t1[i*3+1]=Math.sin(a)*rad*Math.sin(tilt)+(Math.random()-.5)*15;t1[i*3+2]=Math.sin(a)*rad*Math.cos(tilt)+(Math.random()-.5)*15}
  // 2: Honeycomb (hexagonal grid)
  var t2=new Float32Array(N*3);var hexR=35,cols=12,rows=10;
  for(i=0;i<N;i++){var hi=i%(cols*rows),hx=hi%cols,hy=Math.floor(hi/cols);
    var cx=(hx-cols/2)*hexR*1.8+(hy%2)*hexR*.9,cy=(hy-rows/2)*hexR*1.55;
    var ha=(i/(cols*rows))*Math.PI*2;
    t2[i*3]=cx+Math.cos(ha)*hexR*.4*(Math.random());t2[i*3+1]=cy+Math.sin(ha)*hexR*.4*(Math.random());t2[i*3+2]=(Math.random()-.5)*40}
  // 3: Neural network (clusters with connections)
  var t3=new Float32Array(N*3);var nodes=[[0,0,0],[-180,120,50],[180,120,-50],[-120,-150,30],[120,-150,-30],[0,200,-60],[0,-200,60],[-200,-20,-40],[200,-20,40],[0,80,100]];
  for(i=0;i<N;i++){if(i<N*.7){var n=nodes[i%nodes.length];t3[i*3]=n[0]+(Math.random()-.5)*80;t3[i*3+1]=n[1]+(Math.random()-.5)*80;t3[i*3+2]=n[2]+(Math.random()-.5)*50}
    else{var a=nodes[Math.floor(Math.random()*nodes.length)],b=nodes[Math.floor(Math.random()*nodes.length)],t=Math.random();
      t3[i*3]=a[0]+(b[0]-a[0])*t+(Math.random()-.5)*15;t3[i*3+1]=a[1]+(b[1]-a[1])*t+(Math.random()-.5)*15;t3[i*3+2]=a[2]+(b[2]-a[2])*t+(Math.random()-.5)*10}}
  // 4: Galaxy cluster (multiple mini-spirals)
  var t4=new Float32Array(N*3);var gCenters=[[-150,100,0],[150,100,0],[0,-120,0],[-100,-50,80],[100,-50,-80]];
  for(i=0;i<N;i++){var gc=gCenters[i%gCenters.length],ga=(i/N)*Math.PI*4,gr=30+Math.random()*60;
    t4[i*3]=gc[0]+Math.cos(ga)*gr;t4[i*3+1]=gc[1]+Math.sin(ga)*gr*(Math.random()*.3+.1);t4[i*3+2]=gc[2]+Math.sin(ga)*gr}

  var targets=[t0,t1,t2,t3,t4];var TC=targets.length;
  var mat=new THREE.PointsMaterial({size:1.4,vertexColors:true,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  var mesh=new THREE.Points(geo,mat);scene.add(mesh);
  var scrollP=0,smoothS=0,time=0;
  var palettes=[[[.91,.475,.976],[.7,.4,.96],[.95,.55,.85]],[[.85,.45,.97],[.65,.4,.95],[.9,.5,.88]],[[.75,.4,.96],[.6,.45,.94],[.85,.5,.97]],[[.91,.475,.976],[.7,.5,.95],[.8,.55,.96]],[[.65,.35,.97],[.55,.4,.95],[.75,.45,.98]]];
  function ss(x){return x*x*(3-2*x)}
  window.addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;scrollP=m>0?Math.min(scrollY/m,1):0},{passive:true});
  var pos=geo.attributes.position.array,col=geo.attributes.color.array;
  function animate(){requestAnimationFrame(animate);time+=.002;smoothS+=(scrollP-smoothS)*.035;
    var raw=smoothS*(TC-1),si=Math.min(Math.floor(raw),TC-2);if(si<0)si=0;var bl=ss(Math.min(Math.max(raw-si,0),1));
    var from=targets[si],to=targets[Math.min(si+1,TC-1)],fp=palettes[si],tp=palettes[Math.min(si+1,TC-1)];
    for(i=0;i<N;i++){var i3=i*3,fs=1+smoothS*1.2;
      pos[i3]=from[i3]+(to[i3]-from[i3])*bl+Math.sin(time+i*.009)*2*fs;
      pos[i3+1]=from[i3+1]+(to[i3+1]-from[i3+1])*bl+Math.cos(time+i*.011)*2*fs;
      pos[i3+2]=from[i3+2]+(to[i3+2]-from[i3+2])*bl+Math.sin(time*.4+i*.014)*3*fs;
      var ci=i%3,fc=fp[ci],tc=tp[ci];col[i3]=fc[0]+(tc[0]-fc[0])*bl;col[i3+1]=fc[1]+(tc[1]-fc[1])*bl;col[i3+2]=fc[2]+(tc[2]-fc[2])*bl}
    geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;
    mesh.rotation.y=smoothS*Math.PI*.5+time*.1;mesh.rotation.x=Math.sin(smoothS*Math.PI)*.1;mesh.rotation.z=Math.sin(time*.2)*.01;
    mat.opacity=.3+Math.sin(smoothS*Math.PI)*.12;renderer.render(scene,camera)}
  animate();
  window.addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
})();
