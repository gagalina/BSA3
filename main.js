(function () {
  var myObj;
  var fromItem = 10;
  var loadedData = document.getElementById("loadedData");
  const xmlhttp = new XMLHttpRequest();
  var loadedArray = [];
  xmlhttp.onload = function () {

    if (this.readyState === 4 && this.status === 200) {
      myObj = JSON.parse(this.responseText);
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
      loadedArray = loadedArray.concat(myObj.data.splice(0,10));
      renderHTML();
    }
  };

  function initialLoad() {
    var htmlString = "";
    loadedArray = loadedArray.concat(myObj.data.splice(0,10));
    for (var i = 0; i < loadedArray.length; i++) {
      htmlString += "<p>" + loadedArray[i].title + i + "</p>";
    }
    loadedData.insertAdjacentHTML('beforeend', htmlString);
  }


  function renderHTML() {
    var innerArr = loadedArray.concat();//copy of array
    innerArr = innerArr.splice(fromItem,10);
    var htmlString = "";
    for (var i = 0; i < innerArr.length; i++) {
      var formattedI = i+fromItem;
      htmlString += "<p>" + innerArr[i].title + formattedI + "</p>";
    }
    loadedData.insertAdjacentHTML('beforeend', htmlString);
    fromItem+=10;
  }


}());
