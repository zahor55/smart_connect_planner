import React, { useState,useEffect } from "react"
import "./styles.css"
import { SIZE,limitSensorsToBoard } from "../../constants"
import Xarrow from "react-xarrows";
//all component
const tiles = [
  "empty",
  "board",
  "strightLine",
  "Horizontal",
  "right",
    "left",
    "leftTop",
    "topRight",
    "Window",
    "Door",
    "audio",
    "Led",
  "move-down",
  "move-right",
  "move-left"
];
const sensor=[
  "audio",
  "move-down",
    "move-right",
    "move-left",
    "Led"
];
const home=[
    "Window",
  "Door"
];
const walls=[
  "strightLine",
  "Horizontal",
  "right","left",
  "leftTop",
  "topRight",
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
  const forceUpdate = useForceUpdate();
  useEffect(()=>{
    setPlacedTiles(JSON.parse(localStorage.getItem("position")))
    let x=lines;
    let line=JSON.parse(localStorage.getItem("lines"))
    for(let i in line){
      let y=[line[i][0],line[i][1],<Xarrow
          start={line[i][0]}//can be react ref
          end={line[i][1]} //or an id
          headSize={1}
      />];
      x.push(y)
    }
    setLines(x)

  },[])
  function sensorToBoard(afterSubmit) {
    for (const square in afterSubmit){
      let temp=0
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
      let temp=true
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
    let notificationPosition=[],notificationName=[]
    for (const square in twoDarray){
      if(sensor.includes(twoDarray[square])){     //this square is sensor
        for(const x in lines){
          if(lines[x][0]===square || lines[x][1]===square){       //found the square
            if(sensor.includes(twoDarray[lines[x][0]]) && sensor.includes(twoDarray[lines[x][1]])){
              if(!notificationPosition.includes(lines[x][0])){
                notificationPosition.push(lines[x][0])
                notificationName.push(twoDarray[lines[x][0]])
              }
              if(!notificationPosition.includes(lines[x][1])){
                notificationPosition.push(lines[x][1])
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
      let temp=false
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
  function handleDrag(e) {
    e.dataTransfer.setData("text", e.target.id)
  }
  function handleDrop(e) {
    e.preventDefault();

    const tile = e.dataTransfer.getData("text").split("_")[0];
    if(e.dataTransfer.getData("text").match(/^\d/)===null){
      if(tile==="empty"){
        let x=lines.filter(x =>{
          if(x[0]!==e.target.id && x[1]!== e.target.id ){
            return x
          }
        });
        setLines(x);

        console.log(e.target.id)
      }
      placeTile(tile, e.clientX, e.clientY)
    }
    else{
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
      {placedTiles.map((placed, index) => <div
          className={`placed tile ${placed.tile} ${placed.x / SIZE}_${placed.y / SIZE}`}
          id={`${placed.x / SIZE}_${placed.y / SIZE}`}
          draggable={true}
          onDragStart={handleDrag}
          onDoubleClick={e => {
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
      />)}
    </div>
    <div className="tiles">
      <h1 className="title">Smart connect planner</h1>
      <div className="navBar">
        <button className="button" onClick={() => {
          setCompButton("all");
          const x = document.getElementById("0_0");
          if (x.classList.contains("board") === true) {
            console.log("bla")
          } else {
            console.log(x.classList)
          }
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
        }}>reset board
        </button>

      </div>
      <div className="components">
        {compButton === "all" && tiles.map((tile, i) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile}`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)}
        {compButton === "sensor" && sensor.map((tile, i) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile}`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)}
        {compButton === "home" && home.map((tile, i) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile}`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)
        &&
        walls.map((tile, i) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile}`}
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

        }}>submit
        </button>
        <button className="submit" onClick={()=>{
          localStorage.setItem("lines",JSON.stringify(lines));
          localStorage.setItem("position",JSON.stringify(placedTiles));
        }}>save</button>
      </div>
    </div>
    {lines.map(x => x[2])}
  </div>
}
