const mockData = MockDataProvider.getMockData();
const sanitizer = SanitizerModule;
const keyboardUtils = KeyboardUtilsModule;
const searchHelper = Search;
const templateMaker = TemplateGenerator;

const KeyBoard = {
  DOWN: "down",
  UP: "UP"
};

let prevoiusSearchTerm = void 0;

//searchbar keyup event listener
document.getElementById("searchbar").addEventListener("keyup", event => {
  let resultsWrapper = document.querySelector(".search__results-container");

  if (event.keyCode === 13 || event.which === 13) {
    let searchTerm = sanitizer.sanitizeString(event.currentTarget.value);

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

    let resultList = searchHelper.searchData(workingDataCopy, searchTerm);
    let templateString = void 0;

    if (resultList.length > 0) {
      templateString = templateMaker.getResultsTpl(resultList, searchTerm);
      templateString += `<i class="absolute fa fa-close" id="cancel-search"></i>`;
    } else {
      templateString = templateMaker.getNoReultsTpl();
    }

    resultsWrapper.innerHTML = templateString;

    let closeBtn = document.getElementById("cancel-search");
    closeBtn && attachCloseBtnClickListener(closeBtn, resultsWrapper);

    attachMouseOverListener(resultsWrapper);
    attachMouseLeaveListener(resultsWrapper);
  } else if (event.keycode === 40 || event.which === 40) {
    handleKeyBoardInterrupts(resultsWrapper, KeyBoard.DOWN);
  } else if (event.keycode === 38 || event.which === 38) {
    handleKeyBoardInterrupts(resultsWrapper, KeyBoard.UP);
  }
  //downarrow = 40
  //uparrow =38
});

//habdle down arrow keyboard input
const handleKeyBoardInterrupts = (resultsWrapper, direction) => {
  let currentActiveCard = document.querySelector(".result-data.active");
  if (currentActiveCard) {
    direction === KeyBoard.DOWN
      ? keyboardUtils.nextCard(currentActiveCard)
      : keyboardUtils.previousCard(currentActiveCard);
  } else {
    resultsWrapper.firstChild.classList.add("active");
  }
  keyboardUtils.setScrollPosition(
    document.querySelector(".result-data.active"),
    resultsWrapper
  );
  document.getElementById("searchbar").focus();
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

//closeBtn handler
const attachCloseBtnClickListener = (closeBtn, resultsWrapper) => {
  closeBtn.addEventListener("click", () => {
    resultsWrapper.innerHTML = null;
    prevoiusSearchTerm = void 0;
    let searchBar = document.getElementById("searchbar");
    searchBar.value = "";
    searchBar.focus();
  });
};
