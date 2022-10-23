class MarqueeClass {
  constructor(marqueeBox) {
    this.marqueeBox = marqueeBox;
  }
  createMarquee() {
    async function initializeMarquee() {
      try {
        const marqueeLink =
          "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quote/AAPL,FB,GOOG,TSLA,AMD,SNAP,XLF,BAC,BMW.DE,GDX";
        const marqueeStocksResponse = await fetch(marqueeLink);
        const marqueeData = await marqueeStocksResponse.json();
        marqueeData.forEach((marqueeData) => {
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
      } catch (err) {
        console.log("error in initializeMarquee");
      }
    }
    initializeMarquee();
  }
}
