const companyNameAndLogo = document.getElementById("companyNameAndLogo");

activateLoader();
function activateLoader() {
  companyNameAndLogo.innerHTML = `<div class="spinner-border spinner-border-lg text-primary" style="width: 3rem; height: 3rem;" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
    `;
}

function deactivateLoader() {
  companyNameAndLogo.innerHTML = `<img src="#" alt="Logo" id="companyLogo" class="company-logo" />
  <span class="company-name" id="companyTitle">Company Name</span>`;
}

const urlParams = new URLSearchParams(window.location.search);
const symbolAsArray = urlParams.getAll("symbol");
const symbolString = symbolAsArray.toString();

const chartValuesDataObject = [];
const chartLabelsDataObject = [];

var stocksChart = document.getElementById("stockHistoryChart").getContext("2d");

const data = {
  labels: chartLabelsDataObject,
  datasets: [
    {
      label: "Stock Price History",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: chartValuesDataObject,
    },
  ],
};

function printCompanyDetails(companyData) {
  const companyImage = companyData.profile.image;
  const companyName = companyData.profile.companyName;
  const companyPrice = companyData.profile.price;
  const companyPriceCurrency = companyData.profile.currency;
  const companyPriceChange = companyData.profile.changes;
  const companyDescription = companyData.profile.description;
  const companyWebsite = companyData.profile.website;
  document.getElementById("companyLogo").src = companyImage;
  document.getElementById("companyTitle").innerHTML = companyName;
  document.getElementById("stockPrice").innerHTML =
    "Price: " + companyPrice + " " + companyPriceCurrency;
  const priceChange = document.getElementById("stockChange");
  priceChange.innerHTML = "(" + companyPriceChange + "%)";
  if (companyPriceChange < 0) {
    priceChange.style.color = "red";
  } else {
    priceChange.style.color = "#00cc00";
  }
  document.getElementById("companyDescription").innerHTML = companyDescription;
  document.getElementById("companyWebsite").href = companyWebsite;
}

function printPriceHistoryChart(historyData) {
  const historyArray = historyData.historical;
  const displayedPeriod = historyArray.slice(-10);
  displayedPeriod.forEach((displayedPeriod) => {
    chartLabelsDataObject.push(displayedPeriod.date);
    chartValuesDataObject.push(displayedPeriod.close);
  });
  const stockHistoryChart = new Chart(stocksChart, {
    type: "line",
    data: data,
    options: {},
  });
}

async function fetchPriceHistory() {
  try {
    const priceHistoryURL =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/" +
      symbolString +
      "?serietype=line";
    const priceHistoryResponse = await fetch(priceHistoryURL);
    const historyData = await priceHistoryResponse.json();
    printPriceHistoryChart(historyData);
  } catch (err) {
    console.log("There was an error getting info from server");
  }
}

async function fetchCompanyData() {
  try {
    const companyProfileURL =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
      symbolString;
    const companyDataResponse = await fetch(companyProfileURL);
    const companyData = await companyDataResponse.json();
    deactivateLoader();
    printCompanyDetails(companyData);
  } catch (err) {
    console.log("There was an error getting info from server");
  }
}

fetchPriceHistory();
fetchCompanyData();
