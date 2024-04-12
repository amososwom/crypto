function show(values){
        console.log(values);
}

function blurScreen(res = false){
      let myScreen = document.querySelector(".blurdiv");
        if(res){
                myScreen.style.display = "block";
        }else{
                myScreen.style.display = "none";
        }
}

// blurScreen(true);

function closeDiv(id){
        blurScreen(false)
        document.getElementById(id).style.display = "none";
}

function openDiv(id){
        blurScreen(true)
        document.getElementById(id).style.display = "grid";
}