let addBtn=document.querySelector(".addBtn");
let sheet1=document.querySelector(".sheet");

//make sheet1 active
sheet1.addEventListener("click",function(e){
    handleActive(e);
});


//on add button click
addBtn.addEventListener("click",function(e){
    console.log("sheet add button clicked");
    let allsheets=document.querySelectorAll(".sheet");
    let newsheet=document.createElement("div");
    newsheet.setAttribute("class","sheet activesheet");
    allsheets.forEach(element => {
        element.classList.remove("activesheet");
    });
    let id=Number(allsheets[allsheets.length-1].getAttribute("id"));
    newsheet.setAttribute("id",id+1);
    newsheet.textContent=`Sheet ${id+2}`;
    newsheet.addEventListener("click",function(e){
        handleActive(e);
    });
    createSheet();
    sheetDB=sheetArr[sheetArr.length-1];
    addBtn.parentElement.appendChild(newsheet);
})

//creates a 2d array of cell object and adds it to sheetarr
function createSheet() {
    let NewDB = [];
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
        NewDB.push(row);
    }
    sheetArr.push(NewDB);

}


//fetches the sheetDb from sheet array to set ui
function setUI() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let elem = 
            document.querySelector(`.grid .cells[rid='${i}'][cid='${j}']`);
            let value = sheetDB[i][j].value;
            elem.innerText = value;
        }
    }
}


//handles all the things that need to be done when sheet are made active
function handleActive(e){
    let allsheets=document.querySelectorAll(".sheet");
    let sheet = e.currentTarget;
    let idx = sheet.getAttribute("id");
    allsheets.forEach(element => {
        element.classList.remove("activesheet");
    });
    e.target.classList.add("activesheet");
    if (!sheetArr[idx]) {
        // only when you init the workbook
        createSheet();
    }
    // current set 
    sheetDB = sheetArr[idx];
    setUI();
}