export class MarqueeClass {
  constructor(marqueeData) {
    this.marqueeData = marqueeData;
  }
  createMarquee() {
    this.marqueeData.forEach((marqueeData) => {
      const marqueeElement = document.createElement("span");
      marqueeElement.classList.add("marquee-element");
      document.getElementById("marqueeBox").appendChild(marqueeElement);
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
  }
}
