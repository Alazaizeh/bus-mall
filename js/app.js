"use strict";

let products = [];
let productsNames = [];
let productsViews = [];
let productsVotes = [];

let prevProducts = [];
let prevProductsNames = [];
let prevProductsViews = [];
let prevProductsVotes = [];

let img1Index = null;
let img2Index = null;
let img3Index = null;
let img1 = document.getElementById("img1");
let img2 = document.getElementById("img2");
let img3 = document.getElementById("img3");
let attempts = 0;
let maxAttempts = 25;
let indexArr = [];

function product(path) {
  this.name = path.split(".")[0];
  this.path = `img/${path}`;
  this.clicks = 0;
  this.views = 0;
  products.push(this);
}
function getRandomIndex() {
  return Math.floor(Math.random() * imgsPath.length);
}

function render() {
  indexArr.push(img1Index);
  indexArr.push(img2Index);
  indexArr.push(img3Index);
  img1Index = getRandomIndex();
  img2Index = getRandomIndex();
  img3Index = getRandomIndex();

  while (
    img1Index === img2Index ||
    img1Index === img3Index ||
    img2Index === img3Index ||
    indexArr.indexOf(img1Index) != -1 ||
    indexArr.indexOf(img2Index) != -1 ||
    indexArr.indexOf(img3Index) != -1
  ) {
    img1Index = getRandomIndex();
    img2Index = getRandomIndex();
    img3Index = getRandomIndex();
  }
  img1.setAttribute("src", products[img1Index].path);
  img2.setAttribute("src", products[img2Index].path);
  img3.setAttribute("src", products[img3Index].path);

  if (attempts != maxAttempts) {
    products[img1Index].views++;
    products[img2Index].views++;
    products[img3Index].views++;
  }
  indexArr = [];
}

img1.addEventListener("click", vote);
img2.addEventListener("click", vote);
img3.addEventListener("click", vote);

function vote(event) {
  if (attempts >= maxAttempts) {
    resultButton();
    img1.removeEventListener("click", vote);
    img2.removeEventListener("click", vote);
    img3.removeEventListener("click", vote);
  } else {
    if (event.target.id === "img1") {
      products[img1Index].clicks++;
    }
    if (event.target.id === "img2") {
      products[img2Index].clicks++;
    }
    if (event.target.id === "img3") {
      products[img3Index].clicks++;
    }
    attempts++;
    document.getElementById("attempts").textContent = attempts;

    if (attempts >= maxAttempts) {
      setCurrentData();
      resultButton();
      //remove prevResultBtnDiv
      document.getElementById("prevResultBtnDiv").style.display = "none";
      prevResultBtn.removeEventListener("click", showPreResult);
      document.getElementById("result").style.visibility = "hidden";
      document.getElementsByClassName("chartDiv")[0].style.display = "none";
      setPrevData();
      // setCurrentData(products, "prevProducts", attempts, "prevAttempts");

      img1.removeEventListener("click", vote);
      img2.removeEventListener("click", vote);
      img3.removeEventListener("click", vote);
    } else {
      setCurrentData();
      render();
    }
  }
}

function showResult() {
  let ul = document.getElementById("result");
  ul.textContent = "";
  let li;
  let span;
  for (let i = 0; i < products.length; i++) {
    li = document.createElement("li");
    span = document.createElement("span");
    span.textContent = `${products[i].name}`;
    span.id = "product-name";
    li.appendChild(span);
    span = document.createElement("span");
    span.textContent = ` has ${products[i].views} views and has ${products[i].clicks} vote. `;
    productsNames.push(products[i].name);
    productsViews.push(products[i].views);
    productsVotes.push(products[i].clicks);
    li.appendChild(span);
    ul.appendChild(li);
  }
  if (document.getElementById("finalResult") == null) {
    chartRender("finalResult", productsNames, productsViews, productsVotes);
  }

  //remove prevResult chart
  if (document.getElementById("prevResult") != null) {
    document.getElementById("prevResult").remove();
  }
  // ---------------

  if (
    document.getElementById("result").style.visibility == "hidden" &&
    document.getElementsByClassName("chartDiv")[0].style.display == "none"
  ) {
    document.getElementById("result").style.visibility = "visible";
    document.getElementsByClassName("chartDiv")[0].style.display = "block";
  } else {
    document.getElementById("result").style.visibility = "hidden";
    document.getElementsByClassName("chartDiv")[0].style.display = "none";
  }

  // resultBtn.removeEventListener("click", showResult);
}
function showPreResult() {
  let ul = document.getElementById("result");
  ul.textContent = "";
  let li;
  let span;
  getPrevData("prevProducts");

  for (let i = 0; i < prevProducts.length; i++) {
    prevProductsNames.push(prevProducts[i].name);
    prevProductsViews.push(prevProducts[i].views);
    prevProductsVotes.push(prevProducts[i].clicks);
  }

  if (document.getElementById("prevResult") == null) {
    chartRender(
      "prevResult",
      prevProductsNames,
      prevProductsViews,
      prevProductsVotes
    );
  }

  for (let i = 0; i < prevProducts.length; i++) {
    li = document.createElement("li");
    span = document.createElement("span");
    span.textContent = `${prevProducts[i].name}`;
    span.id = "product-name";
    li.appendChild(span);
    span = document.createElement("span");
    span.textContent = ` has ${prevProducts[i].views} views and has ${prevProducts[i].clicks} vote. `;
    li.appendChild(span);
    ul.appendChild(li);
  }

  if (document.getElementById("result").style.visibility == "hidden") {
    document.getElementById("result").style.visibility = "visible";
    document.getElementsByClassName("chartDiv")[0].style.display = "block";
  } else {
    document.getElementById("result").style.visibility = "hidden";
    document.getElementsByClassName("chartDiv")[0].style.display = "none";
  }

  // document.getElementById("prevResultBtnDiv").style.display = "none";
}

