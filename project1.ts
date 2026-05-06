import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(q: string): Promise<string> {
    return new Promise(resolve => rl.question(q, resolve));
}

function average(arr: number[]): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

function highest(arr: number[]): number {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

async function main() {
    const count = Number(await ask("Enter number of matches: "));
    let scores: number[] = [];

    for (let i = 0; i < count; i++) {
        const score = Number(await ask(`Enter score ${i + 1}: `));
        scores.push(score);
    }

    const avg = average(scores);
    const high = highest(scores);

    console.log("Scores:", scores);
    console.log("Average:", avg);
    console.log("Highest:", high);

    if (avg >= 60) {
        console.log("Performance: Good");
    } else {
        console.log("Performance: Poor");
    }

    rl.close();
}

main();