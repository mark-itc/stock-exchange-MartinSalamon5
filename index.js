const searchButton = document.getElementById("searchButton");
const searchResultsBox = document.getElementById("searchResultsBox");
const marqueeBox = document.getElementById("marqueeBox");

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
    deactivateLoader();
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
      for (let i = 0; i < 10; i++) {
        const companyProfileURL =
          "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
          resultsData[i].symbol;
        getLogoAndStockPercentage(resultsData[i], companyProfileURL);
      }
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

async function initializeMarquee() {
  try {
    const marqueeLink =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quote/AAPL,FB,GOOG,TSLA,AMD,SNAP,XLF,BAC,BMW.DE,GDX";
    const marqueeStocksResponse = await fetch(marqueeLink);
    const marqueeData = await marqueeStocksResponse.json();
    marqueeData.forEach((marqueeData) => {
      console.log(marqueeData.symbol + ` ` + marqueeData.changesPercentage);
      const marqueeElement = document.createElement("span");
      marqueeElement.classList.add("marquee-element");
      marqueeBox.appendChild(marqueeElement);
      marqueeElement.innerHTML =
        marqueeData.symbol +
        ` ` +
        marqueeData.changesPercentage.toFixed(2) +
        `%`;
      if (marqueeData.changesPercentage < 0) {
        marqueeElement.style.color = "red";
      } else {
        marqueeElement.style.color = "green";
      }
    });
    console.log(marqueeData);
  } catch (err) {
    console.log("error in marquee init");
  }
}

initializeSearcher();
initializeMarquee();
