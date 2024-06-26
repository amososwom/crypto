let username = document.getElementById("username");
let userimg = document.getElementById("userimg");
let coinComment = document.getElementById("coincomment")
let cryptoSampleHtml = document.getElementById("crypto-sample");
let sendContent = document.getElementById('sendcontent');
let investCoin = document.getElementById('investcoin');
let invest = document.getElementById("investing")
let tableBody = document.getElementById("tableBody");
let transTable = document.getElementById("transTable");
const baseUrl = "http://localhost:3000/";
const cryptoApi = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
const cryptoImg = "https://www.coingecko.com/coins/"
const svg = "/sparkline.svg"
let currentDate = new Date().toISOString();

fetchCryptoData()

function show(values){
        console.log(values);
}

function blurScreen(res = false){
      let myScreen = document.querySelector(".blurdiv");
        if(res){
                myScreen.style.display = "grid";
        }else{
                myScreen.style.display = "none";
        }
}
function loadingSvg(res = false){
  let myScreen = document.querySelector(".loadingjson");
    if(res){
            myScreen.style.display = "grid";
    }else{
            myScreen.style.display = "none";
    }
}

async function requestData(url, method = "GET", myBody = null) {
        let request = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
        if (myBody != null) {
            request = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(myBody)
            }
        }
    try{
        const response = await fetch(url, request);
        const data = await response.json(); // Parse JSON response
        return data;
    } catch (e) {
      updateDomElements("statusresponse",`Hopefully this ${baseUrl} is running from your Terminal for it to work, and also My api allows only 5 request in a minute ${e} `)
    }
}

async function fetchCryptoData() {
  try{
        const data = await requestData(cryptoApi, "GET", null);
      if(data.length > 0){
        loadingSvg(false)
        selectedCoin(data[getRandomNumber(1,20)])
          cryptoSample(data);
          listedCoins(data)
          
          document.getElementById("cryptoserach").addEventListener( 'input',  function() {
            filterData(this.value);
          });

          function filterData(query) {
            const filteredData = data.filter(item => {
              return item.name.toLowerCase().includes(query.toLowerCase());
            });
              listedCoins(filteredData)
          }

      }else{
        alert("We couldnt Receive our Info At the Seems we encounterd An empty list of Records Plaese refresh after a min")
      }
    } catch (e) {
      alert(`Failed to fetch cryptocurrency data: ${error.message}`);
    }
}

function closeDiv(id){
        blurScreen(false)
        document.getElementById(id).style.display = "none";
}

function openDiv(id){
        blurScreen(true)
        document.getElementById(id).style.display = "grid";
}

username.addEventListener("input", function() {
         let randomInteger = getRandomNumber(1,18)

         let alluserimgs = document.querySelectorAll("#userimg")

        fetch(`${baseUrl}users/?id=${randomInteger}`)
            .then((response)=> response.json())
            .then(data => { 
              let imgFile = data[0].fileName;
                alluserimgs.forEach( function(img) {
                        img.src=`./users/${imgFile}`
                });
            })
})

function updateDomElements(element = null, valueContent = null){
  let domElements = document.querySelectorAll(`#${element}`)

  domElements.forEach( function(innerDom) {
    innerDom.innerHTML= valueContent;
});

}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function coinCardNumber(){
    let defaultNumber = 4
    let i = 0;
    let result = "";
  
    while( i < defaultNumber){
      let inresult = "";
      let n = 0;
      while( n < defaultNumber){
        inresult += getRandomNumber(0, 9);
        n++
        
      }
      result += inresult+ " ";
      i++
    }
    updateDomElements("invisanumber",result)
    return result;
  }

