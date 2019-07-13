const TemplateGenerator = (() => {
  //no results template
  /*
  @input NA
  @returns String template string for no results card
*/
  const generateNoResultsTpl = () => {
    let tplString = `<div class="search__result-card no-result relative">
                    <b>No User Found</b>
                   </div>
                   <i class="absolute fa fa-close" id="cancel-search"></i>`;
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
      let sanitizedResult = sanitizer.sanitizeResultObject(result);
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

  return {
    getNoReultsTpl: () => {
      return generateNoResultsTpl();
    },
    getResultsTpl: (resultArr, searchTerm) => {
      return generateResultsTpl(resultArr, searchTerm);
    }
  };
})();
