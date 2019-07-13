const mockData = [
  {
    id: "123-s2-546",
    name: "John Jacobs",
    items: ["bucket", "bottle"],
    address: "1st Cross, 9th Main, abc Apartment",
    pincode: "5xx012"
  },
  {
    id: "123-s3-146",
    name: "David Mire",
    items: ["Bedroom Set"],
    address: "2nd Cross, BTI Apartment",
    pincode: "4xx012"
  },
  {
    id: "223-a1-234",
    name: "Soloman Marshall",
    items: ["bottle"],
    address: "Riverbed Apartment",
    pincode: "4xx032"
  },
  {
    id: "121-s2-111",
    name: "Ricky Beno",
    items: ["Mobile Set"],
    address: "Sunshine City",
    pincode: "5xx072"
  },
  {
    id: "123-p2-246",
    name: "Sikander Singh",
    items: ["Air Conditioner"],
    address: "Riverbed Apartment",
    pincode: "4xx032"
  },
  {
    id: "b23-s2-321",
    name: "Ross Wheeler",
    items: ["Mobile"],
    address: "1st Cross, 9th Main, abc Apartement",
    pincode: "5xx012"
  },
  {
    id: "113-n2-563",
    name: "Ben Bish",
    items: ["Kitchen Set", "Chair"],
    address: "Sunshine City",
    pincode: "5xx072"
  },
  {
    id: "323-s2-112",
    name: "John Michael",
    items: ["Refrigerator"],
    address: "1st Cross, 9th Main, abc Apartement",
    pincode: "5xx012"
  },
  {
    id: "abc-34-122",
    name: "Jason Jordan",
    items: ["Mobile"],
    address: "Riverbed Apartment",
    pincode: "4xx032"
  }
];

let prevoiusSearchTerm = void 0;

//searchbar keyup event listener
document.getElementById("searchbar").addEventListener("keyup", event => {
  let resultsWrapper = document.querySelector(".search__results-container");

  // handle older IE with event.which
  if (event.keyCode === 13 || event.which === 13) {
    let searchTerm = event.currentTarget.value.trim();

    //avoid multiple searches for the same search string
    if (searchTerm === prevoiusSearchTerm) {
      return;
    }
    prevoiusSearchTerm = searchTerm;

    resultsWrapper.innerHTML = "";

    //do not perform any action on empty search strings
    if (!searchTerm) {
      return;
    }

    //prevent mutation of the original Datastructure
    let workingDataCopy = JSON.parse(JSON.stringify(mockData));

    let resultList = getSearchResults(workingDataCopy, searchTerm);
    let templateString = void 0;

    if (resultList.length > 0) {
      templateString = generateResultsTpl(resultList, searchTerm);
    } else {
      templateString = generateNoResultsTpl();
    }
    resultsWrapper.innerHTML = templateString;

    attachMouseOverListener(resultsWrapper);
    attachMouseLeaveListener(resultsWrapper);
  } else if (event.keycode === 40 || event.which === 40) {
    handleDownKey(resultsWrapper);
  } else if (event.keycode === 38 || event.which === 38) {
    handleUpKey(resultsWrapper);
  }
  //downarrow = 40
  //uparrow =38
});

//habdle down arrow keyboard input
const handleDownKey = resultsWrapper => {
  let currentActiveCard = document.querySelector(".result-data.active");
  if (currentActiveCard) {
    highlightNextCard(currentActiveCard);
  } else {
    resultsWrapper.firstChild.classList.add("active");
  }
  scrollToView(document.querySelector(".result-data.active"), resultsWrapper);
  document.getElementById("searchbar").focus();
};

//handle uparrow key input
const handleUpKey = resultsWrapper => {
  let currentActiveCard = document.querySelector(".result-data.active");
  if (currentActiveCard) {
    highlightPreviousCard(currentActiveCard);
  } else {
    resultsWrapper.firstChild.classList.add("active");
  }
  scrollToView(document.querySelector(".result-data.active"), resultsWrapper);
  document.getElementById("searchbar").focus();
};