function formatDate(originalDateString) {
        // creates new object for thedate
        const originalDate = new Date(originalDateString);
        let year = originalDate.getFullYear().toString().slice(-2);
        // Format the date components eg 24 April 11:24 AM
        const formattedDate = `${year} ${getMonthName(originalDate.getMonth())} ${originalDate.getDate()}, ${formatHour(originalDate.getHours())}:${padZero(originalDate.getMinutes())} ${getMeridiem(originalDate.getHours())}`;
      
        return formattedDate;
      }
      
      // returns the month from the array 
      function getMonthName(monthIndex) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[monthIndex];
      }
      
      // format the hour for AM/PM 0 = 12
      function formatHour(hour) {
        return hour % 12 || 12; 
      }
      
      //returns the AM or PM 
      function getMeridiem(hour) {
        return hour >= 12 ? "PM" : "AM";
      }
      
      // Function to pad single digit minutes with leading zero
      function padZero(number) {
        return number.toString().padStart(2, '0');
      }

function listedCoins(data)
{ 
  tableBody.innerHTML = "";
  for(coins of data){
        let coinRank  = coins.market_cap_rank;
        let coinName = coins.name;
        let coinSymbol = coins.symbol.toUpperCase();
        let coinPrice = '$'+coins.current_price.toFixed(2);
        let coinPriceChange = coins.price_change_24h;
        let coinRate = coins.price_change_percentage_24h;
        let coinImage = coins.image;
        let coinSvg = extractSvgNumber(coinImage)
        let rateColor;
        let rateIcon;
        coinPriceChange = "$"+Number(coinPriceChange.toString().replace("-","")).toFixed(2);

        if(coinRate > 0){
          rateColor = "greenyellow"
          rateIcon = "fa-caret-up"
        } else {
          rateColor = "danger"
          rateIcon = "fa-caret-down"
          coinPriceChange = "-"+coinPriceChange
        }
        coinRate = Number(coinRate.toString().replace("-","")).toFixed(2);

      let cryptotr = document.createElement('tr');
      cryptotr.innerHTML = `
      <td>${coinRank}</td>
      <td><div class="tabledivimg">
          <img src="${coinImage}" alt=""> ${coinName} <i>${coinSymbol}</i>
      </div></td>
      <td>${coinPrice}</td>
      <td class="${rateColor}"><i class="${rateColor} fa-solid ${rateIcon}"></i> ${coinRate}%</td>
      <td>${coinPriceChange}</td>
      <td><div class="tablegraph">
          <img class="" src="${coinSvg}" alt="${coinName}">
      </div></td>`;

      tableBody.appendChild(cryptotr)
      function runOutterSelectedCoin(eachCoin){
        return function() { 
          selectedCoin(eachCoin)
          closeDiv("cryptolist")
        }
      }
  
      cryptotr.addEventListener('click', runOutterSelectedCoin(coins))

    }
}

function cryptoSample(data){

  for(coins of data){
  let coinName = coins.name;
  let coinSymbol = coins.symbol.toUpperCase();
  let coinPrice = '$'+coins.current_price.toFixed(2);
  let coinPriceChange = coins.price_change_24h;
  let coinRate = coins.price_change_percentage_24h;
  let coinImage = coins.image;
  let coinSvg = extractSvgNumber(coinImage)
  let rateColor;
  let rateIcon;
  coinPriceChange = "$"+Number(coinPriceChange.toString().replace("-","")).toFixed(2);

  if(coinRate > 0){
    rateColor = "greenyellow"
    rateIcon = "fa-caret-up"
  } else {
    rateColor = "danger"
    rateIcon = "fa-caret-down"
    coinPriceChange = "-"+coinPriceChange
  }
  coinRate = Number(coinRate.toString().replace("-","")).toFixed(2);

  let cryptoDiv = document.createElement('div');
  cryptoDiv.className = "cryptodiv";
   cryptoDiv.innerHTML = `
  <div class="cryptotitle">
      <div class="cryptoicon">
          <img src="${coinImage}" alt="${coinName} Logo">
      </div>
      <div class="cryptonames">
      <span>${coinName}</span>
      <span>${coinSymbol}</span>
  </div>
  </div>
  <div class="cryptomoney">
      <span>${coinPrice}</span>
      <span class="${rateColor}"><i class="${rateColor} fa-solid ${rateIcon}"></i> ${coinRate}%</span>
      <div class="imggraph">
          <img class="sparkline-img" src="${coinSvg}" alt="${coinName}">
      </div>
  </div>`;

  function runOutterSelectedCoin(eachCoin){
      return function() { 
        selectedCoin(eachCoin)
      }
    }

    cryptoDiv.addEventListener('click', runOutterSelectedCoin(coins))

  cryptoSampleHtml.appendChild(cryptoDiv)
  }
}
        