function resultButton() {
  let main = document.getElementsByTagName("main")[0];
  let resultBtnDiv = document.createElement("div");
  resultBtnDiv.id = "resultBtnDiv";
  let resultBtn = document.createElement("button");
  resultBtn.id = "resultBtn";
  resultBtn.textContent = "Result";
  resultBtnDiv.appendChild(resultBtn);
  main.appendChild(resultBtnDiv);

  resultBtn.addEventListener("click", showResult);
}

function prevResultButton() {
  let prevResultBtn = document.getElementById("prevResultBtn");
  prevResultBtn.addEventListener("click", showPreResult);
}

function chartRender(chartId, labelsArr, viewsArr, VotesArr) {
  let canvasDiv = document.getElementsByClassName("chartDiv")[0];
  var ctx = document.createElement("canvas");
  ctx.id = chartId;
  canvasDiv.appendChild(ctx);
  ctx = ctx.getContext("2d");

  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelsArr,
      datasets: [
        {
          label: "# of Votes",
          data: VotesArr,
          backgroundColor: ["#500250"],
          borderColor: ["black"],
          borderWidth: 1,
        },
        {
          label: "# of Views",
          data: viewsArr,
          backgroundColor: ["#ADEFD1FF"],
          borderColor: ["black"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function setCurrentData() {
  let stringifiedObject = JSON.stringify(products);
  localStorage.setItem("products", stringifiedObject);

  let stringifiedAttempts = JSON.stringify(attempts);
  localStorage.setItem("attempts", stringifiedAttempts);
}
function getPrevData(productsKey) {
  let stringifiedObject = localStorage.getItem(productsKey);
  let normalObject = JSON.parse(stringifiedObject);

  if (normalObject !== null) {
    if (attempts == maxAttempts) {
      localStorage.removeItem("products");
    } else {
      prevProducts = normalObject;
    }
  }
}

function setPrevData() {
  let stringifiedObject = JSON.stringify(products);
  localStorage.setItem("prevProducts", stringifiedObject);

  let stringifiedAttempts = JSON.stringify(attempts);
  localStorage.setItem("prevAttempts", stringifiedAttempts);
}

function getCurrentData(productsKey, attemptsKey) {
  let stringifiedObject = localStorage.getItem(productsKey);
  let normalObject = JSON.parse(stringifiedObject);

  let stringifiedAttempts = localStorage.getItem(attemptsKey);
  let normalAttempts = JSON.parse(stringifiedAttempts);
  if (normalAttempts == maxAttempts) {
    normalAttempts = attempts = 0;
  }
  if (normalAttempts !== null) {
    attempts = normalAttempts;
    document.getElementById("attempts").textContent = attempts;
  }
  if (normalObject !== null) {
    let currentClicks = 0;
    for (let i = 0; i < normalObject.length; i++) {
      currentClicks += normalObject[i].clicks;
    }

    if (currentClicks == maxAttempts) {
      localStorage.removeItem("products");
    } else {
      products = normalObject;
    }
  }
}
let imgsPath = [
  "wine-glass.jpg",
  "water-can.jpg",
  "unicorn.jpg",
  "tauntaun.jpg",
  "shark.jpg",
  "sweep.png",
  "scissors.jpg",
  "pet-sweep.jpg",
  "pen.jpg",
  "dragon.jpg",
  "chair.jpg",
  "cthulhu.jpg",
  "dog-duck.jpg",
  "bubblegum.jpg",
  "breakfast.jpg",
  "boots.jpg",
  "banana.jpg",
  "bag.jpg",
  "bathroom.jpg",
];

for (let i = 0; i < imgsPath.length; i++) {
  new product(imgsPath[i]);
}

getCurrentData("products", "attempts");
getPrevData("prevProducts");
render();
if (prevProducts.length != 0) {
  prevResultButton();
} else {
  console.log(prevProducts.length);

  document.getElementById("prevResultBtn").setAttribute("disabled", "disabled");
}
