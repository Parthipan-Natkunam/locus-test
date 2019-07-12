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

//searchbar keyup event listener
document.getElementById("searchbar").addEventListener("keyup", event => {
  // handle older IE with event.which
  if (event.keyCode === 13 || event.which === 13) {
    const reultsWrapper = document.querySelector(".search__results-container");
    reultsWrapper.innerHTML = "";
    let searchTerm = event.currentTarget.value;

    if (!searchTerm) {
      return;
    }

    let resultList = getSearchResults(mockData, searchTerm);
    let templateString = void 0;

    if (resultList.length > 0) {
      resultList = sanitizeResultData(resultList);
      templateString = generateResultsTpl(resultList);
    } else {
      templateString = generateNoResultsTpl();
    }
    reultsWrapper.innerHTML = templateString;
  }
  //downarrow = 40
  //uparrow =38
});

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
  let tplString = `<div class="search__result-card no-result">
                    <b>No User Found</b>
                   </div>`;
  return tplString;
};

//generate reults data template
/*
  @input Array of results object
  @returns String template string for result card
*/
const generateResultsTpl = resultArr => {
  let resultsTplStr = "";
  resultArr.forEach(result => {
    let { id, name, items, address, pincode } = result;
    resultsTplStr += `<div class="search__result-card result-data">
                        <h6>${id}</h6>
                      </div>`;
  });
  return resultsTplStr;
};

//check if search returned results
/*
  @input DOMElement resultWrapper
  @returns boolean
  @description Check if results were populated for a specific search action
*/
const wasResultsPopulated = reultsWrapper => {
  return (
    reultsWrapper.nextElementSibling &&
    reultsWrapper.nextElementSibling.className.includes(" result-data ")
  );
};

//sanitize result data
/*
  @input result Object
  @returns sanitized output Object
  @description Handles undefined properties if any from the server's response
*/
const sanitizeResultData = result => {
  let { id, name, items, address, pincode } = result;
  result.id = id || "";
  result.name = name || "NA";
  result.items = (items && items.length > 0) || [];
  result.address = address || "";
  result.pincode = pincode || "";
  return result;
};
