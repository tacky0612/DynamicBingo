'use strict';

function intRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function splitArray(array, part) {
    let tmp = [];
    for (let i = 0; i < array.length; i += part) {
        tmp.push(array.slice(i, i + part));
    }
    return tmp;
}

function createBingoArray(number) {
    let source = [];
    const buttonNumber = number * number;
    for (let i = 1; i <= buttonNumber; i++) {
        if (i === Math.floor(buttonNumber / 2) + 1) {
            source.push("FREE");
            continue
        }
        while (true) {
            let tmp = intRandom(1, MAX_BINGO_COUNT);
            if (!source.includes(tmp)) {
                source.push(tmp);
                break;
            }
        }
    }
    source = splitArray(source, number);
    return source;
}

function renderBingo(number, source) {
    $("#bingo-head").attr("colSpan", number);
    for (let row = 0; row < number; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < number; col++) {
            const td = document.createElement("td");
            td.classList.add(`${row}-${col}`);
            td.textContent = source[row][col];
            if (td.innerText === "FREE") {
                td.style.backgroundColor = "rgb(255, 150, 150)";
            }
            tr.appendChild(td);
        }

        document.querySelector("tbody").appendChild(tr);
    }
}

function checkBingo() {
    let colCount = new Array(number).fill(0);
    let rowCount = 0;
    let slashCount = 0
    let backslashCount = 0
    for (let row = 0; row < number; row++) {
        rowCount = 0;
        for (let col = 0; col < number; col++) {
            let color = $("." + `${row}-${col}`).css("background-color");
            if (color === "rgb(255, 192, 203)" || color === "rgb(255, 150, 150)") {
                rowCount++;
                colCount[col]++;
                if (row === col) {
                    slashCount++;
                }

                if (row === number - 1 - col) {
                    backslashCount++;;
                }
            }
        }
    }
    if (rowCount === number || colCount.includes(number) || slashCount === number || backslashCount === number) {
        alert("BINGO!!");
    }
    console.log(colCount);
}

$("#bingo-range").on("input", () => {
    let input = $("#bingo-range").val();
    $("#output").text(input);
});

const number = 5;
const MAX_BINGO_COUNT = number * number * 2;

let source = createBingoArray(number);
renderBingo(number, source);
console.table(source);

$("td").on("click", (event) => {
    let target = event.target.classList[0];
    let color = $("." + target).css("background-color");
    if (color === "rgb(127, 255, 212)") {
        $("." + target).css("background-color", "pink");
    } else if (color === "rgb(255, 192, 203)") {
        $("." + target).css("background-color", "aquamarine");
    }

    checkBingo();
});