import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(q: string): Promise<string> {
    return new Promise(resolve => rl.question(q, resolve));
}

class BabyNameSuggestion {
    boyNames: string[] = ["Aarav", "Vivaan", "Dev", "Aditya", "Krishna"];
    girlNames: string[] = ["Anaya", "Aadhya", "Vaani", "Kavya", "Divya"];

    showNames(gender: string): void {
        switch (gender) {
            case "boy":
                for (let i = 0; i < this.boyNames.length; i++) {
                    console.log(`${i + 1}. ${this.boyNames[i]}`);
                }
                break;

            case "girl":
                for (let i = 0; i < this.girlNames.length; i++) {
                    console.log(`${i + 1}. ${this.girlNames[i]}`);
                }
                break;

            default:
                console.log("Invalid gender");
        }
    }

    selectName(gender: string, choice: number): void {
        switch (gender) {
            case "boy":
                console.log("Selected Name:", this.boyNames[choice - 1]);
                break;

            case "girl":
                console.log("Selected Name:", this.girlNames[choice - 1]);
                break;
        }
    }
}

async function main() {
    const gender = (await ask("Enter baby gender (boy/girl): ")).toLowerCase();
    const suggester = new BabyNameSuggestion();

    suggester.showNames(gender);

    const choice = Number(await ask("Select name number: "));
    suggester.selectName(gender, choice);

    rl.close();
}

main();