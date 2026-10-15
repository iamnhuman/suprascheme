'use strict';

// Responsive deterministic motion film. Every picture reads seek(t).
let W=1920,H=1080;
const DURATION=48,BPM=150,BEAT=60/BPM,SHOT_LEN=2;
const C={ink:'#10120f',paper:'#efefe5',lime:'#d9ff43',red:'#f23831',grey:'#81867a',cyan:'#57e2e5',pink:'#ff5589'};
const names=['SIGNAL OVERLOAD','ICON SCANNER','SIX CYLINDERS','FIRING ORDER','TURBO SPIRAL','POWER DENSITY','TORQUE NETWORK','GEAR PROTOCOL','REAR DRIVE','LAUNCH CONTROL','VELOCITY FIELD','GRIP ENVELOPE','SLIP ANGLE','APEX TRACKER','BRAKE FREQUENCY','DYNAMIC LOAD','OSCILLOSCOPE','AIRFLOW ARRAY','THERMAL MATRIX','PARTICLE REBUILD','MULTIPLEX','64 CHANNELS','SYSTEM OVERDRIVE','NO LIMIT'];
const SHOTS=names.map((name,i)=>({t:i*SHOT_LEN,name,bg:[1,7,15,23].includes(i)?C.paper:i===5?C.lime:i===13?C.red:C.ink}));
const canvas=document.getElementById('c'),out=canvas.getContext('2d',{alpha:false});
const stage=document.createElement('canvas'),ctx=stage.getContext('2d',{alpha:false});
const player=document.getElementById('player'),range=document.getElementById('timeline');
const params=new URLSearchParams(location.search),capture=params.has('capture');
const ss=Math.min(3,Math.max(1,Number(params.get('ss'))||1));
const car=new Image();car.src = 'assets/supra.png';
const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const mix = (a, b, p) => a + (b - a) * p;
const ease = p => 1 - Math.pow(1 - clamp(p), 4);
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const pop = p => { p = clamp(p); return 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2); };
const mod = (n, d) => ((n % d) + d) % d;
const beat = t => Math.exp(-mod(t, BEAT) * 11);
const rand = n => mod(Math.sin(n * 127.1 + 311.7) * 43758.5453, 1);
const rgba = (hex, a) => hex + Math.round(clamp(a) * 255).toString(16).padStart(2, '0');
function rect(x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}
function line(x,y,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}
function circle(x,y,r,color,width=2,fill=false){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);ctx[fill?'fillStyle':'strokeStyle']=color;ctx.lineWidth=width;ctx[fill?'fill':'stroke']();}
function text(s,x,y,size,color=C.paper,font='Anton',align='left',stroke=false){ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=1.7;ctx[stroke?'strokeText':'fillText'](s,x,y);}
function label(s,x,y,color=C.paper,size=21,align='left'){text(s,x,y,size,color,'Plex',align);}
function scoped(fn){ctx.save();fn();ctx.restore();}
function clipBox(x,y,w,h,fn){scoped(()=>{ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();fn();});}
function cross(x,y,color,r=9){line(x-r,y,x+r,y,color);line(x,y-r,x,y+r,color);}
function arrow(x,y,length,color,angle=0,width=5){scoped(()=>{ctx.translate(x,y);ctx.rotate(angle);line(0,0,length,0,color,width);line(length-18,-18,length,0,color,width);line(length-18,18,length,0,color,width);});}
function kinetic(s,x,y,size,color,t,delay=0,spacing=1){
  ctx.font=`${size}px Anton`;let px=x;
  for(let i=0;i<s.length;i++){const p=pop((t-delay-i*.032)/.65),width=ctx.measureText(s[i]).width;scoped(()=>{ctx.translate(px,y+(1-p)*size*1.3);ctx.globalAlpha=clamp((t-delay-i*.032)*7);text(s[i],0,0,size,color);});px+=width+spacing;}
}
function badge(s,x,y,w,fill,ink,t=10){scoped(()=>{const p=ease(t/.4);ctx.translate(x,y);ctx.scale(p,1);rect(0,0,w,43,fill);label(s,14,29,ink,20);});}
function grid(t,color,step=120){
  ctx.lineWidth=1;ctx.strokeStyle=rgba(color,.1);const off=mod(t*12,step);ctx.beginPath();
  for(let x=-step+off;x<W+step;x+=step){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=0;y<H;y+=step){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();
  for(let i=0;i<14;i++)cross(rand(i)*W,rand(i+30)*H,rgba(color,.22),5);
}
function rays(t,color,n=50,cx=1250,cy=540){
  for(let i=0;i<n;i++){const a=rand(i+5)*Math.PI*2,d=mod(rand(i+70)*1700+t*(230+rand(i)*500),1700),len=50+rand(i+22)*170;line(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.68,cx+Math.cos(a)*(d+len),cy+Math.sin(a)*(d+len)*.68,rgba(color,.12+rand(i+99)*.25),1+rand(i+20)*2);}
}
function ring(x,y,r,t,color,accent=C.red,count=64){
  scoped(()=>{ctx.translate(x,y);ctx.rotate(t*.16);circle(0,0,r,rgba(color,.28));circle(0,0,r-18,rgba(color,.15));
    for(let i=0;i<count;i++){const a=i/count*Math.PI*2,l=i%4===0?22:9;line(Math.cos(a)*(r-l),Math.sin(a)*(r-l),Math.cos(a)*r,Math.sin(a)*r,rgba(color,i%4===0?.7:.3),2);}
    ctx.strokeStyle=accent;ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,r+12,t*.5,t*.5+1.1);ctx.stroke();circle(Math.cos(t*.7)*r,Math.sin(t*.7)*r,7,accent,1,true);
  });
}
function toyota(x,y,w,color,t=10){scoped(()=>{ctx.translate(x,y);ctx.scale(w/210,w/210);ctx.strokeStyle=color;ctx.lineWidth=7;ctx.setLineDash([700]);ctx.lineDashOffset=700*(1-ease(t/.9));ctx.beginPath();ctx.ellipse(0,0,100,65,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,35,61,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,-24,82,31,0,0,Math.PI*2);ctx.stroke();});}
function gr(x,y,size=64){rect(x,y,size,size*.64,C.red);rect(x+size,y,size,size*.64,C.ink);text('G',x+size*.49,y+size*.54,size*.56,C.paper,'Anton','center');text('R',x+size*1.49,y+size*.54,size*.56,C.paper,'Anton','center');}
function carImage(x,y,width,angle=0,alpha=1){scoped(()=>{ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.drawImage(car,-width/2,-width*car.height/car.width/2,width,width*car.height/car.width);});}
function wheel(x,y,r,t,color,accent=C.lime){scoped(()=>{ctx.translate(x,y);ring(0,0,r,t,color,accent,48);circle(0,0,r*.72,rgba(color,.35),12);ctx.rotate(t*2.5);for(let i=0;i<7;i++)scoped(()=>{ctx.rotate(i*Math.PI*2/7);ctx.beginPath();ctx.moveTo(15,-6);ctx.lineTo(r*.65,-r*.18);ctx.lineTo(r*.73,8);ctx.lineTo(18,13);ctx.closePath();ctx.fillStyle=color;ctx.fill();});circle(0,0,24,accent,1,true);circle(0,0,8,C.ink,1,true);});}
function waveform(x,y,w,h,t,color,bars=48){for(let i=0;i<bars;i++){const v=.18+.7*Math.abs(Math.sin(i*.39+t*4)*Math.cos(i*.14-t*2));rect(x+i*w/bars,y-h*v/2,w/bars*.5,h*v,rgba(color,.45+.5*v));}}
function pistons(x,y,w,h,t,color,accent){
  const gap=w/6;
  for(let i=0;i<6;i++)scoped(()=>{const phase=t*8+i*Math.PI*2/3,cy=y+95+Math.sin(phase)*58,px=x+gap*(i+.5),crankY=y+h-65;
    rect(px-gap*.37,y,gap*.74,h-50,rgba(color,.045));line(px-gap*.37,y,px-gap*.37,y+h-90,rgba(color,.3));line(px+gap*.37,y,px+gap*.37,y+h-90,rgba(color,.3));
    const firing=clamp(Math.sin(phase+1.4)*3-.9);rect(px-gap*.32,y+5,gap*.64,Math.max(0,cy-y-9),rgba(accent,firing*.4));
    rect(px-gap*.28,cy,gap*.56,46,color);for(let k=0;k<3;k++)line(px-gap*.28,cy+7+k*8,px+gap*.28,cy+7+k*8,C.ink,2);
    line(px,cy+46,px+Math.cos(phase)*35,crankY+Math.sin(phase)*35,color,12);circle(px,crankY,38,rgba(color,.35),2);circle(px+Math.cos(phase)*35,crankY+Math.sin(phase)*35,9,accent,1,true);label('0'+(i+1),px,y+h+7,color,19,'center');
  });line(x,y+h-65,x+w,y+h-65,accent,4);
}
function curveGraph(x,y,w,h,t,color,accent){
  for(let i=0;i<5;i++){line(x,y-i*h/4,x+w,y-i*h/4,rgba(color,.18),1);label(String(i*100),x-18,y-i*h/4+6,rgba(color,.5),16,'right');}
  ctx.beginPath();for(let i=0;i<=100;i++){const p=i/100,v=.1+.85*Math.sin(p*1.45),xx=x+w*p,yy=y-h*v;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fillStyle=rgba(accent,.12);ctx.fill();
  const reveal=ease(t/.9);ctx.beginPath();for(let i=0;i<=100*reveal;i++){const p=i/100,xx=x+w*p,yy=y-h*(.1+.85*Math.sin(p*1.45));if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.strokeStyle=accent;ctx.lineWidth=7;ctx.stroke();
  const p=mod(t*.17,1);line(x+w*p,y-h,x+w*p,y,rgba(color,.35),1);circle(x+w*p,y-h*(.1+.85*Math.sin(p*1.45)),9,color,1,true);label('CONCEPT POWER CURVE / RPM →',x,y+42,color,17);
}

// Experimental compositions follow.
let renderScale=1,portrait=false;
function configure(){
  const fixedPortrait=params.get('format')==='portrait'||document.body.dataset.format==='portrait';
  const aspect=capture?(fixedPortrait?9/16:16/9):Math.max(.25,innerWidth/innerHeight);
  portrait=aspect<1.05;W=portrait?1080:1920;H=Math.round(W/aspect);
  renderScale=capture?ss:Math.min(1.35,Math.max(.6,devicePixelRatio*innerWidth/W));
  const width=Math.round(W*renderScale),height=Math.round(H*renderScale);
  for(const surface of[canvas,stage]){surface.width=width;surface.height=height;}
}
configure();
addEventListener('resize',()=>{configure();if(window.__film?.ready)seek(current());});

const SIGNALS=['CRANK / PHASE','BOOST / FFT','POWER / RPM','ECU / PACKETS','GRIP / VECTOR','FLOW / DENSITY','IGNITION / I—6','GEAR / STATE','LOAD / ENVELOPE','TORQUE / ROUTER','AERO / STREAM','BRAKE / ENERGY','TRACTION / XY','SLIP / ANGLE','PRESSURE / MAP','SIGNAL / MATRIX'];
const ACCENTS=[C.lime,C.cyan,C.red,C.pink];
let cloud=[];
function prepareVisuals(){
  const bitmap=document.createElement('canvas');bitmap.width=1400;bitmap.height=400;const b=bitmap.getContext('2d');b.font='350px Anton';b.fillText('SUPRA',15,350);
  const pixels=b.getImageData(0,0,1400,400).data;
  for(let y=0;y<400;y+=7)for(let x=0;x<1400;x+=7)if(pixels[(y*1400+x)*4+3]>100)cloud.push({x:x/1400,y:y/400,seed:rand(x+y*1400)});
}
function poly(points,color,width=2,fill=false){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(fill){ctx.closePath();ctx.fillStyle=color;ctx.fill();}else{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}}
function trace(x,y,w,h,t,color,seed=0,frequency=1){
  ctx.beginPath();for(let i=0;i<=72;i++){const p=i/72;const v=Math.sin(p*14*frequency+t*3+seed)*.55+Math.sin(p*37-t*5+seed)*.24+Math.sin(p*77+t)*.09;const px=x+p*w,py=y+v*h*.43;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
}
function circuit(x,y,w,h,t,color,accent,seed=0){
  const points=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;points.push([x+w*.5+Math.cos(a)*(w*.37+Math.sin(a*3+seed)*w*.07),y+h*.5+Math.sin(a)*(h*.32+Math.cos(a*2)*h*.04)]);}
  poly(points,rgba(color,.28),9);poly(points,color,2);
  const i=Math.floor(mod(t*.35+seed*.03,1)*100);poly(points.slice(Math.max(0,i-18),i+1),accent,5);circle(...points[i],5,accent,1,true);
  for(let k=0;k<4;k++){const p=points[k*25];cross(...p,color,7);}
}
function wire(x,y,r,t,color,seed=0){
  const vertices=[];for(let k=0;k<8;k++){let a=(k&1?1:-1),b=(k&2?1:-1),c=(k&4?1:-1);const ca=Math.cos(t*.6+seed),sa=Math.sin(t*.6+seed),z=a*sa+c*ca,xx=a*ca-c*sa;const cc=Math.cos(t*.4),sc=Math.sin(t*.4);vertices.push([x+xx*r/(2.4+z*.25),y+(b*cc-z*sc)*r/(2.4+z*.25)]);}
  for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))line(...vertices[i],...vertices[j],color,2);
  for(const p of vertices)circle(...p,4,color,1,true);
}
function heat(x,y,w,h,t,color,accent,cols=14,rows=8,seed=0){
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const v=(Math.sin(col*.49+t*3+seed)*Math.cos(row*.6-t*2)+1)/2;rect(x+col*w/cols,y+row*h/rows,w/cols-3,h/rows-3,rgba(v>.76?accent:color,.07+v*.65));}
}
function module(type,x,y,w,h,t,seed,ink,accent,frame=true){
  clipBox(x,y,w,h,()=>{
    if(frame){rect(x,y,w,h,rgba(ink,.028));ctx.strokeStyle=rgba(ink,.28);ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
    scoped(()=>{ctx.translate(x+9,y+9);ctx.scale((w-18)/300,(h-18)/220);
      label(`${String(seed%99).padStart(2,'0')} / ${SIGNALS[type%16]}`,0,13,ink,13);label((Math.sin(t*3+seed)*.5+.5).toFixed(3),300,13,accent,12,'right');
      line(0,25,300,25,rgba(ink,.22),1);
      switch(type%16){
        case 0:
          for(let k=0;k<4;k++){trace(0,65+k*40,300,37,t+k*.15,k===0?accent:rgba(ink,.5),seed+k,1+k*.12);line(0,65+k*40,300,65+k*40,rgba(ink,.1),1);}break;
        case 1:
          for(let i=0;i<36;i++){const v=.12+Math.abs(Math.sin(i*.16+t*2.4+seed)*Math.cos(i*.2-t*.7));rect(i*8.33,207-v*156,5,v*156,i%7?ink:accent);}break;
        case 2:
          ring(150,123,82,t*3,ink,accent,40);text(String(Math.floor(mod(t*83+seed*29,999))).padStart(3,'0'),150,145,53,ink,'Anton','center');break;
        case 3:heat(0,39,300,170,t,ink,accent,16,9,seed);break;
        case 4:circuit(0,33,300,180,t,ink,accent,seed);break;
        case 5:wire(150,125,205,t,ink,seed);circle(150,125,84,rgba(accent,.35),1);break;
        case 6:{
          const points=[];for(let i=0;i<7;i++){const a=i/6*Math.PI*2-Math.PI/2,r=55+20*Math.sin(t*3+i+seed);line(150,128,150+Math.cos(a)*84,128+Math.sin(a)*84,rgba(ink,.2),1);points.push([150+Math.cos(a)*r,128+Math.sin(a)*r]);}poly(points,rgba(accent,.16),1,true);poly(points,accent,2);for(let r=28;r<85;r+=28)circle(150,128,r,rgba(ink,.25),1);break;}
        case 7:
          for(let i=0;i<9;i++){const n=Math.floor(mod(t*35+i*983+seed*177,65535)).toString(16).toUpperCase().padStart(4,'0');label(`${n}  ${n.split('').reverse().join('')}  ${i%3?'SYNC':'EXEC'}`,0,48+i*19,i===Math.floor(t*9)%9?accent:rgba(ink,.55),15);rect(275,37+i*19,20*rand(i+Math.floor(t*6)+seed),9,accent);}break;
        case 8:pistons(0,38,300,165,t*2,ink,accent);break;
        case 9:wheel(91,126,68,t*2,ink,accent);wheel(228,128,42,-t*3,ink,accent);line(155,90,190,94,ink);line(155,163,190,160,ink);break;
        case 10:
          for(let i=0;i<8;i++){label(String(i+1),0,52+i*22,ink,14);const v=70+mod(t*88+i*37+seed*7,200);rect(26,40+i*22,v,11,i===Math.floor(t*3)%8?accent:rgba(ink,.5));}break;
        case 11:
          for(let i=0;i<90;i++){const a=rand(i+seed)*Math.PI*2,r=mod(t*38+rand(i+50)*140,140),px=150+Math.cos(a)*r,py=125+Math.sin(a)*r*.65;rect(px,py,2+(i%4),2,i%5?ink:accent);}break;
        case 12:
          for(let i=0;i<6;i++){const yy=49+i*27;ctx.beginPath();ctx.moveTo(0,yy);ctx.bezierCurveTo(90,yy,180,126,300,126);ctx.strokeStyle=rgba(ink,.35);ctx.lineWidth=2;ctx.stroke();const p=mod(t*.7+i*.15,1);circle(300*p,mix(yy,126,smooth(p)),4,accent,1,true);}break;
        case 13:
          for(let i=0;i<36;i++){const a=Math.PI*.8+i/35*Math.PI*1.4;line(150+Math.cos(a)*70,126+Math.sin(a)*70,150+Math.cos(a)*82,126+Math.sin(a)*82,i<25?ink:accent,2);}arrow(150,126,64,accent,Math.PI*.8+(Math.sin(t*2+seed)*.5+.5)*Math.PI*1.4,4);label('VECTOR / N',150,210,ink,13,'center');break;
        case 14:
          for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(150,124,30+i*17,t*(i%2?1:-1),t*(i%2?1:-1)+3.5+Math.sin(t+i));ctx.strokeStyle=i%2?ink:accent;ctx.lineWidth=5;ctx.stroke();}break;
        case 15:
          ctx.beginPath();for(let i=0;i<180;i++){const p=i/179*Math.PI*2,px=150+Math.sin(p*3+t)*130,py=125+Math.sin(p*2-t*.8)*78;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.stroke();break;
      }
    });
  });
}
function tiles(x,y,w,h,cols,rows,t,seed,ink,accent){
  const gap=9,cw=(w-gap*(cols-1))/cols,ch=(h-gap*(rows-1))/rows;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c;module((i*3+seed)%16,x+c*(cw+gap),y+r*(ch+gap),cw,ch,t+i*.07,i+seed,ink,i%4===0?ACCENTS[(seed+i)%4]:accent);}
}
function stackTicker(s,y,size,t,ink,accent,reverse=false){
  const unit=900,off=mod(t*(reverse?-180:180),unit);for(let i=-1;i<W/unit+2;i++){label(s,i*unit-off,y,ink,size);rect(i*unit-off+850,y-size*.8,22,size*.8,accent);}
}
function microData(t,index,ink,accent){
  const m=portrait?34:45,fs=portrait?27:19;
  label('TOYOTA // GR SUPRA',m,portrait?57:44,ink,fs);label(`${String(index+1).padStart(2,'0')}/24`,W-m,portrait?57:44,accent,fs,'right');
  line(m,portrait?82:65,W-m,portrait?82:65,rgba(ink,.4),1);
  const bottom=H-(portrait?142:105);rect(0,bottom-20,W,1,rgba(ink,.25));
  stackTicker('382 HP  /  368 LB-FT  /  3.9 SEC  /  INLINE—6  /  REAR DRIVE',bottom+18,portrait?25:18,t,ink,accent);
  stackTicker('CONCEPT SIGNAL  ///  A90  ///  TOYOTA 2025 US 3.0 AT  ///  SIGNAL OVERLOAD',bottom+53,portrait?19:14,t*.7,rgba(ink,.5),accent,true);
  for(let i=0;i<24;i++)rect(m+i*(W-2*m)/24,H-(portrait?38:29),(W-2*m)/24-8,i===index?7:2,i<=index?accent:rgba(ink,.2));
  const frame=Math.floor(t*30);label(`${String(Math.floor(t)).padStart(2,'0')}:${String(frame%30).padStart(2,'0')}   /   150 BPM`,m,H-(portrait?65:49),ink,portrait?22:16);
  for(let i=0;i<32;i++){const y=95+i*(H-240)/32;rect(W-16,y,i%4?5:11,2,i%4?rgba(ink,.25):accent);rect(8,y,i%3?5:11,2,i%3?rgba(ink,.3):accent);}
}
function title(index,t,ink,accent){
  const name=SHOTS[index].name,base=portrait?218:H*.23;
  let size=portrait?118:Math.min(152,H*.15);ctx.font=`${size}px Anton`;size=Math.min(size,(W*(portrait?.93:.88))/ctx.measureText(name).width*size);
  kinetic(name,38,base,size,ink,t+.7,0,.6);
  label(`GR / ${['ENGINEERING','PERFORMANCE','CONTROL','EXPERIMENT'][Math.floor(index/6)]}  —  ${String(index*97+382).padStart(4,'0')}`,40,base+(portrait?45:36),accent,portrait?24:18);
}
function heroArea(){
  const top=portrait?330:H*.3,bottom=H-(portrait?185:150);
  return portrait?{x:38,y:top,w:W-76,h:(bottom-top)*.49}:{x:W*.247,y:top,w:W*.506,h:bottom-top};
}
function instrumentSurround(t,index,ink,accent){
  const a=heroArea();
  if(portrait){const y=a.y+a.h+22,h=H-185-y,rows=Math.max(2,Math.min(4,Math.floor(h/200)));tiles(38,y,W-76,h,3,rows,t,index*7,ink,accent);}
  else{const h=a.h,rows=h<430?2:3;tiles(38,a.y,W*.203,h,1,rows,t,index*3,ink,accent);tiles(W*.772,a.y,W*.208-38,h,1,rows,t,index*5+8,ink,accent);}
  return a;
}
function heroMetric(value,unit,a,ink,accent,t){
  const size=Math.min(a.w*.58,a.h*.67),cx=a.x+a.w*.5,cy=a.y+a.h*.6;
  ring(cx,cy-size*.23,Math.min(a.w,a.h)*.4,t*2,ink,accent,100);
  text(value,cx,cy,size,ink,'Anton','center');label(unit,cx,cy+size*.18,accent,Math.max(21,size*.085),'center');
  for(let i=0;i<20;i++){const x=a.x+i*a.w/20;rect(x,a.y+a.h-35,3,16+beat(t-i*.015)*30,i%3?ink:accent);}
}
function heroCar(a,t,ink,accent,scan=false){
  for(let i=0;i<5;i++)ring(a.x+a.w*.5,a.y+a.h*.47,Math.min(a.w,a.h)*(.14+i*.075),t*(i%2?-2:2),rgba(ink,.6),i%2?accent:ink,48);
  carImage(a.x+a.w*.5+(1-pop((t+.3)/.65))*a.w,a.y+a.h*.51+Math.sin(t*3)*13,a.w*1.24,-.045+Math.sin(t*.7)*.014);
  if(scan){const y=a.y+mod(t*.7,1)*a.h;rect(a.x,y,a.w,3,accent);rect(a.x,y-60,a.w,60,rgba(accent,.08));for(let i=0;i<9;i++){const x=a.x+rand(i)*a.w;cross(x,y+rand(i+9)*50,accent,9);}}
  label('2025 GR SUPRA / 3.0 AT',a.x+a.w*.5,a.y+a.h-38,ink,portrait?29:23,'center');
}
function drive(a,t,ink,accent){
  scoped(()=>{ctx.translate(a.x+a.w*.5,a.y+a.h*.45);const s=Math.min(a.w/610,a.h/800);ctx.scale(s,s);ctx.rotate(Math.sin(t*2)*.07);
    const hull=[[-130,-300],[-190,-200],[-200,210],[-130,300],[130,300],[200,210],[190,-200],[130,-300],[-130,-300]];poly(hull,ink,2);rect(-120,-150,240,125,rgba(ink,.15));rect(-110,55,220,130,rgba(ink,.1));
    for(const side of[-1,1])for(const axle of[-200,200]){rect(side*218-28,axle-58,56,116,ink);for(let j=0;j<6;j++)line(side*218-27,axle-50+j*18,side*218+27,axle-50+j*18,C.ink,2);}
    line(0,-200,0,200,accent,8);line(-218,200,218,200,accent,8);line(-218,-200,218,-200,rgba(ink,.4),4);rect(-70,-270,140,90,ink);label('I—6',0,-210,SHOTS[8].bg,34,'center');circle(0,200,24,ink,1,true);
    for(let i=0;i<18;i++){const p=mod(t*.8+i/18,1);circle(0,mix(-175,200,p),5,C.lime,1,true);}for(const side of[-1,1])for(let i=0;i<8;i++){const p=mod(t*1.7+i/8,1);circle(side*210*p,200,5,C.red,1,true);}
  });label('RWD / TORQUE VECTOR',a.x+a.w*.5,a.y+a.h-12,accent,25,'center');
}
function signalFloor(a,t,ink,accent){
  scoped(()=>{ctx.translate(a.x+a.w*.5,a.y+a.h*.48);const scale=Math.min(a.w,a.h)/550;
    for(let j=0;j<26;j++){const z=mod(j/26+t*.38,1),yy=(z*z-.4)*a.h*.65,ww=(.15+z*.85)*a.w*.55;line(-ww,yy,ww,yy,rgba(ink,.15+z*.5),1);}
    for(let j=0;j<20;j++){const a1=(j/20-.5)*2;line(a1*a.w*.1,-a.h*.26,a1*a.w*.8,a.h*.55,rgba(accent,.3),1);}
    for(let j=0;j<8;j++)trace(-a.w*.44,-a.h*.25+j*a.h*.07,a.w*.88,a.h*.12,t+j*.12,j%2?ink:accent,j*4,1.5);
    wire(0,0,210*scale,t*2,ink);ring(0,0,110*scale,t*3,ink,accent,80);
  });
}
function airflow(a,t,ink,accent){
  for(let j=0;j<40;j++){const yy=a.y+a.h*(j/40),phase=t*3+j*.13;ctx.beginPath();
    for(let i=0;i<=52;i++){const p=i/52,bulge=Math.exp(-Math.pow((p-.55)*4,2));const y=yy+Math.sin(phase+p*7)*a.h*.014+(j<20?-1:1)*bulge*a.h*.1;const x=a.x+p*a.w;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=rgba(j%4?ink:accent,.18+(j%3)*.1);ctx.lineWidth=1.5;ctx.stroke();
    for(let k=0;k<4;k++){const p=mod(t*.65+k/4+j*.02,1);rect(a.x+p*a.w,yy+Math.sin(phase+p*7)*a.h*.014,9,2,accent);}
  }carImage(a.x+a.w*.52,a.y+a.h*.53,a.w*1.08,-.035);
}
function particleWord(a,t,ink,accent){
  const release=(Math.sin(t*3-1.2)*.5+.5)*.8;
  for(let i=0;i<cloud.length;i++){const p=cloud[i],angle=t*(.4+p.seed)+p.seed*20,r=release*(.12+p.seed*.35);const x=a.x+a.w*(p.x+Math.cos(angle)*r),y=a.y+a.h*(.32+p.y*.36+Math.sin(angle)*r);rect(x,y,3+p.seed*3,3+p.seed*3,i%5?ink:accent);}
  for(let i=0;i<7;i++){const p=mod(t*.3+i/7,1);line(a.x,a.y+p*a.h,a.x+a.w,a.y+p*a.h,rgba(accent,.2),1);}
}
function specificHero(index,a,t,ink,accent){
  const cx=a.x+a.w/2,cy=a.y+a.h/2,r=Math.min(a.w,a.h)*.36;
  clipBox(a.x-10,a.y-15,a.w+20,a.h+30,()=>{
    switch(index){
      case 0:
        for(let i=0;i<7;i++)ring(cx,cy,r*(.3+i*.14),t*(i%2?-3:3),ink,ACCENTS[i%4],52+i*8);
        toyota(cx,cy,r*.9,accent,5);for(let i=0;i<40;i++){const angle=i/40*Math.PI*2+t*.7;label(Math.floor(mod(t*50+i*93,999)).toString().padStart(3,'0'),cx+Math.cos(angle)*r*1.25,cy+Math.sin(angle)*r*1.25,rgba(ink,.65),15,'center');}break;
      case 1:heroCar(a,t,ink,accent,true);break;
      case 2:
        pistons(a.x,a.y+a.h*.14,a.w,a.h*.61,t*3,ink,accent);waveform(a.x,a.y+a.h*.94,a.w,a.h*.15,t*2,accent,100);label('3.0L // TURBO INLINE—6',cx,a.y+a.h*.86,ink,portrait?31:26,'center');break;
      case 3:
        for(let i=0;i<3;i++)scoped(()=>{ctx.translate(cx,cy);ctx.rotate(i*Math.PI*2/3+t*.23);pistons(-a.w*.38,-a.h*.22,a.w*.76,a.h*.4,t*2+i*.8,rgba(ink,.72),ACCENTS[i]);});circle(cx,cy,r*.22,accent,1,true);label('1·5·3·6·2·4',cx,a.y+a.h-10,ink,24,'center');break;
      case 4:
        for(let i=0;i<28;i++)scoped(()=>{ctx.translate(cx,cy);ctx.rotate(i/28*Math.PI*2+t*2);poly([[20,0],[r*.6,-r*.17],[r,-r*.07],[r*.7,r*.09]],i%3?rgba(ink,.55):accent,2);});ring(cx,cy,r*1.15,t*5,ink,accent,96);circle(cx,cy,36,accent,1,true);break;
      case 5:heroMetric('382','HORSEPOWER',a,ink,C.red,t);for(let i=0;i<40;i++)rect(a.x+i*a.w/40,a.y+a.h*.86,9,-(15+rand(i)*50)*beat(t-i*.025),ink);break;
      case 6:
        for(let i=0;i<14;i++){const y=a.y+i*a.h/14;ctx.beginPath();ctx.moveTo(a.x,y);ctx.bezierCurveTo(cx,y,cx,cy,a.x+a.w,cy);ctx.strokeStyle=rgba(ink,.3);ctx.lineWidth=3;ctx.stroke();const p=mod(t*.8+i*.13,1);circle(a.x+a.w*p,mix(y,cy,smooth(p)),6,accent,1,true);}text('368',cx,cy-20,Math.min(a.w*.37,a.h*.35),ink,'Anton','center');label('LB-FT',cx,cy+35,accent,32,'center');break;
      case 7:
        for(let j=0;j<8;j++){const yy=a.y+j*a.h/8;label(String(j+1).padStart(2,'0'),a.x,yy+30,ink,27);for(let i=0;i<36;i++){const v=mod(t*4+j*.3+i*.04,1);rect(a.x+65+i*(a.w-65)/36,yy+8,5+v*10,a.h/8-16,i<j*4?accent:rgba(ink,.2));}}break;
      case 8:drive(a,t,ink,accent);break;
      case 9:
        rays(t*3,ink,110,cx,cy);heroMetric('3.9','0–60 MPH / SECONDS / 8AT',a,ink,accent,t);break;
      case 10:signalFloor(a,t,ink,accent);carImage(cx,cy+a.h*.16,a.w*.8,-.06);break;
      case 11:
        for(let i=0;i<12;i++)circle(cx,cy,r*(.2+i*.075),rgba(ink,.1+i*.04),1);line(cx-r,cy,cx+r,cy,ink);line(cx,cy-r,cx,cy+r,ink);
        for(let i=0;i<70;i++){const angle=t*2+i*.09,rr=r*(.25+.65*rand(i));circle(cx+Math.cos(angle)*rr,cy+Math.sin(angle*1.5)*rr,2+i%3,i%5?ink:accent,1,true);}label('FRICTION ENVELOPE / XY',cx,a.y+a.h-10,accent,23,'center');break;
      case 12:
        for(let k=0;k<8;k++){ctx.beginPath();for(let i=0;i<200;i++){const p=i/199*Math.PI*2;const x=cx+Math.sin(p*3+t+k*.12)*a.w*.44,y=cy+Math.sin(p*2-t*.8)*a.h*.36;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=k%3?rgba(ink,.22):accent;ctx.lineWidth=2;ctx.stroke();}break;
      case 13:
        for(let i=0;i<4;i++)circuit(a.x+i*12,a.y+i*10,a.w-i*24,a.h-i*20,t+i*.2,ink,i%2?C.lime:C.paper,i*.8);carImage(cx,cy,a.w*.64,-.09);break;
      case 14:
        wheel(cx,cy,r,t*3,ink,C.red);for(let i=0;i<24;i++){const angle=i/24*Math.PI*2+t;circle(cx+Math.cos(angle)*r*.7,cy+Math.sin(angle)*r*.7,7,i%4?C.red:accent,1,true);}ring(cx,cy,r*1.26,-t*4,ink,accent,100);break;
      case 15:
        for(let i=0;i<5;i++){const x=a.x+a.w*(i+.5)/5,y=cy+Math.sin(t*7+i)*a.h*.15;line(x,a.y,x,y,rgba(ink,.25),2);for(let j=0;j<18;j++)line(x-20*(j%2?1:-1),a.y+40+j*(y-a.y-40)/18,x+20*(j%2?1:-1),a.y+40+(j+1)*(y-a.y-40)/18,ink,3);rect(x-40,y,80,70,i%2?ink:accent);arrow(x,y+85,45,ink,Math.PI/2,3);}break;
      case 16:
        for(let i=0;i<18;i++)trace(a.x,a.y+a.h*(i+.5)/18,a.w,a.h*.07,t+i*.08,i%3?rgba(ink,.5):accent,i*.4,1+i*.03);break;
      case 17:airflow(a,t,ink,accent);break;
      case 18:
        heat(a.x,a.y,a.w,a.h,t,ink,accent,28,20,4);scoped(()=>{ctx.globalAlpha=.7;carImage(cx,cy,a.w*1.05,-.05);});for(let i=0;i<8;i++){const x=a.x+mod(t*.17+i/8,1)*a.w;line(x,a.y,x,a.y+a.h,accent,1);}break;
      case 19:particleWord(a,t,ink,accent);break;
      case 20:tiles(a.x,a.y,a.w,a.h,portrait?3:4,portrait?4:3,t,38,ink,accent);break;
      case 21:break;
      case 22:
        signalFloor(a,t,ink,accent);for(let i=0;i<6;i++)ring(cx,cy,r*(.3+i*.17),t*(i%2?-4:4),rgba(ink,.6),ACCENTS[i%4],88);carImage(cx,cy+a.h*.18,a.w*.95,-.05);text('OVERDRIVE',cx,cy-r*.9,Math.min(a.w*.13,120),ink,'Anton','center');break;
      case 23:
        ring(cx,cy,r*1.1,t*3,ink,C.red,110);toyota(cx,cy-r*.2,r*1.1,C.red,5);carImage(cx,cy+a.h*.27,a.w*1.08,-.055);break;
    }
  });
}
function drawComposition(index,local,absolute){
  const shot=SHOTS[index],ink=shot.bg===C.ink?C.paper:C.ink,accent=shot.bg===C.lime||shot.bg===C.paper?C.red:ACCENTS[index%4];
  rect(0,0,W,H,shot.bg);grid(absolute*3,ink,portrait?100:90);
  const t=local+.35;
  // Micro-type stays behind the main idea; it never becomes a static page layout.
  scoped(()=>{ctx.globalAlpha=.065;const size=W*.23;for(let i=0;i<5;i++)text(['TOYOTA','SUPRA','382','GR','OVERLOAD'][index%5],W*.5+Math.sin(absolute*.7+i)*45,H*(i*.28+.2),size,ink,'Anton','center',i%2===0);});
  if(index===21){
    tiles(38,portrait?310:H*.29,W-76,H-(portrait?500:H*.44),8,8,absolute,21,ink,accent);
    scoped(()=>{ctx.globalAlpha=.9;rect(W*.16,H*.46,W*.68,portrait?195:125,C.ink);});text('64',W*.5,H*.55,portrait?165:130,C.lime,'Anton','center');label('SIMULTANEOUS SIGNALS',W*.5,H*.55+38,C.paper,portrait?27:22,'center');
  }else{
    const a=instrumentSurround(absolute,index,ink,accent);specificHero(index,a,t,ink,accent);
  }
  title(index,t,ink,accent);microData(absolute,index,ink,accent);
}
function seek(time){
  const t=clamp(Number(time)||0,0,DURATION-.00001),index=Math.floor(t/SHOT_LEN),local=t-index*SHOT_LEN;
  ctx.setTransform(renderScale,0,0,renderScale,0,0);ctx.globalAlpha=1;ctx.setLineDash([]);ctx.lineCap='butt';ctx.lineJoin='miter';
  drawComposition(index,local,t);
  // Clean cuts land on the next downbeat; the canvas is copied without distortion.
  out.drawImage(stage,0,0);
  return t;
}
