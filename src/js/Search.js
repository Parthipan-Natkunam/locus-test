const Search = (() => {
  //perform search by the given category
  /*
  @input 
    String property - property to filter
    String searchTerm
    Array inputArr
  @returns
    Array filtered results
*/
  const _performSearchBy = (property, searchTerm, inputArr) => {
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
      let tempResultsArr = _performSearchBy(
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

  return {
    searchData: (inboundResultsArr, searchTerm) => {
      return getSearchResults(inboundResultsArr, searchTerm);
    }
  };
})();
