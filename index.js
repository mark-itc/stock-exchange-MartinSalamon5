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

function printSearchResults(resultsData) {
  searchResultsBox.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const stockResult = document.createElement("li");
    searchResultsBox.appendChild(stockResult);
    stockResult.classList.add("list-group-item");
    stockResult.innerHTML =
      "<a href=/company.html?symbol=" +
      resultsData[i].symbol +
      ">" +
      resultsData[i].name +
      "  " +
      "(" +
      resultsData[i].symbol +
      ")" +
      "</a>";
  }
}

function noAvailableSearchResults() {
  if (searchResultsBox.innerHTML == "") {
    const stockResult = document.createElement("li");
    searchResultsBox.appendChild(stockResult);
    stockResult.classList.add("list-group-item");
    stockResult.innerHTML = "Sorry, this stock is currently unavailable.";
    stockResult.style.color = "blue";
  }
}

async function fetchSearchResults(searchResultsURL) {
  try {
    const searchResultsResponse = await fetch(searchResultsURL);
    const resultsData = await searchResultsResponse.json();
    console.log(resultsData);
    deactivateLoader();
    if (resultsData.length < 1) {
      console.log("less than 1 result");
      noAvailableSearchResults();
    } else {
      printSearchResults(resultsData);
    }
  } catch (err) {
    console.log("there was an error getting info from server");
  }
}

function sendSearchWords(e) {
  e.preventDefault();
  const searchInput = document.getElementById("searchInput");
  const searchInputValue = searchInput.value;
  if (searchInputValue != "") {
    const searchResultsURL =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
      searchInputValue +
      "&amp;limit=10&amp;exchange=NASDAQ";
    fetchSearchResults(searchResultsURL);
  } else {
    console.log("nothing to search");
    deactivateLoader();
  }
}

function clearSearchResults() {
  searchResultsBox.innerHTML = "";
}

function initializeSearcher() {
  const searcher = document.getElementById("searcher");
  searcher.addEventListener("submit", activateLoader);
  searcher.addEventListener("submit", sendSearchWords);
  searcher.addEventListener("input", clearSearchResults);
}

initializeSearcher();
