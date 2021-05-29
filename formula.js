// setting the value of cell object when another cell selected
allCells.forEach(function(cell){
    cell.addEventListener("blur",function(){
        let rid = cell.getAttribute("rid");
        let cid = cell.getAttribute("cid");
        rid = Number(rid);
        cid = Number(cid);
        let cellObject = sheetDB[rid][cid];
        let data=cell.innerHTML;
        // cell click -> no change
        if (cellObject.value == data) {
            return;
        }
        // formula -> manual set
        if (cellObject.formula) {
            removeFormula(cellObject, address);
            formulaBar.value = "";
        }
        cellObject.value=data;
        // console.log(cellObject.children);
        updateChildren(cellObject);
    })
})

// parent ->chrildren ->  remove
// formula clear 
function removeFormula(cellObject, myName) {
    // formula -> parent -> children remove yourself
    let formula = cellObject.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid];
            let idx = parentObj.children.indexOf(myName);
            parentObj.children.splice(idx, 1);
        }
    }
    cellObject.formula = "";
}

// register yourself as children of the parent(cells that are appearing in the formula)
function setParentCHArray(formula, chAddress) {
    // (A1 +A2 )
    let formulaTokens = formula.split(" ");
    let flag=true;
    // console.log(formulaTokens.length);
    formulaTokens.forEach(function (token) {
        let ascii = token.charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(token);
            let parentObj = sheetDB[rid][cid];
            if(isSafe(token,chAddress)){
                parentObj.children.push(chAddress);
                // console.log(token,parentObj.children)
                //return true;
            }
            else{
                alert("Cycle formed");
                flag=flag && false;
            }
        }
    });
    return flag;
}

function isSafe(parentobj,chAddress){
    // let address =
    //         `${String.fromCharCode(65 + parentobj.cid)}${parentobj.rid + 1}`;
    let res=cycle(parentobj,chAddress);
    // console.log(res);
    return res;
}

function cycle(address,chAddress) {
    // console.log(address,chAddress);
    if(address==chAddress){
        return false;
    }
    let {rid,cid}=getRIDCIDfromAddress(chAddress);
    let obj=sheetDB[rid][cid];
    let children=obj.children;
    let res=true;
    console.log("children",children,address);
    for(let i=0;i<children.length;i++){
        res= cycle(address,children[i]) && res;
    }
    return res;
}

//update the values of children
function updateChildren(cellObject) {
    let children = cellObject.children;
    for (let i = 0; i < children.length; i++) {
        // children name
        let chAddress = children[i];
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        // 2d array
        let childObj = sheetDB[rid][cid];
        // get formula of children
        let chFormula = childObj.formula;
        let newValue = evaluateFormula(chFormula);
        SetChildrenCell(newValue, chFormula, rid, cid);
        // if you are updating your value then  
        // someone may have included you in there formula so you need to tell them to evaluate there value
        updateChildren(childObj);
    }
}
//update the values in db as well as ui
function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    // db update 
    let uiCellElement =
        document.querySelector(`.cells[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    sheetDB[rid][cid].value = value;
    // sheetDB[rid][cid].formula = formula;
}

//what all needs to be done when formula entered
formulaBar.addEventListener("keydown",function(e){
    if(e.key=="Enter" && formulaBar.value){
        let currentFormula=formulaBar.value;
        let address = addressInput.value;
        let { rid, cid } = getRIDCIDfromAddress(address);
        let cellObject = sheetDB[rid][cid];
        
        // formula update
        if (currentFormula != cellObject.formula) {
            removeFormula(cellObject, address);
        }
        let value = evaluateFormula(currentFormula);
        let res=setParentCHArray(currentFormula, address)
        // console.log(res)
        if(res==true)
        setCell(value, currentFormula);
    }
})


// turns the variables into value
function evaluateFormula(formula){
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let value = sheetDB[rid][cid].value;
            if (value == "") {
                value = 0;
            }
            formulaTokens[i] = value;
        }
    }
    // [(,10,+,20,)]
    let evaluatedFormula = formulaTokens.join(" ");
    // ( 10 + 20 )  
    // stack 
    return infixEvaluation(evaluatedFormula);
}

//sets the value on db and ui
function setCell(value, formula) {
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;
    // db update 
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDB[rid][cid].value = value;
    sheetDB[rid][cid].formula = formula;
}

//priority of operators

function priority(op) {
    if(op == '*' || op == '/') {
        return 2;
    } else if(op == '+' || op == '-') {
        return 1;
    } else {
        return 0;
    }
}

// evaluate individual expressions
function evaluate(val1,val2,op) {
    // console.log(val1);
    if(!isNaN(val1))
    val1=Number(val1);
    if(!isNaN(val2))
    val2=Number(val2);

    // console.log(val1,val2);
    if(op == '*') {
        return val1 * val2;
    } else if(op == '/') {
        return val1 / val2;
    } else if(op == '+') {
        if(isNaN(val1)){
            // console.log(`${val1}+${val2}`);
            return `${val1}${val2}`;
        }
        return val1 + val2;
    } else if(op == '-') {
        return val1 - val2;
    } else {
        return 0;
    }
}

//evaluate expression
function infixEvaluation(exp){
        let ostack = [] // operator stack
        let vstack = []; // value stack
        exp=exp.split(" ");
        for(let i = 0; i < exp.length; i++) {
            let ch = exp[i];
            // console.log(ch);
            if(ch=='+'|| ch=='-'||ch=='*'||ch=='/') {
                // console.log(Number(ch));
                while(ostack.length > 0 && ostack[ostack.length-1] != '(' && 
                            priority(ostack[ostack.length-1] ) >= priority(ch)) {
                    // process
                    let op = ostack.pop();
                    let val2 = vstack.pop();
                    let val1 = vstack.pop();

                    let res = evaluate(val1, val2, op);
                    vstack.push((res));
                }
                ostack.push(ch);
            } else if(ch == '(') {
                ostack.push(ch);
            } else if(ch == ')') {
                while(ostack[ostack.length-1]  != '(') {
                    let op = ostack.pop();
                    let val2 = vstack.pop();
                    let val1 = vstack.pop();

                    let res = evaluate(val1, val2, op);
                    // console.log(Number(res));
                    vstack.push((res));
                }
                ostack.pop(); // this pop is for opening bracket
            } else {
                vstack.push((ch));
            }
        }
        // console.log(ostack.length);
        // console.log(vstack);
        while(ostack.length > 0) {
            let op = ostack.pop();
            let val2 = vstack.pop();
            let val1 = vstack.pop();

            let res = evaluate(val1, val2, op);
            vstack.push((res));
        }
        // console.log(Number(vstack[vstack.length-1]));
        return (vstack[vstack.length-1]) ;

}