//initiate search and return final results
/*
  @input 
    Array of JSON parsed response Object (mockData, in this case)
    String searchTerm
  @returns 
    Array of matching response objects
*/
const getSearchResults = (inboundResultsArr, searchTerm) => {
  const searchables = ["id", "name", "address", "pincode", "items"];
  let searchResults = [];
  searchables.forEach(searchBy => {
    let tempResultsArr = performSearchBy(
      searchBy,
      searchTerm,
      inboundResultsArr
    );
    if (tempResultsArr.length > 0) {
      searchResults = [...searchResults, ...tempResultsArr];
    }
  });
  return searchResults;
};

//perform search by the given category
/*
  @input 
    String property - property to filter
    String searchTerm
    Array inputArr
  @returns
    Array filtered results
*/
const performSearchBy = (property, searchTerm, inputArr) => {
  const regularExp = new RegExp(searchTerm, "gi");
  let reultsArr = [];
  if (property !== "items") {
    reultsArr = inputArr.filter(object => {
      return object[property] && object[property].match(regularExp);
    });
  } else {
    //search based on items list
    let index = 0;
    while (index < inputArr.length) {
      inputArr[index][property] &&
        inputArr[index][property].forEach(item => {
          if (item.match(regularExp)) {
            inputArr[index].wasItemSearch = true;
            reultsArr.push(inputArr[index]);
          }
        });
      index++;
    }
  }
  return reultsArr;
};

//no results template
/*
  @input NA
  @returns String template string for no results card
*/
const generateNoResultsTpl = () => {
  let tplString = `<div class="search__result-card no-result relative">
                    <b>No User Found</b>
                    <i class="absolute fa fa-close" id="cancel-search"></i>
                   </div>`;
  return tplString;
};

//generate reults data template
/*
  @input 
  Array of results object
  String searchTerm
  @returns String template string for result card
*/
const generateResultsTpl = (resultArr, searchTerm) => {
  let resultsTplStr = "";
  resultArr.forEach(result => {
    let sanitizedResult = sanitizeResultData(result);
    let { id, name, address, wasItemSearch } = sanitizedResult;
    let itemTemplate = `<p class="items relative">${searchTerm} found in items</p>`;
    resultsTplStr += `<div class="search__result-card result-data relative">
                        <h3 class="id">${id}</h3>
                        <i class="name">${name}</i>
                        ${wasItemSearch ? itemTemplate : ""}
                        <p class="address">${address}</p>
                      </div>`;
  });
  return resultsTplStr;
};

//sanitize result data
/*
  @input 
    result Object
  @returns sanitized output Object
  @description Handles undefined properties if any from the server's response
*/
const sanitizeResultData = result => {
  let { id, name, items, address, pincode, wasItemSearch } = result;
  result.id = id || "";
  result.name = name || "NA";
  result.items = items && items.length > 0 ? items : [];
  result.address = address || "";
  result.pincode = pincode || "";
  result.wasItemSearch = !!wasItemSearch;
  return result;
};

//mouse highlight
const mouseoverCallback = ev => {
  ev.stopPropagation();
  let resultCard = ev.target.closest(".result-data");
  if (resultCard) {
    let currentActiveCard = document.querySelector(".result-data.active");
    currentActiveCard && currentActiveCard.classList.remove("active");
    resultCard.className += " active ";
  }
};

const mouseleaveCallback = ev => {
  ev.stopPropagation();
  let activeResultCard = document.querySelector(".result-data.active");
  if (activeResultCard) {
    activeResultCard.classList.remove("active");
  }
};

const attachMouseOverListener = resultsWrapper => {
  resultsWrapper &&
    resultsWrapper.addEventListener("mouseover", mouseoverCallback);
};

const attachMouseLeaveListener = resultsWrapper => {
  resultsWrapper &&
    resultsWrapper.addEventListener("mouseleave", mouseleaveCallback);
};

//keyboard highlights
const highlightNextCard = currentCard => {
  let nextCard = currentCard.nextElementSibling;
  if (nextCard) {
    currentCard.classList.remove("active");
    nextCard.classList.add("active");
  }
};

const highlightPreviousCard = currentCard => {
  let previousCard = currentCard.previousElementSibling;
  if (previousCard) {
    currentCard.classList.remove("active");
    previousCard.classList.add("active");
  }
};

//Scroll into view
const scrollToView = (card, wrapper) => {
  wrapper.scrollTop = card.offsetTop - card.clientHeight;
};
