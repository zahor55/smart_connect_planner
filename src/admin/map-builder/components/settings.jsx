import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function Settings() {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [numOfConnect,setConnectLimit]=useState(10)
    const handleOpen = () => {
        setOpen(true);
    };
    useEffect(()=>{
        let limitSensors=JSON.parse(localStorage.getItem("limitSensors"))
        if(parseInt(limitSensors)){
            setConnectLimit(parseInt(limitSensors))
        }

    },[])
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange=(event)=>{
        if(!Number.isNaN(event.target.value)){
            setConnectLimit(event.target.value)
            console.log("ddd")
        }

    }
    const handleSubmit=(e)=>{
        let limit=JSON.parse(localStorage.getItem("limitSensors"));
        if((!parseInt(limit) && numOfConnect) || (numOfConnect && numOfConnect!==parseInt(limit))){
            localStorage.setItem("limitSensors",numOfConnect);
            console.log("ccc")
        }           //rule number one

        e.preventDefault()
        handleClose()
    }
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <form onSubmit={handleSubmit}>
                <label>
                    The maximum number that can be connected to the board
                    <input type="text" value={numOfConnect} onChange={handleChange} />
                    {/*rule number one*/}
                </label>
                <br/>
                <input type="submit" value="Save" />
            </form>
        </div>
    );

    return (
        <div style={{marginLeft:10,marginTop:15}}>
            <button type="button" onClick={handleOpen}>
                Open Settings
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}
