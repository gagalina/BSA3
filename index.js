(function () {
  const xmlhttp = new XMLHttpRequest();
  var allData = [];
  var renderedData = [];
  var sortTag = [];
  var searchQuery = '';
  var tagSelect = document.getElementById("tagSelect");

  document.getElementById("search").addEventListener('input',onSearch);
  //keyup

  tagSelect.addEventListener('change', onSelectChange);
  var from = 0;

  xmlhttp.onload = function () {

    if (this.readyState === 4 && this.status === 200) {
      allData = JSON.parse(this.responseText).data;

      var isInStorage = checkStorage();

      if (isInStorage) {
        var fromStorage = localStorage.getItem('tag');
        sortTag.push(fromStorage);
        tagSelect.value = fromStorage;

        sortTag = [sortTag];
        allData.sort(sortByTagAndDate);
        renderedData = allData.slice(from, from + 10);
        renderHtml(renderedData);
        from += 10;

      } else {
        allData.sort(compareByDate);
        renderedData = allData.slice(from, from + 10);
        renderHtml(renderedData);
        from += 10;
      }

    }

  };
  xmlhttp.open("GET", "https://api.myjson.com/bins/152f9j", true);
  xmlhttp.send();


  window.onscroll = function () {

    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      renderedData = renderedData.concat(allData.slice(from, from + 10));
      console.log(allData.length);
      renderHtml(renderedData);
      from += 10;

    }
  };

  function onSelectChange() {

    sortTag = [tagSelect.value];
    from = 0;
    allData.sort(sortByTagAndDate);
    renderedData = allData.slice(from, from + 10);
    renderHtml(renderedData);
    from += 10;
    localStorage.setItem('tag', sortTag);
  }

  function renderHtml(data) {

    var mainContainer = document.getElementById("loadedData");
    mainContainer.innerHTML = "";
    data.map(function (el) {

      var textImgEl = document.createElement("img");
      textImgEl.classList.add('item_image');
      var item = document.createElement("div");
      item.classList.add('item');
      var textTitleEl = document.createElement("h2");
      textTitleEl.classList.add('item_title');
      var textDescriptionEl = document.createElement("p");
      textDescriptionEl.classList.add('item_description');
      var textDateEl = document.createElement("time");
      textDateEl.classList.add('item_date');
      var textTagsEl = document.createElement("p");
      textTagsEl.classList.add('item_tags');
      var textButtonEl = document.createElement("button");
      textButtonEl.classList.add('item_delete_btn');
      textButtonEl.setAttribute("data-title", el.title);
      textButtonEl.addEventListener('click', deleteItem);


      textTitleEl.innerHTML = el.title;

      textDescriptionEl.textContent = el.description;
      textImgEl.src = el.image;
      textImgEl.style.float = "left";
      textImgEl.style.marginRight = "10px";
      textDateEl.textContent = formatDate(el.createdAt);
      textTagsEl.textContent = el.tags.join('/');
      textButtonEl.textContent = "DELETE";

      item.appendChild(textImgEl);
      item.appendChild(textTitleEl);
      item.appendChild(textDescriptionEl);
      item.appendChild(textDateEl);
      item.appendChild(textTagsEl);
      item.appendChild(textButtonEl);

      mainContainer.appendChild(item);


    });

  }

  function deleteItem(e) {

    var selectedItem = e.target.attributes.getNamedItem("data-title").nodeValue;

    console.log(selectedItem)
    for (var i = 0; i < allData.length; i++) {
      if (allData[i].title === selectedItem) {
        allData.splice(i, 1);
        renderedData = allData.slice(0, from);
        renderHtml(renderedData);
      }
    }
  }


  function checkStorage() {
    if (localStorage.getItem('tag') !== null) {
      return true;
    } else {
      return false;
    }
  }

  function onSearch(e){
    searchQuery = e.target.value;
    renderedData =  filterByTitle(allData).slice(0,10);
    renderHtml(renderedData);
  }


  function filterByTitle(data) {

    return data.filter(function (el) {
      if(el.title.includes(searchQuery)){
        //highlight(searchQuery, el);
        return true;
      }
      return false;
    });

  }

  //Currentlu for 1 letter
  function highlight(text, element)
  {
    var inputText = element;
    var innerHTML = inputText.title;
    var index = innerHTML.indexOf(text);
    if ( index >= 0 )
    {
      console.log(innerHTML);
      //innerHTML = innerHTML.substring(0,index)+ "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
      inputText.title = innerHTML;
    }

  }


  function compareByDate(a, b) {
    a = new Date(a.createdAt);
    b = new Date(b.createdAt);
    if (a < b)
      return 1;
    if (a > b)
      return -1;
    return 0;
  }


  function sortByTagAndDate(a, b) {
    document.getElementById("demo").innerHTML = "You selected: " + sortTag;
    var aTags = a.tags;
    var bTags = b.tags;
    var aHasCategory = categoryChecker(aTags);
    var bHasCategory = categoryChecker(bTags);

    var el1 = {isInTags: aHasCategory, date: new Date(a.createdAt)};
    var el2 = {isInTags: bHasCategory, date: new Date(b.createdAt)};

    return mainSortByTag(el1, el2);
  }

  function categoryChecker(data) {
    return sortTag.some(function (v) {
    return data.includes(v)
  });
  }

  function mainSortByTag(a, b) {


    var aIsIn = a.isInTags;
    var bIsIn = b.isInTags;
    var aDate = a.date;
    var bDate = b.date;

    if (aIsIn === bIsIn) {
      return (aDate < bDate) ? 1 : (aDate > bDate) ? -1 : 0;
    }
    else {
      return (aIsIn < bIsIn) ? 1 : -1;
    }
  }

  function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var createdAt = new Date(date);
    var day = createdAt.getDate();
    var monthIndex = createdAt.getMonth();
    var year = createdAt.getFullYear();
    var n = createdAt.toLocaleTimeString();

    return monthNames[monthIndex] + ' ' + day + ', ' + year + ', ' + n;
  }


}());