function extractSvgNumber(url){
        const urlParts = url.split("/");
        const numberPart = urlParts[urlParts.length - 3];
        const number = parseInt(numberPart);
        return cryptoImg+number+svg
}

function selectedCoin(coins)
{
        let coinId  = coins.id;
        let coinRank  = coins.market_cap_rank;
        let coinName = coins.name;
        let coinSymbol = coins.symbol.toUpperCase();
        let coinPrice = '$'+coins.current_price.toFixed(2);
        let coinPriceChange = coins.price_change_24h;
        let coinRate = coins.price_change_percentage_24h;
        let coinLastUpdate = formatDate(coins.last_updated);
        let coinath = "$"+coins.ath.toFixed(2);
        let coinatl = "$"+coins.atl.toFixed(2);
        let coinAthDate = formatDate(coins.ath_date);
        let coinAtlDate = formatDate(coins.atl_date);
        let coinImage = coins.image;
        let coinSvg = extractSvgNumber(coinImage)
        let rateColor;
        let rateIcon;
        let coindomimg = document.getElementById('coindomimg');
        let investCoin = document.getElementById('investcoin');

        coinPriceChange = "$"+Number(coinPriceChange.toString().replace("-","")).toFixed(2);

        if(coinRate > 0){
          rateColor = "greenyellow"
          rateIcon = "fa-caret-up"
        } else {
          rateColor = "danger"
          rateIcon = "fa-caret-down"
          coinPriceChange = "-"+coinPriceChange
        }
        let calcRate = Math.abs(coinRate);
        let realRate = coinRate;
        coinRate = Number(coinRate.toString().replace("-","")).toFixed(2)+"%";


        updateDomElements("domcoinsymbol",coinSymbol);
        updateDomElements("coindomname",coinName);
        updateDomElements("coindomprice",coinPrice);
         updateDomElements("coindomrank",coinRank);
         updateDomElements("coindompricechange",coinPriceChange);
         updateDomElements("coindomdate",coinLastUpdate);
         updateDomElements("coindomhighest",` ${coinath} <small>(${coinAthDate})</small>`);
         updateDomElements("coindomlowest",` ${coinatl} <small class="danger">(${coinAtlDate})</small>`);
         updateDomElements("coindompricepercent",`<i class="${rateColor} fa-solid ${rateIcon}"></i>  ${coinRate}`);
         updateDomElements("coinrates",`${coinName} <i class="${rateColor} fa-solid ${rateIcon}"></i>  ${coinRate}`);
        coindomimg.src = coinImage;   
        coinCardNumber();
        coinComments(coinId, coinName);
        coinTransactions(coinId)


        sendContent.onsubmit  = (e) => {
          e.preventDefault();
          show("in event");
         postComment(coinId,coinName)
        };
        investCoin.onsubmit  = (e) => {
          e.preventDefault();
          postInvestment(coinId, coinName, coinImage, coinSymbol, realRate, coinSvg)
        };

        invest.addEventListener('input', function() {
         let amount = Number(this.value)
         let intrest = amount * Number(calcRate) + amount;
          document.getElementById("receiving").value = Number(intrest).toFixed(2);
        })
}
function coinComments(coinId, coinName = "Coin"){
  let chatsDiv = document.getElementById("chats-div");
  chatsDiv.innerHTML = "";
    async function fetchCoinComments() {
      const data = await requestData(`${baseUrl}comments/?id=${coinId}`, "GET", null);
    if(data.length > 0){
      for(values of data){
        let commentDiv = document.createElement('div');
        commentDiv.className = 'inchat';
       commentDiv.innerHTML = `
        <div class="userchat">
            <img src="${values.profileImage}" alt="${values.id}">
            <span>@${values.username}</span>
        </div>
        <div class="msgchat">${values.comment}</div>
        <span class="chattime">${formatDate(values.commentDate)}</span>`;
        chatsDiv.appendChild(commentDiv);
        coinComment.placeholder = `Type a comment on ${coinName}...`;
        }
    }else{
      coinComment.placeholder = `Be the First to comment on ${coinName}...`;
    }
  }

  fetchCoinComments()
}

