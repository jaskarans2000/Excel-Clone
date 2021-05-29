let toprow=document.querySelector(".toprow");
let leftcol=document.querySelector(".leftcol");
let grid=document.querySelector(".grid");
let bold=document.querySelector(".bold");
let italic=document.querySelector(".italic");
let strikeThrough=document.querySelector(".strike-through");
let addressInput=document.querySelector(".address");
let formulaBar=document.querySelector(".formula");
let alignContainer=document.querySelector(".align-container");
let fontcolor=document.querySelector(".font-color");
let bgcolor=document.querySelector(".bg-color");
let fontsize=document.querySelector(".fontsize");
let fontFamily=document.querySelector(".font-family");

//top row
for(let i=0;i<26;i++){
    let div=document.createElement("div");
    div.setAttribute("class","cell");
    div.textContent=String.fromCharCode(65+i);
    toprow.appendChild(div);
}

//left col
let cols=26;
for(let i=0;i<100;i++){
    let div=document.createElement("div");
    div.setAttribute("class","box");
    div.textContent= i+1;
    leftcol.appendChild(div);
}

//grid
let rows=100;
for(let i=0;i<rows;i++){
    let row=document.createElement("div");
    row.setAttribute("class","row");
    for(let j=0;j<cols;j++){
        let cell=document.createElement("div");
        cell.setAttribute("class","cells");
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);
        cell.setAttribute("contenteditable","true");
        row.appendChild(cell);
    }
    grid.appendChild(row);
}
let sheetArr=[];
//setting sheetDB for first time
let sheetDB = [];
for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        let cell = {
            bold: false,
            italic: false,
            strikeThrough:false, hAlign: "center",
            fontFamily: "sans-serif"
            , fontSize: "16",
            color: "black",
            bColor: "#FFFFFF",
            value: "",
            formula: "",
            children: []
        }
        let elem = document.querySelector(`.grid .cells[rid='${i}'][cid='${j}']`);
        elem.innerText = "";
        row.push(cell);
    }
    sheetDB.push(row);
}
sheetArr.push(sheetDB);

// event listener add click;
let allCells = document.querySelectorAll(".grid .cells");
allCells.forEach(function(cell){
    cell.addEventListener("click",function(){
        // address get current cell
        let rid = cell.getAttribute("rid");
        let cid = cell.getAttribute("cid");
        handleCellActive(cell);
        rid = Number(rid);
        cid = Number(cid);
        let address =
            `${String.fromCharCode(65 + cid)}${rid + 1}`;
        // alert(address);
        addressInput.value = address;
        let cellObject = sheetDB[rid][cid];
        // toolbar cell sync 
        if (!cellObject.bold) {
            bold.classList.remove("active-btn");
        } else {
            bold.classList.add("active-btn");
        }

        if (!cellObject.strikeThrough) {
            strikeThrough.classList.remove("active-btn");
        } else {
            strikeThrough.classList.add("active-btn");
        }

        if (!cellObject.italic) {
            italic.classList.remove("active-btn");
        } else {
            italic.classList.add("active-btn");
        }
        fontsize.value=cellObject.fontSize;
        let allallignments=alignContainer.children;
        for(let i=0;i<allallignments.length;i++){
            allallignments[i].classList.remove("active-btn");
            // console.log(allallignments[i].classList);
        }
        let center=alignContainer.children[2];
        center.classList.add("active-btn");
        fontcolor.value=cellObject.color;
        bgcolor.value=cellObject.bColor;
        if (cellObject.formula) {
            formulaBar.value = cellObject.formula;
        } else {
            formulaBar.value = "";
        }
    })
})

let firstcells=document.querySelector('.cells[rid="0"][cid="0"]');
firstcells.classList.add("active");
firstcells.style.border="1px solid blue";
let address=document.querySelector(".address");
let str=String.fromCharCode(65)+" "+1;
address.value=str;


// handles functionality that needs to be done when cell made active
function handleCellActive(e){
    let cells=document.querySelectorAll(".cells");
    cells.forEach(function(cell){
        cell.classList.remove("active");
        cell.style.border="0.1px solid #a9a9a973";
    })
    e.classList.add("active");
    e.style.border="1px solid blue";
}

// making Bold
bold.addEventListener("click",function(e){
    let uiCellElement=findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    if(cellObject.bold){
        bold.classList.remove("active-btn");
        uiCellElement.style.fontWeight = "normal";
        cellObject.bold = false;
    }else{
        uiCellElement.style.fontWeight = "bold";
        bold.classList.add("active-btn");
        cellObject.bold = true;
    }
})

// making italic
italic.addEventListener("click",function(e){
    let uiCellElement=findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    if(cellObject.italic){
        italic.classList.remove("active-btn");
        uiCellElement.style.fontStyle = "normal";
        cellObject.italic = false;
    }else{
        uiCellElement.style.fontStyle = "italic";
        italic.classList.add("active-btn");
        cellObject.italic = true;
    }
})

// making strike through
strikeThrough.addEventListener("click",function(e){
    let uiCellElement=findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    if(cellObject.strikeThrough){
        strikeThrough.classList.remove("active-btn");
        uiCellElement.style.textDecoration="none";
        cellObject.strikeThrough = false;
    }else{
        uiCellElement.style.textDecoration = "line-through";
        strikeThrough.classList.add("active-btn");
        cellObject.strikeThrough = true;
    }
})

//left right center align
alignContainer.addEventListener("click",function(e){
    let alignment=e.target.parentElement.classList[0];
    let allallignments=alignContainer.children;
    for(let i=0;i<allallignments.length;i++){
        allallignments[i].classList.remove("active-btn");
        // console.log(allallignments[i].classList);
    }
    let uiCellElement=findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    //console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    uiCellElement.style.textAlign = alignment;
    e.target.parentElement.classList.add("active-btn");
    cellObject.hAlign = alignment;
})

//fontcolor
fontcolor.addEventListener("input",function(){
    let uiCellElement=findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    // console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    uiCellElement.style.color=fontcolor.value;
    cellObject.color=fontcolor.value;   
})

//bgcolor
bgcolor.addEventListener("input",function(){
    let uiCellElement=findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    // console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    uiCellElement.style.backgroundColor=bgcolor.value;
    cellObject.bcolor=bgcolor.value;   
})

//fontsize
fontsize.addEventListener("change",function(e){
    let val = fontsize.value;
    let uiCellElement = findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    // console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    cellObject.fontSize=val;
    uiCellElement.style.fontSize = val + "px";

})

//fontfamily
fontFamily.addEventListener("change",function(e){
    let val = fontFamily.value;
    let uiCellElement = findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    // console.log(sheetDB)
    let cellObject = sheetDB[rid][cid];
    cellObject.fontFamily=val;
    if(val=="sans-serif"){
        uiCellElement.style.fontFamily = `'Roboto', sans-serif`;
    }
})

//to find element from address bar
function findUICellElement() {
    let address = addressInput.value;
    let ricidObj = getRIDCIDfromAddress(address);
    let rid = ricidObj.rid;
    let cid = ricidObj.cid;
    let uiCellElement =
        document.querySelector(`.cells[rid="${rid}"][cid="${cid}"]`)
    return uiCellElement;
}

// Address (string)-> rid /cid
function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
}