(function () {
  var myObj;
  var fromItem = 10;
  var loadedData = document.getElementById("loadedData");
  const xmlhttp = new XMLHttpRequest();
  var loadedArray = [];
  var sortedData = [];
  xmlhttp.onload = function () {

    if (this.readyState === 4 && this.status === 200) {
      myObj = JSON.parse(this.responseText);
      sortedData = myObj.data.sort(compareByDate);
      // for(var i = 0; i < sortedData.length; i++){
      //   sortedData
      // }
      initialLoad();
    }
  };

  xmlhttp.onerror = function (err) {
    console.log(err);
  };

  xmlhttp.open("GET", "https://api.myjson.com/bins/152f9j", true);
  xmlhttp.send();

  window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      loadedArray = loadedArray.concat(sortedData.splice(0,10));
      renderHTML();
    }
  };

  function initialLoad() {
    var htmlString = "";
    loadedArray = loadedArray.concat(sortedData.splice(0,10));
    for (var i = 0; i < loadedArray.length; i++) {
      var createdAt  = getDate(loadedArray[i]);
      htmlString += '<div class="item"><div class="item_title"><p>'+i+loadedArray[i].title+'</p></div><div class="item_description"><p>'+loadedArray[i].description+'</p></div><div class="item_image"><p>'+loadedArray[i].image+'</p></div><div class="item_created_at"><p>'+createdAt+'</p></div><div class="item_tags"><p>'+loadedArray[i].tags+'</p></div></div>';

    }
    loadedData.insertAdjacentHTML('beforeend', htmlString);
  }

  function renderHTML() {
    var innerArr = loadedArray.concat();//copy of array
    innerArr = innerArr.splice(fromItem,10);
    var htmlString = "";
    for (var i = 0; i < innerArr.length; i++) {
      var createdAt  = getDate(innerArr[i]);
      var formattedI = i+fromItem;
      htmlString += '<div class="item"><div class="item_title"><p>'+formattedI+loadedArray[i].title+'</p></div><div class="item_description"><p>'+loadedArray[i].description+'</p></div><div class="item_image"><p>'+loadedArray[i].image+'</p></div><div class="item_created_at"><p>'+createdAt+'</p></div><div class="item_tags"><p>'+loadedArray[i].tags+'</p></div></div>';

    }
    loadedData.insertAdjacentHTML('beforeend', htmlString);
    fromItem+=10;
  }

  function getDate(date){
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var createdAt = new Date(date.createdAt);
    var day = createdAt.getDate();
    var monthIndex = createdAt.getMonth();
    var year = createdAt.getFullYear();
    var n = createdAt.toLocaleTimeString();

    return monthNames[monthIndex] + ' ' + day + ', ' +year + ', ' + n;
  }
  function compareByDate(a,b){
    a = new Date(a.createdAt);
    b = new Date(b.createdAt);
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  }

}());