function postComment(coinId, coinName){
  currentDate = new Date().toISOString();
  let usernameValue = document.getElementById("username").value;
  let userimgSrc = document.getElementById("userimg").getAttribute("src");
  let coinCommentValue = document.getElementById("coincomment").value;

    let comment = {
      "id": coinId,
      "username": usernameValue,
      "comment": coinCommentValue,
      "profileImage": userimgSrc,
      "commentDate": currentDate
    }
    async function postChatComent() {
        let data = await requestData(`${baseUrl}comments/`, "POST", comment);
          alert("Comment Updated Successfully, Many Regards " + usernameValue);
        
    }
   postChatComent();
    coinComments(coinId, coinName);
    sendContent.reset();
    show("reached post comment")
}


function coinTransactions(coinId){
  transTable.innerHTML = "";
  let i = 1;
  async function fetchCoinTransaction() {
    try{
    const data = await requestData(`${baseUrl}transactions/?coinId=${coinId}`, "GET", null);
  if(data.length > 0){
    for(values of data){
      let transTime = formatDate(values.date);
      let coinRate = values.dailyRate
      let invested = "$"+values.invested.toFixed(2);
      let profit = "$"+values.profit.toFixed(2);
      let coinSymbol = values.coinSymbol.toUpperCase()
      
      if(coinRate > 0){
        rateColor = "greenyellow"
        rateIcon = "fa-caret-up"
      } else {
        rateColor = "danger"
        rateIcon = "fa-caret-down"
      }

      let commentTr = document.createElement('tr');
     commentTr.innerHTML = `
     <td>${i++}</td>
     <td><div class="tabledivimg">
         <img src="${values.profileImage} " alt="${values.username} "> @${values.username} 
     </div></td>
      <td><div class="tabledivimg">
     <img src="${values.coinImg}" alt="${coinSymbol}"> 
     ${values.coinName} <i>${coinSymbol}</i>
 </div></td>
 <td>${invested}</td>
     <td class="${rateColor}"><i class="${rateColor} fa-solid ${rateIcon}"></i> ${Math.abs(coinRate)}%</td>
     <td class="greenyellow" >${profit}</td>
     <td> <span class="greenyellow">${transTime}</span></td>
     <td><div class="tablegraph">
         <img class="" src="${values.weekGraph}" alt="${coinSymbol}">
     </div></td>
      `;

      transTable.appendChild(commentTr);
      }
  }else{
    transTable.innerHTML = `<tr><td  colspan="8">Be the first To make a Transaction</td></tr>`;
  }
} catch (e) {
  transTable.innerHTML = `<tr><td  colspan="8">Sorry We couldnt Grab any Records at The Moment Kind Regards</td></tr>`;
  show(e)
}
}

fetchCoinTransaction()


}
function postInvestment(coinId, coinName, coinImage, coinSymbol, coinRate, coinGraph){
  currentDate = new Date().toISOString();
  const usernameValue = document.getElementById("username").value;
  const userimgSrc = document.getElementById("userimg").getAttribute("src");
  let receiving = document.getElementById("receiving").value;
  let investing = document.getElementById("investing").value;
  
  let comment = {
    "coinId": coinId,
    "username": usernameValue,
    "profileImage": userimgSrc,
    "coinImg": coinImage,
    "coinName": coinName,
    "coinSymbol": coinSymbol,
    "invested": Number(investing), 
    "dailyRate": coinRate,
    "profit": Number(receiving), 
    "date": currentDate,
    "weekGraph": coinGraph
  } 
  async function postTransactions() {
    const data = await requestData(`${baseUrl}transactions/`, "POST", comment);
      alert("Transaction Updated Successfully, Many Regards " + usernameValue);
    
}

postTransactions();
coinTransactions(coinId);
investCoin.reset();
}