let dropBtn=document.querySelector(".dropbtn");
let newBtn=document.querySelector(".new");
let openBtn=document.querySelector(".open");
let saveBtn=document.querySelector(".save");
let filename=document.querySelector(".filename");
let overlay=document.querySelector(".overlay");
// let cross=document.querySelector(".cross");
let openFile=document.querySelector(".openFile");

dropBtn.addEventListener("click",myFunction);
//to make content of dropdown visible
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

//new btn
newBtn.addEventListener("click",function(e) {
    location.reload();
})

//save Btn
saveBtn.addEventListener("click",function(){
    //2d arrayy save file 
    const data = JSON.stringify(sheetArr);
    // convert it into blob
    // data -> file like object convert
    const blob = new Blob([data], { type: 'application/json' });
    // convert it any type file into url
    const url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    // content in that file
    a.href = url;
    // file download
    a.download = `${filename.value}.json`;
    // anchor click
    a.click();
})


openBtn.addEventListener("click",function () {
     overlay.style.display="block";  
})


openFile.addEventListener("change", function () {
    let filesArray = openFile.files;

        let fileObj = filesArray[0];
        // file reader to read the file
        let fr = new FileReader();
        // read as text 
        fr.readAsText(fileObj);
        // fr.onload = function () {
        //     // 3 darray
        //     console.log(fr.result);
        //     // sheet array 
        //     sheetArr = fr.result;
        //     sheetDB = sheetArr[0];
        //     // first sheet db get 
        //     setUI();
        //     // setUi call
        // }
        fr.addEventListener("load", function () {
            // console.log(fr.result);
            console.log(fr.result);
            // sheet array 
            sheetArr = JSON.parse(fr.result);
            sheetDB = sheetArr[0];
            // first sheet db get 
            setUI();
            overlay.style.display="none";
        })
    
        // console.log("After");
})