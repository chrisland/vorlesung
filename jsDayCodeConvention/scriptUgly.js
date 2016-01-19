var 

_BODY ={head
  
  :     {
    brain
    : 
0, hairs:
    'nice' },   body: [
    
      ]
    ,
      footer: 'nothing'
};

function workingInit
(task
){
var d =newDate();
  var time= d.
  getTime()
  ;if (
    
      navigator.geolocation){navigator.geolocation.
        getCurrentPosition(showPosition);
  } else{error.log("Geolocation is not supported by this browser.");}
function showPosition( position )
{
console.log(
  time+
        ' - working at:'
  +position.coords.latitude+'/'+
position.coords.longitude
+' - mytask: '+task)
    ;
  }}
var _day={morgen:
  function(){functionaufstehen(){}var freizeit=
Math.floor((Math.random()*10)+1);if(
  freizeit == 1
){returnfalse;}
else{
      workingInit();
      returntrue;}}
  ,mittag:function(){
    if(_system.body
    =='empty'||typeof_system.body
    ==
    'undefinied'){alert('HUNGER!!!');
  }},
  preabend:function( ){varfreizeit =Math.floor((Math.random()*2)+1);
    if(freizeit==1)
      {return'working';} else {tvInit('Simpsons');
      return'busy';}},abend
  :function(){},
  nacht:function(){returnfalse;}};
  var _system=
    {
dayTime
:
0
,
newDay:false,
    init :function(neu
    ){if(neu){_system.dayTime=0; }
    if(!cleanMind())
    {error.throw ('ALARM! Der Koerper wurde nicht gefunden');_system.reBoot();}
    setInterval(_system.dayLoop,3600000);//3600000ms=4h
  },dayLoop:function (){ if(_day[getDayTime
    (
    )
  ]
)
{
  _day
  [
    getDayTime
    (
    )
  ]
  (
  )
  ;
}
_system.dayTime++;},cleanMind:function
(){varbody=getBody();
  if(!body||typeofbody.head==
    'undefined'){returnfalse;}
    body.head={brain:undefinied};
  returntrue;}
    ,reBoot:function(){shell_exec('sudo /sbin/shutdown -r now');},getDayTime:
  function(){return_system.dayTime;
},getBody : function(){if(_BODY){return_BODY;}returnfalse;}};_system.init(
  true
      )
;


