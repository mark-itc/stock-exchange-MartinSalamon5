class SearchForm {
  constructor(formBox) {
    this.formBox = formBox;
    formBox.innerHTML = `<form class="d-flex searcher-form" id="searcher"><input id="searchInput" class="form-control me-2" type="text" placeholder="Search"/><button id="searchButton" class="btn btn-outline-success search-button" type="submit">Search</button></form>`;
  }
  onSearch(renderResults) {
    function initializeSearcher() {
      const searcher = document.getElementById("searcher");
      searcher.addEventListener("submit", activateLoader);
      searcher.addEventListener("submit", sendSearchWords);
      searcher.addEventListener("input", clearSearchResults);
    }
    const searchButton = document.getElementById("searchButton");
    const searchResultsBox = document.getElementById("searchResultsBox");

    function activateLoader() {
      searchButton.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
          `;
    }

    function deactivateLoader() {
      searchButton.innerHTML = `Search`;
    }

    function sendSearchWords(e) {
      e.preventDefault();
      clearSearchResults();
      const searchInput = document.getElementById("searchInput");
      const searchInputValue = searchInput.value;
      if (searchInputValue != "") {
        const searchResultsURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInputValue}&amp;limit=10&amp;exchange=NASDAQ`;
        renderResults(searchResultsURL);
      } else {
        deactivateLoader();
      }
    }

    function clearSearchResults() {
      searchResultsBox.innerHTML = "";
    }

    initializeSearcher();
  }
}
