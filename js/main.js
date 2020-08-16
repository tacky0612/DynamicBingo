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

function createBingoArray(number, max) {
    let source = [];
    const buttonNumber = number * number;
    for (let i = 1; i <= buttonNumber; i++) {
        if (i === Math.floor(buttonNumber / 2) + 1) {
            source.push("FREE");
            continue
        }
        while (true) {
            let tmp = intRandom(1, max);
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

    $("#bingo-settings").hide();
    $("table").show();
}

function checkBingo() {
    let rowCount = new Array(number).fill(0);
    let colCount = new Array(number).fill(0);
    let slashCount = 0;
    let backslashCount = 0
    for (let row = 0; row < number; row++) {
        for (let col = 0; col < number; col++) {
            let color = $("." + `${row}-${col}`).css("background-color");
            if (color === "rgb(255, 192, 203)" || color === "rgb(255, 150, 150)") {
                rowCount[row]++;
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

    if (rowCount.includes(number) || colCount.includes(number) || slashCount === number || backslashCount === number) {
        if (isNotBingoYet) {
            $("#popup").show();
            isNotBingoYet = false;
        }
    }
}

$("#bingo-range").on("input", () => {
    let input = $("#bingo-range").val();
    $(".output").text(input);
    $("#number-range").attr("min", input * input - 1);
    $("#number-range").attr("max", (input * input - 1) * 4);
    $("#number-range").attr("value", input * input - 1);

    $("#number-range-output").text(input * input - 1);
    input = $("#number-range").val();
    $("#number-range-output").text(input);
});

$("#number-range").on("input", () => {
    let input = $("#number-range").val();
    $("#number-range-output").text(input);
});

$("#bingo-create").on("click", () => {
    let number = parseInt($("#output").text());
    const max = parseInt($("#number-range-output").text());
    let source = createBingoArray(number, max);
    window.number = number;
    isNotBingoYet = true;

    renderBingo(number, source);

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
});

$("#bingo-settings--accordion-menu dt").on("click", (event) => {
    let target = event.target.parentElement.parentElement.children[1];
    $(target).slideToggle(100);
});

$("#popup").on("click", () => {
    $("#popup").fadeOut(500);
});

let isNotBingoYet = true;