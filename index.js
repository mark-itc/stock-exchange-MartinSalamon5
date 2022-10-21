import { MarqueeClass } from "./marquee.js";

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
    deactivateLoader();
  }
}

function printSearchResults(resultsData, companyData) {
  const stockResult = document.createElement("li");
  searchResultsBox.appendChild(stockResult);
  stockResult.classList.add("list-group-item");
  const companyLogo = `<img src="${companyData.profile.image}" style="height: 30px;" alt="" id="companyLogo" class="company-logo"/>`;
  if (companyData.profile.changes < 0) {
    const companyStockChanges = `(<span style="color: red;">${companyData.profile.changes.toFixed(
      2
    )}</span>)`;
    stockResult.innerHTML = `${companyLogo}   <a style="text-decoration: none; color: black;" href="/company.html?symbol=
    ${resultsData.symbol}">${resultsData.name}   (${resultsData.symbol}) ${companyStockChanges}</a>`;
  } else {
    const companyStockChanges = `(<span style="color: green;">${companyData.profile.changes.toFixed(
      2
    )}</span>)`;
    stockResult.innerHTML = `${companyLogo}   <a style="text-decoration: none; color: black;" href="/company.html?symbol=
    ${resultsData.symbol}">${resultsData.name}   (${resultsData.symbol}) ${companyStockChanges}</a>`;
  }
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
    const searchResultsURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInputValue}&amp;limit=10&amp;exchange=NASDAQ`;
    fetchSearchResults(searchResultsURL);
  } else {
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
    const marquee = new MarqueeClass(marqueeData);
    marquee.createMarquee();
  } catch (err) {
    console.log("error in initializeMarquee");
  }
}

initializeSearcher();
initializeMarquee();
