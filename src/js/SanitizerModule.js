const SanitizerModule = (() => {
  const sanitizeInputString = inputString => {
    tempString = inputString.trim();
    //replace all special chrarcters
    tempString = tempString.replace(/[^\w\s]/gi, "");
    return tempString;
  };

  //sanitize result data
  /*
  @input 
    result Object
  @returns sanitized output Object
  @description Handles undefined properties if any from the server's response
  */
  const sanitizeResultObject = result => {
    let { id, name, items, address, pincode, wasItemSearch } = result;
    result.id = id || "";
    result.name = name || "NA";
    result.items = items && items.length > 0 ? items : [];
    result.address = address || "";
    result.pincode = pincode || "";
    result.wasItemSearch = !!wasItemSearch;
    return result;
  };

  return {
    sanitizeString: str => {
      return sanitizeInputString(str);
    },
    sanitizeResultObject: obj => {
      return sanitizeResultObject(obj);
    }
  };
})();
