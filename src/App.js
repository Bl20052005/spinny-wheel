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
    const [newText, setNewText] = useState("");
    const [colorPalate, setColorPalate] = useState(["#0a2373", "#184e80", "#227d87", "#45127a"]);

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
                    if(width >= (document.getElementById("wheel-container").clientWidth / 2 - 60)) {
                        fontSize = (document.getElementById("wheel-container").clientWidth / 2 - 60) / width * fontSize;
                        width = (document.getElementById("wheel-container").clientWidth / 2 - 60);
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
                            if(inputSizeAfter[i][0] < fontSize && width < (document.getElementById("wheel-container").clientWidth / 2 - 60)) {
                                inputSizeAfter[i][0] = fontSize;
                                inputSizeAfter[i][1] = width;
                            }
                        }
                        setColorPalate(colorPalate => {
                            handleWheelChange(inputTextAfter[inputTextAfter.length - 1], lineAfter.length - 2, inputTextAfter.slice(0, inputTextAfter.length - 1), inputSizeAfter, colorPalate);
                            return colorPalate;
                        });
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
            if(width >= (document.getElementById("wheel-container").clientWidth / 2 - 60)) {
                fontSize = (document.getElementById("wheel-container").clientWidth / 2 - 60) / width * fontSize;
                width = (document.getElementById("wheel-container").clientWidth / 2 - 60);
            }
            final = inputSize.concat([[fontSize, width]]);
            handleWheelChange(value, line.length, inputText, final);
            return final;
        });
    }

    const handleWheelChange = (value, length, inputText, inputSize, color = colorPalate) => {
        let newLine = [];
        let degrees = 0;
        let bgColors = color;
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
        let winText = inputText[Math.floor(simplified / 360 * inputText.length)];
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "50px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        let width = context.measureText(winText).width;
        let fontSize = 50;
        if(width >= 380) {
            fontSize = 380 / width * 50;
        }
        if(winText.trim() !== "") {
            document.getElementById("win-message").style.fontSize = fontSize + "px";
            setWinVal([winText, Math.floor(simplified / 360 * inputText.length)]);
            document.getElementById("win-container").style.visibility = "visible";
            document.getElementById("win-container").style.opacity = "1";
            document.getElementById("black-screen").style.visibility = "visible";
            document.getElementById("black-screen").style.opacity = "1";
        } else {
            handleWinClose();
        }
    }

    const handleWinClose = () => {
        document.getElementById("win-container").style.visibility = "hidden";
        document.getElementById("win-container").style.opacity = "0";
        document.getElementById("app-container").style.pointerEvents = "auto";
        document.getElementById("black-screen").style.visibility = "hidden";
        document.getElementById("black-screen").style.opacity = "0";
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

    const addInputTable = (pre) => {
        let finalInputs = [];
        let finalInputText = [];
        let finalInputSize = [];
        let value = [];
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "35px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        for(let i = 0; i < pre.length; i++) {
            if(pre[i] !== "" && pre[i].trim().length > 0) {
                value.push(pre[i].trim());
            }
        }
        for(let i = 0; i < value.length; i++) {
            let width = context.measureText(value[i]).width;
            let fontSize = (Math.sin((360 / (value.length)) * Math.PI / 180) * 80) * 0.9;
            if(fontSize > 35 || value.length < 3) {
                fontSize = 35;
            }
            if(width >= (document.getElementById("wheel-container").clientWidth / 2 - 60)) {
                fontSize = (document.getElementById("wheel-container").clientWidth / 2 - 60) / width * fontSize;
                width = (document.getElementById("wheel-container").clientWidth / 2 - 60);
            }
            finalInputSize.push([fontSize, width]);
            if(i !== value.length - 1) finalInputText.push(value[i]);
            finalInputs.push(<input key={i} type="text" className = "text-input" value={value[i]} onChange={(e) => handleInputChange(e.target.value, i)}/>, 
            <button key = {"delete" + (i)} className="delete-button pointer-hover" onClick={() => handleDeleteInputs(i)}>x</button>);
        }
        if(value.length > 0) {
            handleWheelChange(value[value.length-1], value.length*2 - 2, finalInputText, finalInputSize);
            setInputSize(finalInputSize);
            setInputText(finalInputText.concat(value[value.length-1]));
            setInputs(finalInputs);
        }
        closeInputTable();
    }

    const closeInputTable = () => {
        document.getElementById("add-input-container").style.visibility = "hidden";
        document.getElementById("add-input-container").style.opacity = "0";
        document.getElementById("app-container").style.pointerEvents = "auto";
        setNewText([]);
        document.getElementById("black-screen").style.visibility = "hidden";
        document.getElementById("black-screen").style.opacity = "0";
    }

    const openInputTable = () => {
        document.getElementById("add-input-container").style.visibility = "visible";
        document.getElementById("add-input-container").style.opacity = "1";
        handleMenuClick(menuOpen);
        setMenuOpen(!menuOpen);
        document.getElementById("app-container").style.pointerEvents = "none";
        document.getElementById("add-input-container").style.pointerEvents = "auto";
        document.getElementById("black-screen").style.visibility = "visible";
        document.getElementById("black-screen").style.opacity = "1";
    }

    const deleteAll = () => {
        setLine([]);
        setText("");
        setInputSize([]);
        setInputs([]);
        setInputText([]);
        setColorPalate(colorPalate => {
            document.getElementById("wheel-container").style.background = colorPalate[0];
            return colorPalate;
        });
        closeDelete();
    }

    const closeDelete = () => {
        document.getElementById("delete-all-inputs").style.visibility = "hidden";
        document.getElementById("delete-all-inputs").style.opacity = "0";
        document.getElementById("app-container").style.pointerEvents = "auto";
        setNewText([]);
        document.getElementById("black-screen").style.visibility = "hidden";
        document.getElementById("black-screen").style.opacity = "0";
    }

    const openDelete = () => {
        document.getElementById("delete-all-inputs").style.visibility = "visible";
        document.getElementById("delete-all-inputs").style.opacity = "1";
        handleMenuClick(menuOpen);
        setMenuOpen(!menuOpen);
        document.getElementById("app-container").style.pointerEvents = "none";
        document.getElementById("delete-all-inputs").style.pointerEvents = "auto";
        document.getElementById("black-screen").style.visibility = "visible";
        document.getElementById("black-screen").style.opacity = "1";
    }

    const expandPalate = () => {
        let r = document.querySelector(':root');
        let rs = getComputedStyle(r).getPropertyValue("--body-background-color");
        if(document.getElementById("arrow-container").dataset.open == "closed") {
            r.style.setProperty('--left-rotation', "rotate(90deg)");
            r.style.setProperty('--right-rotation', "rotate(270deg)");
            r.style.setProperty('--left-background-color', rs);
            document.getElementById("arrow-container").style.pointerEvents = "none";
            if(window.innerWidth >= 660) document.getElementById("color-change").style.width = "90vw";
            else document.getElementById("color-change").style.width = "500px";
            if(window.innerWidth > 1200) document.getElementById("color-change").style.height = "120px";
            else document.getElementById("color-change").style.height = "90px";
            if(window.innerWidth < 660) document.getElementById("color-change").style.marginTop = "250px";
            document.getElementById("color-change").style.borderRadius = "20px";
            document.getElementById("arrow-left").style = "pointer-events: auto;";
            document.getElementById("arrow-right").style = "pointer-events: auto;";
            document.getElementById("arrow-container").dataset.open = "open";
            document.querySelectorAll(".color-palate").forEach((item) => {
                item.style.opacity = "1";
                item.style.visibility = "visible";
            });
        } else {
            r.style.setProperty('--left-rotation', "rotate(270deg)");
            r.style.setProperty('--right-rotation', "rotate(90deg)");
            r.style.setProperty('--left-background-color', "transparent");
            if(window.innerWidth > 1200) {
                document.getElementById("color-change").style.width = "120px";
                document.getElementById("color-change").style.height = "120px";
            } else {
                document.getElementById("color-change").style.width = "90px";
                document.getElementById("color-change").style.height = "90px";
            }
            document.getElementById("color-change").style.marginTop = "0";
            document.getElementById("color-change").style.borderRadius = "50%";
            document.getElementById("arrow-container").dataset.open = "closed";
            document.getElementById("arrow-container").style.pointerEvents = "auto";
            document.querySelectorAll(".color-palate").forEach((item) => {
                item.style.opacity = "0";
                item.style.visibility = "hidden";
            });
        }
    }

    const onResize = () => {
        if(window.innerWidth > 1200 && document.getElementById("arrow-container").dataset.open == "closed") {
            document.getElementById("color-change").style.width = "120px";
            document.getElementById("color-change").style.height = "120px";
            document.getElementById("arrow-left").style = "top: 35px; left: 24px;";
            document.getElementById("arrow-right").style = "top: 35px; right: 24px;";
        } else if(window.innerWidth <= 1200 && document.getElementById("arrow-container").dataset.open == "closed" ) {
            document.getElementById("color-change").style.width = "90px";
            document.getElementById("color-change").style.height = "90px";
            document.getElementById("arrow-left").style = "top: 22px; left: 12px;";
            document.getElementById("arrow-right").style = "top: 22px; right: 12px;";
        }

        if(window.innerWidth > 1200 && document.getElementById("arrow-container").dataset.open == "open") {
            document.getElementById("arrow-left").style = "top: 35px; left: 24px;";
            document.getElementById("arrow-right").style = "top: 35px; right: 24px;";
            document.getElementById("color-change").style.height = "120px";
            document.getElementById("color-change").style.width = "90vw";
        } else if(window.innerWidth <= 1200 && document.getElementById("arrow-container").dataset.open == "open" ) {
            document.getElementById("arrow-left").style = "top: 22px; left: 12px;";
            document.getElementById("arrow-right").style = "top: 22px; right: 12px;";
            document.getElementById("color-change").style.height = "90px";
            document.getElementById("color-change").style.width = "90vw";
        }

        if(window.innerWidth < 660 && document.getElementById("arrow-container").dataset.open == "open") {
            document.getElementById("color-change").style.marginTop = "250px";
            document.getElementById("color-change").style.width = "500px";
        }
        else document.getElementById("color-change").style.marginTop = "0";
    };

    window.addEventListener("resize", onResize);

    const arrowsOnMouseOver = () => {
        let r = document.querySelector(':root');
        let rs = getComputedStyle(r).getPropertyValue("--body-background-color");
        if(document.getElementById("arrow-container").dataset.open == "closed") {
            document.getElementById("arrow-container").style.backgroundColor = rs;
        }
    }

    const arrowsOnMouseOut = () => {
        document.getElementById("arrow-container").style.background = "transparent";
    }

    const changeColor = (palate) => {
        const r = document.querySelector(':root');
        const colorsToChange = ["--body-background-color",
        "--main-background-color",
        "--menu-background-color",
        "--menu-background-color-hover",
        "--wheel-background-color",
        "--spin-background-color",
        "--text-input-background-color",
        "--text-input-border-color",
        "--scrollbar-track-color",
        "--scrollbar-thumb-color",
        "--pop-up-container-color",
        "--color-change-background-color"];
        let colors = [];
        switch(palate) {
            case 1:
                colors = ["rgb(75, 76, 134)",
                "rgb(111, 78, 143)",
                "rgb(123, 34, 206)",
                "rgb(90, 30, 146)",
                "#0a2373",
                "rgb(17, 71, 121)",
                "rgba(80, 88, 155, 0.452)",
                "rgb(52, 50, 80)",
                "#4e7aff98",
                "#473f8a",
                "rgb(27, 29, 117)",
                "#6d689b"];
                setColorPalate(["#0a2373", "#184e80", "#227d87", "#45127a"]);
                r.style.setProperty('--left-background-color', "rgb(75, 76, 134)");
                document.getElementById("wheel-container").style.background = "#0a2373";
                setInputText(inputText => {
                    setInputSize(inputSize => {
                        handleWheelChange(inputText[inputText.length-1], inputText.length * 2 - 2, inputText.slice(0, inputText.length - 1), inputSize, ["#0a2373", "#184e80", "#227d87", "#45127a"]);
                        return inputSize;
                    });
                    return inputText;
                });
                break;
            case 2:
                colors = ["rgb(129, 36, 32)",
                "rgb(170, 85, 36)",
                "rgb(163, 19, 0)",
                "rgb(128, 23, 23)",
                "#a02626",
                "rgb(121, 17, 43)",
                "rgba(177, 20, 20, 0.452)",
                "rgb(102, 30, 42)",
                "#d19512",
                "#b8242498",
                "rgb(146, 28, 7)",
                "#a15252"];
                setColorPalate(["#a02626", "#9e4b32", "#8b6512", "#852d56"]);
                r.style.setProperty('--left-background-color', "rgb(129, 36, 32)");
                document.getElementById("wheel-container").style.background = "#a02626";
                setInputText(inputText => {
                    setInputSize(inputSize => {
                        handleWheelChange(inputText[inputText.length-1], inputText.length * 2 - 2, inputText.slice(0, inputText.length - 1), inputSize, ["#a02626", "#9e4b32", "#8b6512", "#852d56"]);
                        return inputSize;
                    });
                    return inputText;
                });
                break;
            case 3:
                colors = ["rgb(26, 110, 26)",
                "rgb(78, 143, 103)",
                "rgb(14, 151, 128)",
                "rgb(6, 128, 150)",
                "#145a0b",
                "rgb(12, 139, 161)",
                "rgba(80, 128, 155, 0.452)",
                "rgb(50, 80, 60)",
                "#00a01b98",
                "#11775e",
                "rgb(14, 94, 18)",
                "#689b82"];
                setColorPalate(["#145a0b", "#004e2e", "#25791e", "#0f584c"]);
                r.style.setProperty('--left-background-color', "rgb(26, 110, 26)");
                document.getElementById("wheel-container").style.background = "#145a0b";
                setInputText(inputText => {
                    setInputSize(inputSize => {
                        handleWheelChange(inputText[inputText.length-1], inputText.length * 2 - 2, inputText.slice(0, inputText.length - 1), inputSize, ["#145a0b", "#004e2e", "#25791e", "#0f584c"]);
                        return inputSize;
                    });
                    return inputText;
                });
                break;
            case 4:
                colors = ["rgb(102, 30, 98)",
                "rgb(131, 15, 146)",
                "rgb(197, 28, 183)",
                "rgb(233, 17, 150)",
                "#a82476",
                "rgb(106, 41, 126)",
                "rgba(95, 17, 105, 0.452)",
                "rgb(77, 14, 71)",
                "#de36e498",
                "#5f245f",
                "rgb(125, 22, 129)",
                "#b34db3"];
                setColorPalate(["#a82476", "#920b5e", "#920b43", "#721866"]);
                r.style.setProperty('--left-background-color', "rgb(102, 30, 98)");
                document.getElementById("wheel-container").style.background = "#a82476";
                setInputText(inputText => {
                    setInputSize(inputSize => {
                        handleWheelChange(inputText[inputText.length-1], inputText.length * 2 - 2, inputText.slice(0, inputText.length - 1), inputSize, ["#a82476", "#920b5e", "#920b43", "#721866"]);
                        return inputSize;
                    });
                    return inputText;
                });
                break;
            
        }
        for(let i = 0; i < colorsToChange.length; i++) {
            r.style.setProperty(colorsToChange[i],colors[i]);
        }
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
                        <div id="add-input-list" className="menu-options1" onClick={() => openInputTable()}>Add Inputs</div>
                        <div id="remove-inputs" className="menu-options1" onClick={() => openDelete()}>Remove All Inputs</div>
                        <div id="toggle-duration" className="menu-options2">Wheel Duration: {wheelDuration}s
                            <input id="duration-range" type="range" max={10} min={1} defaultValue={4} onChange={(e) => handleToggleDuration(e.target.value)}></input>
                        </div>
                        <div id="toggle-sound" className="menu-options2">Volume: {volume}
                            <input id="volume" type="range" defaultValue={50} min={0} max={100} onChange={(e) => handleVolumeChange(e.target.value)}></input>
                        </div>
                </div>
            </div>

            <div id="color-change">
                <div id="arrow-container" className="pointer-hover arrow-container-hover" data-open="closed" onClick={() => expandPalate()}></div>
                <div className="arrows pointer-hover" id="arrow-left" onClick={() => expandPalate()} onMouseOver={() => arrowsOnMouseOver()} onMouseOut={() => arrowsOnMouseOut()}>^</div>
                <div className="arrows pointer-hover" id="arrow-right" onClick={() => expandPalate()} onMouseOver={() => arrowsOnMouseOver()} onMouseOut={() => arrowsOnMouseOut()}>^</div>

                <div id="color-palate-1" className="color-palate pointer-hover" onClick={() => changeColor(1)}>
                    <div id="color-palate-1-color-1" className="color-examples"></div>
                    <div id="color-palate-1-color-2" className="color-examples"></div>
                    <div id="color-palate-1-color-3" className="color-examples"></div>
                    <div id="color-palate-1-color-4" className="color-examples"></div>
                </div>
                <div id="color-palate-2" className="color-palate pointer-hover" onClick={() => changeColor(2)}>
                    <div id="color-palate-2-color-1" className="color-examples"></div>
                    <div id="color-palate-2-color-2" className="color-examples"></div>
                    <div id="color-palate-2-color-3" className="color-examples"></div>
                    <div id="color-palate-2-color-4" className="color-examples"></div>
                </div>
                <div id="color-palate-3" className="color-palate pointer-hover" onClick={() => changeColor(3)}>
                    <div id="color-palate-3-color-1" className="color-examples"></div>
                    <div id="color-palate-3-color-2" className="color-examples"></div>
                    <div id="color-palate-3-color-3" className="color-examples"></div>
                    <div id="color-palate-3-color-4" className="color-examples"></div>
                </div>
                <div id="color-palate-4" className="color-palate pointer-hover" onClick={() => changeColor(4)}>
                    <div id="color-palate-4-color-1" className="color-examples"></div>
                    <div id="color-palate-4-color-2" className="color-examples"></div>
                    <div id="color-palate-4-color-3" className="color-examples"></div>
                    <div id="color-palate-4-color-4" className="color-examples"></div>
                </div>
            </div>

            <div id="black-screen"></div>

            <div id="win-container">
                <div id="win-exit-button" className="pointer-hover"  onClick={() => handleWinClose()}>x</div>
                <div id="win-message"><div id="win-name">{winVal[0]}</div> <div id="smaller-text">was selected</div></div>
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

            <div id="add-input-container">
                <div id="add-input-exit-button" className="pointer-hover" onClick={() => closeInputTable()}>X</div>
                <p className="add-input-text-labels">Current text (uneditable):</p>
                <p className="add-input-text-labels">New text:</p>
                <textarea id="current-text" value={inputText.toString().replace(/,/g, "\n")} readOnly></textarea>
                <textarea id="new-text" placeholder="Type to add new text;
Seperate inputs by new lines
or by comma (,)" onChange={(e) => setNewText(e.target.value)} value={newText}></textarea>
                <button id="add-input-confirm" onClick={(e) => newText == "" ? closeInputTable() : addInputTable(newText.split(/[\n,]/))}>Confirm</button>
                <button id="add-input-cancel" onClick={() => closeInputTable()}>Cancel</button>
            </div>

            <div id="delete-all-inputs">
                <p id="delete-sure">Are you sure?</p>
                <button onClick={() => deleteAll()} className="delete-all-inputs-buttons">Yes</button>
                <button className="delete-all-inputs-buttons" onClick={() => closeDelete()}>Cancel</button>
            </div>
        </div>
    );
}

export default App;