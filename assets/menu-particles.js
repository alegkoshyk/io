// Menu particle effect — floating dots inside mobile nav
(function(){
  var canvas, ctx, particles=[], W, H, raf, active=false;

  function init(){
    canvas=document.getElementById('menuParticles');
    if(!canvas) return;
    ctx=canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize(){
    if(!canvas) return;
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
  }

  function createParticles(){
    particles=[];
    for(var i=0;i<60;i++){
      particles.push({
        x:Math.random()*W,
        y:Math.random()*H,
        vx:(Math.random()-.5)*.4,
        vy:(Math.random()-.5)*.4,
        r:Math.random()*2+.5,
        o:Math.random()*.4+.1,
        color:['139,92,246','167,139,250','99,102,241','232,121,249'][Math.floor(Math.random()*4)]
      });
    }
  }

  function draw(){
    if(!active){raf=null;return}
    ctx.clearRect(0,0,W,H);

    // Draw connections
    for(var i=0;i<particles.length;i++){
      for(var j=i+1;j<particles.length;j++){
        var dx=particles[i].x-particles[j].x;
        var dy=particles[i].y-particles[j].y;
        var dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.strokeStyle='rgba(139,92,246,'+((.12)*(1-dist/120))+')';
          ctx.lineWidth=.5;
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+p.color+','+p.o+')';
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*3,0,Math.PI*2);
      ctx.fillStyle='rgba('+p.color+','+(p.o*.15)+')';
      ctx.fill();
    }

    raf=requestAnimationFrame(draw);
  }

  window.startMenuParticles=function(){
    active=true;
    if(!canvas) init();
    resize();
    createParticles();
    if(!raf) draw();
  };

  window.stopMenuParticles=function(){
    active=false;
    if(ctx) ctx.clearRect(0,0,W,H);
  };

  document.addEventListener('DOMContentLoaded', init);
})();
