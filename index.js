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

function noAvailableSearchResults() {
  if (searchResultsBox.innerHTML == "") {
    const stockResult = document.createElement("li");
    searchResultsBox.appendChild(stockResult);
    stockResult.classList.add("list-group-item");
    stockResult.innerHTML = "Sorry, this stock is currently unavailable.";
    stockResult.style.color = "blue";
  }
}

function addCompanyPriceChangeColor() {
  const companyPriceChange = document.getElementById("companyPriceChange");
  if (companyPriceChange.innerHTML < 0) {
    companyPriceChange.style.color = "red";
  } else if (companyPriceChange.innerHTML < 0) {
    companyPriceChange.style.color = "green";
  }
}

function printSearchResults(resultsData, companyData) {
  const stockResult = document.createElement("li");
  searchResultsBox.appendChild(stockResult);
  stockResult.classList.add("list-group-item");
  stockResult.innerHTML =
    `<img src="` +
    companyData.profile.image +
    `" style="height: 30px;" alt="" id="companyLogo" class="company-logo"/>` +
    `    ` +
    `<a style="text-decoration: none; color: black;" href="/company.html?symbol=` +
    resultsData.symbol +
    `">` +
    resultsData.name +
    `  ` +
    `(` +
    resultsData.symbol +
    `)` +
    `  (<span id="companyPriceChange">` +
    companyData.profile.changes +
    `</span>)</a>`;
}

async function getLogoAndStockPercentage(resultsData, companyProfileURL) {
  try {
    const companyDataResponse = await fetch(companyProfileURL);
    const companyData = await companyDataResponse.json();
    deactivateLoader();
    printSearchResults(resultsData, companyData);
  } catch (err) {
    console.log("some Error occurred in function getLogoAndStockPercentage");
  }
}

async function fetchSearchResults(searchResultsURL) {
  try {
    const searchResultsResponse = await fetch(searchResultsURL);
    const resultsData = await searchResultsResponse.json();
    if (resultsData.length < 1) {
      console.log("less than 1 result");
      noAvailableSearchResults();
    } else {
      // console.log(resultsData);
      for (let i = 0; i < 10; i++) {
        // resultsData.forEach((resultsData) => {
        const companyProfileURL =
          "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
          resultsData[i].symbol;
        // console.log(companyProfileURL);
        getLogoAndStockPercentage(resultsData[i], companyProfileURL);
      }
      // });
    }
  } catch (err) {
    console.log(
      "there was an error getting info from server / < than 10 results"
    );
  }
}

function sendSearchWords(e) {
  e.preventDefault();
  clearSearchResults();
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
