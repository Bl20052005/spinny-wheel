import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

    const [line, setLine] = useState([]);
    const [text, setText] = useState("");
    const [inputs, setInputs] = useState([]);
    const [inputText, setInputText] = useState([]);
    const [inputSize, setInputSize] = useState([]);
    const [winVal, setWinVal] = useState([]);
    const [curSlice, setCurSlice] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [wheelDuration, setWheelDuration] = useState(4);
    const [volume, setVolume] = useState(50);

    const handleInputChange = (value, index) => {
        setInputText(inputText => {
            let before = inputText.slice(0,index);
            let after = inputText.slice(index+1);
            let total = [...before, value, ...after];
            setInputs(inputs => {
                let curInputs = inputs.slice(index*2,index*2 + 2);
                let newCurInputs = [
                <input key={curInputs[0].key} type="text" className = "text-input" value={value} onChange={(e) => handleInputChange(e.target.value, index)}/>,
                <button key = {curInputs[1].key} className="delete-button pointer-hover" onClick={() => handleDeleteInputs(index*2)}>x</button>
                ];
                let newInputs = [...inputs.slice(0, index*2), ...newCurInputs, ...inputs.slice(index*2 + 2)];
                setInputSize(inputSize => {
                    let fontSize = (Math.sin((360 / (inputSize.length + 1)) * Math.PI / 180) * 80) * 0.9;
                    if(fontSize > 35 || inputSize.length + 1 < 3) {
                        fontSize = 35;
                    }
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    context.font = `${fontSize}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
                    let width = context.measureText(value).width;
                    let first = inputSize.slice(0,index);
                    let second = inputSize.slice(index+1);
                    if(width >= 190) {
                        fontSize = 190 / width * fontSize;
                        width = 190;
                    }
                    let final = [...first, ...[[fontSize, width]], ...second];
                    handleWheelChange(total[total.length - 1], total.length * 2 - 2, total.slice(0, total.length - 1), final);
                    return final;
                });
                return newInputs;
            });
            return total;
        });
        
        
    }

    const handleDeleteInputs = (index) => {
            setLine(line => {
                let lineAfter = [...line.slice(0, index)].concat([...line.slice(index+2)]);
                setInputText(inputText => {
                    let inputTextAfter = [...inputText.slice(0, index / 2)].concat([...inputText.slice(index / 2 + 1)]);
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    let fontSize = (Math.sin((360 / (line.length / 2 + 1)) * Math.PI / 180) * 80) * 0.9;
                    context.font = `${fontSize}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
                    setInputSize(inputSize => {
                        let inputSizeAfter = [...inputSize.slice(0, index / 2)].concat([...inputSize.slice(index / 2 + 1)]);
                        
                        if(fontSize > 35 || inputSize.length + 1 < 3) {
                            fontSize = 35;
                        }
                        for(let i = 0; i < inputSizeAfter.length; i++) {
                            let width = context.measureText(inputTextAfter[i]).width;
                            if(inputSizeAfter[i][0] < fontSize && width < 190) {
                                inputSizeAfter[i][0] = fontSize;
                                inputSizeAfter[i][1] = width;
                            }
                        }
                        handleWheelChange(inputTextAfter[inputTextAfter.length - 1], lineAfter.length - 2, inputTextAfter.slice(0, inputTextAfter.length - 1), inputSizeAfter);
                        return inputSizeAfter;
                    });
                    setInputs(input => {
                        let oldInputs = [...input.slice(0, index)].concat([...input.slice(index+2)]);
                        let newInputs = [];
                        for(let i = 0; i < oldInputs.length; i+=2) {
                            newInputs.push(<input key={i / 2} type="text" className = "text-input" value={inputTextAfter[i / 2]} onChange={(e) => handleInputChange(e.target.value, i / 2)}/>, 
                            <button key = {"delete" + (i / 2)} className="delete-button pointer-hover" onClick={() => handleDeleteInputs(i)}>x</button>);
                        }
                        return newInputs;
                    });
                    return inputTextAfter;
                });
                return lineAfter;
            });
    }

    const addInput = (value) => {
        setText("");
        setInputText(inputText => {
            let inputTextAfter = inputText.concat(value);
            setInputs(inputs => {
                let newInputs = [];
                for(let i = 0; i < inputs.length + 2; i+=2) {
                    newInputs.push(<input key={i / 2} type="text" className = "text-input" value={inputTextAfter[i / 2]} onChange={(e) => handleInputChange(e.target.value, i / 2)}/>, 
                    <button key = {"delete" + (i / 2)} className="delete-button pointer-hover" onClick={() => handleDeleteInputs(i)}>x</button>);
                }
                return newInputs;
            });
            return inputTextAfter;
        });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "35px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        let width = context.measureText(text).width;
        setInputSize(inputSize => {
            let fontSize = (Math.sin((360 / (inputSize.length + 1)) * Math.PI / 180) * 80) * 0.9;
            if(fontSize > 35 || inputSize.length + 1 < 3) {
                fontSize = 35;
            }
            let final = inputSize;
            for(let i = 0; i < final.length; i++) {
                if(final[i][0] > fontSize) {
                    final[i][0] = fontSize;
                }
            }
            if(width >= 190) {
                fontSize = 190 / width * fontSize;
                width = 190;
            }
            final = inputSize.concat([[fontSize, width]]);
            handleWheelChange(value, line.length, inputText, final);
            return final;
        });
    }

    const handleWheelChange = (value, length, inputText, inputSize) => {
        let newLine = [];
        let degrees = 0;
        let bgColors = ["#0a2373", "#184e80", "#227d87", "#45127a"];
        let bgStyle = "conic-gradient(";
        

        if(length !== 0){
            for(let i = 0; i < length / 2 + 1; i++) {                    
                newLine.push(<div key={"line" + i} style={{transform: `rotate(${degrees}deg)`}} className="wheel-lines"></div>);
                newLine.push(<div key={"div" + i} style={{transform: `rotate(${degrees + 360 / (length / 2 + 1) / 2}deg)`}} className="wheel-divs"><p key={"text" + i} style={{fontSize: inputSize[i][0] + "px"}} className="wheel-text" id={"text" + i}>{i == length / 2 ? value : inputText[i]}</p></div>);
                if(i !== length / 2) bgStyle += bgColors[i%4] + ` ${degrees}deg ${degrees + 360 / (length / 2 + 1)}deg, `;
                else bgStyle += bgColors[i%4] + ` ${degrees}deg ${degrees + 360 / (length / 2 + 1)}deg)`;
                degrees += 360 / (length / 2 + 1);
            }
        } else {
            newLine.push(<p key={"text0"} id="text0" style={{color: "white", marginBottom: "200px", fontSize: inputSize[0][0] + "px"}}>{value}</p>);
            newLine.push(<div key="hidden" hidden></div>)
            bgStyle += bgColors[0] + ` ${degrees}deg ${degrees + 360 / (length / 2 + 1)}deg)`;
        }
        document.getElementById("wheel-container").style.background = bgStyle;
        setLine(newLine);
    }

    const handleWin = (degrees) => {
        document.getElementById("spin-win").load();
        document.getElementById("spin-win").play();
        let simplified = 360 - degrees % 360;
        setWinVal([inputText[Math.floor(simplified / 360 * inputText.length)], Math.floor(simplified / 360 * inputText.length)]);
        document.getElementById("win-container").style.visibility = "visible";
        document.getElementById("win-container").style.opacity = "1";
    }

    const handleWinClose = () => {
        document.getElementById("win-container").style.visibility = "hidden";
        document.getElementById("win-container").style.opacity = "0";
        document.getElementById("app-container").style.pointerEvents = "auto";
    }

    const handleWheelSpin = () => {
        document.getElementById("spin-win").load();
        let cancelID = setInterval(function() {
            let wheel = getComputedStyle(document.getElementById("wheel-container")).transform;
            wheel = wheel.split('(')[1];
            wheel = wheel.split(',');
            let angle = Math.atan2(wheel[1], wheel[0]) * (180/Math.PI);
            if(angle < 0) angle = 360 + angle;
            angle = 360 - angle;
            setCurSlice(curSlice => {
                if(Math.floor(angle / (360 / inputText.length)) != curSlice) {
                    document.getElementById("spin-click").load();
                    document.getElementById("spin-click").playbackRate = 5;
                    document.getElementById("spin-click").play();
                    return Math.floor(angle / (360 / inputText.length));
                } else {
                    return curSlice;
                }
            });
        }, 85);
        let randomVal = Math.random() * 360 + (wheelDuration * 360 + 360);
        document.documentElement.style.setProperty('--end-transform', randomVal + "deg");
        document.getElementById("wheel-container").style.animation = `spin ${wheelDuration}s ease-in-out 1`;
        document.getElementById("app-container").style.pointerEvents = "none";
        setTimeout(function() {
            document.getElementById("wheel-container").style.animation = "";
            document.getElementById("wheel-container").style.transform = `rotate(${randomVal}deg)`;
            document.documentElement.style.setProperty('--start-transform', randomVal % 360 + "deg");
            document.getElementById("win-container").style.pointerEvents = "auto";
            clearInterval(cancelID);
            handleWin(randomVal);
        }, wheelDuration * 1000 - 50);
    }

    const handleMenuClick = (open) => {
        if(!open) {
            document.getElementById("menu").style.visibility = "visible";
            document.getElementById("menu").style.opacity = "1";
            document.getElementById("menu").style.height = "240px";
            document.getElementById("menu-line-two").style.opacity = "0";
            document.getElementById("menu-line-one").style.transform = "rotate(45deg)";
            document.getElementById("menu-line-three").style.left = "-3px";
            document.getElementById("menu-line-one").style.left = "14px";
            document.getElementById("menu-line-three").style.top = "-62px";
            document.getElementById("menu-line-three").style.transform = "rotate(-45deg)";
            setMenuOpen(!open);
        } else {
            document.getElementById("menu").style.visibility = "hidden";
            document.getElementById("menu").style.opacity = "0";
            document.getElementById("menu").style.height = "0px";
            document.getElementById("menu-line-two").style.opacity = "1";
            document.getElementById("menu-line-one").style.transform = "rotate(0deg)";
            document.getElementById("menu-line-three").style.left = "7px";
            document.getElementById("menu-line-one").style.left = "7px";
            document.getElementById("menu-line-three").style.top = "-60px";
            document.getElementById("menu-line-three").style.transform = "rotate(0deg)";
            setMenuOpen(!open);
        }
        
    }

    const handleToggleDuration = (e) => {
        setWheelDuration(e);
    }

    const handleVolumeChange = (e) => {
        document.getElementById("spin-click").volume = e / 100;
        document.getElementById("spin-win").volume = e / 100;
        setVolume(e);
    }

    return(
        <div id="app-container">
            
            <div id="title-container">
                <h1 id="title">Spinny Wheel!</h1>
            </div>

            <div id="main-container">
                <div id="menu-container">
                    <div id="menu-click" onClick={() => handleMenuClick(menuOpen)}></div>
                    <div className="menu-line" id="menu-line-one">_</div>
                    <div className="menu-line" id="menu-line-two">_</div>
                    <div className="menu-line" id="menu-line-three">_</div>
                </div>
                <div id="wheel-container-container">
                    <div id="wheel-container" >
                        <div id="lines">{line}</div>
                    </div>
                    <div id="start-spin" className="pointer-hover" onClick={(e) => {if(inputText.length > 0) handleWheelSpin(e)}}>Spin <div id="start-spin-triangle"></div></div>
                    <audio id="spin-click" type="audio/mpeg" src={require("./sound-files/click.mp3")}></audio>
                    <audio id="spin-win" type="audio/mpeg" src={require("./sound-files/win.mp3")}></audio>
                </div>
                <div id="inputs">
                    <div id="item-container">
                        <input type="text" placeholder="Enter Names Here..." id="items" value = {text} onChange={(e) => setText(e.target.value)}/>
                        <button id="add-text" className="pointer-hover" onClick={() => addInput(text)}>+</button>
                    </div>
                    <div id="text-inputs">{inputs}</div>
                </div>
                <div id="menu">
                        <div id="add-input-list" className="menu-options1">Add Inputs</div>
                        <div id="remove-inputs" className="menu-options1">Remove All Inputs</div>
                        <div id="toggle-duration" className="menu-options2">Wheel Duration: {wheelDuration}s
                            <input id="duration-range" type="range" max={10} min={1} defaultValue={4} onChange={(e) => handleToggleDuration(e.target.value)}></input>
                        </div>
                        <div id="toggle-sound" className="menu-options2">Volume: {volume}
                            <input id="volume" type="range" defaultValue={50} min={0} max={100} onChange={(e) => handleVolumeChange(e.target.value)}></input>
                        </div>
                </div>
            </div>

            <div id="win-container">
                <div id="win-exit-button" className="pointer-hover"  onClick={() => handleWinClose()}>x</div>
                <div id="win-message">{winVal[0]} <div id="smaller-text">was selected</div></div>
                <div id="finished" className="pointer-hover" onClick={() => handleWinClose()}>Done!</div>
                <div id="spin-again" className="pointer-hover"  onClick={() => {
                    handleWinClose();
                    handleWheelSpin();
                }}>Spin again?</div>
                <div id="hide-current-name" className="pointer-hover" onClick={() => {
                    handleWinClose();
                    handleDeleteInputs(winVal[1] * 2);
                }}>Hide this name</div>
            </div>
        </div>
    );
}

export default App;