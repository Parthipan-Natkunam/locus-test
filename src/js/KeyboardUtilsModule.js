const KeyboardUtilsModule = (() => {
  //keyboard highlights
  const highlightNextCard = currentCard => {
    let nextCard = currentCard.nextElementSibling;
    if (nextCard && nextCard.className.includes(" result-data ")) {
      currentCard.classList.remove("active");
      nextCard.classList.add("active");
    }
  };

  const highlightPreviousCard = currentCard => {
    let previousCard = currentCard.previousElementSibling;
    if (previousCard && previousCard.className.includes(" result-data ")) {
      currentCard.classList.remove("active");
      previousCard.classList.add("active");
    }
  };

  //Scroll into view
  const scrollToView = (card, wrapper) => {
    wrapper.scrollTop = card.offsetTop - card.clientHeight;
  };

  return {
    nextCard: card => {
      highlightNextCard(card);
    },
    previousCard: card => {
      highlightPreviousCard(card);
    },
    setScrollPosition: (card, wrapper) => {
      scrollToView(card, wrapper);
    }
  };
})();
