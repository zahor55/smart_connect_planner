import React, { useState,useEffect } from "react"
import "./styles.css"
import { SIZE,limitSensorsToBoard } from "../../constants"
import Xarrow from "react-xarrows";
//all component
const tiles = [
  "empty",
  "board",
    "Window",
    "Door",
    "audio",
    "Led",
  "room-3x3",
  "room-4x4",
  "room-5x5",
  "room-6x6"
];
const sensor=[
  "audio",
    "Led"
];
const walls=[
  "Window",
  "Door",
  "room-3x3",
  "room-4x4",
  "room-5x5",
  "room-6x6"
];
const MAP_SIZE = {
  width: SIZE * 20,
  height: SIZE * 14
};
const defaultTiles = [];
for (let i = 0; i < MAP_SIZE.height / SIZE; i++) {
  for (let j = 0; j < MAP_SIZE.width / SIZE; j++) {
    defaultTiles.push({
      tile: "empty",
      x: j * SIZE,
      y: i * SIZE
    })
  }
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

export default function AdminMapBuilder() {
  const [placedTiles, setPlacedTiles] = useState(defaultTiles);
  const [compButton,setCompButton] = useState("all");
  const [lines,setLines]= useState([]);
  const [roomLines,setRoomLines]=useState([])
  const forceUpdate = useForceUpdate();
  useEffect(()=>{
    setPlacedTiles(JSON.parse(localStorage.getItem("position")));
    let x=lines;
    let line=JSON.parse(localStorage.getItem("lines"));
    for(let i in line){
      let y=[line[i][0],line[i][1],<Xarrow
          start={line[i][0]}//can be react ref
          end={line[i][1]} //or an id
          headSize={1}
      />];
      x.push(y)
    }

    setLines(x)
    let room=JSON.parse(localStorage.getItem("room"));
    for(let i in room){
      buildRoom((room[i]["size"]+1).toString(),room[i]["start"])      //first paramter must to be string
    }


  },[]);
  useEffect(()=>{
    console.log(roomLines)
  },[roomLines])
  function sensorToBoard(afterSubmit) {
    for (const square in afterSubmit){
      let temp=0;
      if(afterSubmit[square]==="board"){
        for(let x in lines){
          if(lines[x][0]===square || lines[x][1]===square){
            temp++
          }
        }
        if(temp>=limitSensorsToBoard){
          alert("to many componets  connected to board in x= "+square.split("_")[0]+ "and  y= "+square.split("_")[1])
        }
      }
      }

  }
  function boardNotConnected(afterSubmit) {   //check if has board without connection
    for(const square in afterSubmit){
      let temp=true;
      if(afterSubmit[square]==="board"){
        for (const x in lines){
          if(lines[x][0]===square || lines[x][1]===square){
            temp=false
          }
        }
        if(temp){
          alert("board in x: "+square.split("_")[0] + " and  y= "+square.split("_")[1]+ " is Connectionless")
        }
      }
    }
  }
  function sensorConnectToSensor(twoDarray){
    let notificationPosition=[],notificationName=[];
    for (const square in twoDarray){
      if(sensor.includes(twoDarray[square])){     //this square is sensor
        for(const x in lines){
          if(lines[x][0]===square || lines[x][1]===square){       //found the square
            if(sensor.includes(twoDarray[lines[x][0]]) && sensor.includes(twoDarray[lines[x][1]])){
              if(!notificationPosition.includes(lines[x][0])){
                notificationPosition.push(lines[x][0]);
                notificationName.push(twoDarray[lines[x][0]])
              }
              if(!notificationPosition.includes(lines[x][1])){
                notificationPosition.push(lines[x][1]);
                notificationName.push(twoDarray[lines[x][1]])
              }
            }
          }
        }
      }

    }
    for(const x in notificationPosition){
      alert(notificationName[x]+" in position x: "+notificationPosition[x].split("_")[0]+" and y: "+ notificationPosition[x].split("_")[1]+" is connected to another sensor")
    }
  }
  function sensorNotConnected(afterSubmit) {
    for (const square in afterSubmit ){
      let temp=false;
      if(sensor.includes(afterSubmit[square])){
        for(let x in lines){
          if((lines[x][0]===square || lines[x][1]===square) &&
              (afterSubmit[lines[x][1]]==="board" || afterSubmit[lines[x][0]]==="board")){
            temp=true
          }
        }
        if(!temp){
          alert(afterSubmit[square]+" in x: "+square.split("_")[0]+ " and  y= "+square.split("_")[1]+" is not connected to board")
        }

      }


    }
  }
  function buildRoom(roomSize,startPoint) {     //build room in the board
    const size=parseInt(roomSize[0])-1
    const xStart=parseInt(startPoint.split("_")[0]);    //get  x_y example 12_14
    const yStart=parseInt(startPoint.split("_")[1]);
    if(xStart+size>19 || yStart+size>14){     //the board is 19*14 -check if the room exceed out of board
      alert("the room exceed the board");
      return -1;
    }
    let y={}
    y["size"]=size
    y["start"]=startPoint
    let right=[`${xStart+size}_${yStart}`,`${xStart+size}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart+size}_${yStart}`}//can be react ref
        end={`${xStart+size}_${yStart+size}`} //or an id
        headSize={1}
    />];
    let left=[`${xStart}_${yStart}`,`${xStart}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart}_${yStart}`}//can be react ref
        end={`${xStart}_${yStart+size}`} //or an id
        headSize={1}
    />];
    let top=[`${xStart}_${yStart}`,`${xStart+size}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart}_${yStart}`}//can be react ref
        end={`${xStart+size}_${yStart-size+size}`} //or an id
        headSize={1}
    />];
    let bottom=[`${xStart}_${yStart+size}`,`${xStart+size}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart}_${yStart+size}`}//can be react ref
        end={`${xStart+size}_${yStart+size}`} //or an id
        headSize={1}
    />];
    y["right"]=right
    y["top"]=top
    y["bottom"]=bottom
    y["left"]=left
    let x=roomLines;
    x.push(y)
    setRoomLines(x)
  }
  function destroyRoom(start,size=0) {        //remove room from board-when tap twice on the start square
    console.log(size)
    let room=[]
    let flag=false
    console.log("1- ",room,roomLines)
    if(size===0){         //if drop component doesnt room
      room=roomLines.filter(x=>x["start"]!==start)
    }
    else{         //remove old room
      roomLines.forEach(elem=>{
        if(elem["start"]===start){
          if(elem["size"]!==size-1){
            if(flag){
              room.push(elem)
            }

          }
          if(elem["size"]===size-1){
            if(flag){
              room.push(elem)
            }
            flag=true
          }
        }
        else{
          room.push(elem)
        }
      })
      console.log("2- ",room,roomLines)
    }
    setRoomLines(room)

    console.log("3- ",room,roomLines)
  }
  function handleDrag(e) {
    e.dataTransfer.setData("text", e.target.id)
  }
  function handleDrop(e) {
    e.preventDefault();

    const tile = e.dataTransfer.getData("text").split("_")[0];    //what drag
    if(e.dataTransfer.getData("text").match(/^\d/)===null){
      let one=e.target.className.split(" ")[2]   //e.target is where to drop
      //when drag and drop component
      if(tile==="empty" ){     //drop empty square
        if(one.slice(0,4)==="room"){      //remove all line connected
          destroyRoom(e.target.id)
        }

        let x=lines.filter(x =>{
          if(x[0]!==e.target.id && x[1]!== e.target.id ){
            return x                //if has line connected
          }
        });
        setLines(x);

      }

      placeTile(tile, e.clientX, e.clientY)
      if(tile.slice(0,4)==="room"){
        buildRoom(tile.slice(5,6),e.target.id)
      }
      if(e.target.classList[2].slice(0,4)==="room"){      //when try to drop on exist room-need to remove all lines
        if(tile.slice(0,4)==="room"){
          destroyRoom(e.target.id,parseInt(one.slice(5,6)))
        }
        else{
          destroyRoom(e.target.id)
        }
        console.log(roomLines)

      }
    }
    else{
      //when draw a line
      let one=e.target.className.split(" ")[2]
      if(one.slice(0,4)==="room"){      //if drop on start we remove the room
        return
      }
      let temp=document.getElementById(e.dataTransfer.getData("text")).classList[2];
      if(e.target.classList[2]!=="empty" && temp!=="empty" && !walls.includes(temp) && !walls.includes(e.target.classList[2]) ){
        if(e.target.id===e.dataTransfer.getData("text")){
          return
        }//check if drag and drop to his own
        let x=lines;
        let y=[e.dataTransfer.getData("text"),e.target.id,<Xarrow
            start={e.dataTransfer.getData("text")}//can be react ref
            end={e.target.id} //or an id
            headSize={1}
            consoleWarning={false}
        />];
        x.push(y);
        setLines(x);
        forceUpdate()
      }
      }


  }
  function placeTile(tile, x, y) {
    const snappedX = Math.ceil(x / 32) * 32 - 32;
    const snappedY = Math.ceil(y / 32) * 32 - 32;

    setPlacedTiles(prevState => [
      ...prevState.filter(
        prev => !(prev.x === snappedX && prev.y === snappedY)
      ),
      {
        tile,
        x: snappedX,
        y: snappedY
      }
    ])
  }
  return <div className="map-builder">
    <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="map"
        style={{
          width: MAP_SIZE.width + 1,
          height: MAP_SIZE.height + 1
        }}
    >
      {placedTiles.map((placed) => <div
          className={`placed tile ${placed.tile} ${placed.tile==="empty"?"v":"f"} ${placed.x / SIZE}_${placed.y / SIZE}`}
          id={`${placed.x / SIZE}_${placed.y / SIZE}`}
          draggable={true}
          onDragStart={handleDrag}
          onDoubleClick={(e) => {
            let one=e.target.className.split(" ")[2]
            if(one.slice(0,4)==="room"){      //if double press on start of room-we remove him
              return
            }
            let temp = e.target.id;
            let x = lines.filter(x => {
              if (x[0] !== temp && x[1] !== temp) {
                return x
              }
            });
            setLines(x)
          }}
          style={{
            left: placed.x,
            top: placed.y
          }}
      >
        <span className="tooltiptext">{placed.tile}</span>
      </div>)}
    </div>
    <div className="tiles">
      <h1 className="title">Smart connect planner</h1>
      <div className="navBar">
        <button className="button" onClick={() => {
          setCompButton("all");
        }}>all
        </button>
        <button className="button" onClick={() => {
          setCompButton("sensor")
        }}>sensors
        </button>
        <button className="button" onClick={() => {
          setCompButton("home")
        }}>home object
        </button>
        <button className="button" onClick={() => {
          setPlacedTiles(defaultTiles);
          setLines([])
          setRoomLines([])
        }}>reset board
        </button>

      </div>
      <div className="components">
        {compButton === "all" && tiles.map((tile) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile} frame`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)}
        {compButton === "sensor" && sensor.map((tile) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile} frame`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)}
        {compButton === "home" &&
        walls.map((tile) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile} frame`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)
        }
      </div>
      <div>
        <button className="submit" onClick={async () => {
          let twoDarray = {};
          for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 14; y++) {
              let comp = document.getElementById(`${x}_${y}`);
              if (comp.classList[2] !== "empty") {
                twoDarray[`${x}_${y}`] = comp.classList[2]
              }

            }
          }
          sensorToBoard(twoDarray);    //rules number 1
          sensorConnectToSensor(twoDarray);  //rules number 2
          sensorNotConnected(twoDarray); //rules number 3
          boardNotConnected(twoDarray); //rules number 12
          let room=[]
          roomLines.forEach((elem)=>{
            let arr=[]
            let square=elem["start"]
            let x=parseInt(square.split("_")[0]),y=parseInt(square.split("_")[1])
            let size=parseInt(elem["size"])+1
            console.log(x,y,square,size)
            let sizeIn=0,sizeOut=0
            while(sizeIn<size){
              sizeOut=0
              while(sizeOut<size){
                arr.push(`${x+sizeOut}_${y}`)
                sizeOut++
              }
              sizeIn++
              y++
            }
            room.push(arr)
          })
          console.log(room)
        }}>submit
        </button>
        <button className="submit" onClick={()=>{
          localStorage.setItem("lines",JSON.stringify(lines));
          localStorage.setItem("position",JSON.stringify(placedTiles));
          localStorage.setItem("room",JSON.stringify(roomLines))
        }}>save</button>
      </div>
    </div>
    {lines.map(x => x[2])}
    {roomLines.map(x=>x["right"][2])}
    {roomLines.map(x=>x["left"][2])}
    {roomLines.map(x=>x["top"][2])}
    {roomLines.map(x=>x["bottom"][2])}
  </div>
}
