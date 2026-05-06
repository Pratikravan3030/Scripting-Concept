import * as readline from "readline-sync";



enum SportType {
    CRICKET = "Cricket",
    FOOTBALL = "Football"
}

interface Player {
    id: number;
    name: string;
    age: number;
    skillLevel: number;
}


class Team {
    name: string;
    sport: SportType;
    players: Player[] = [];
    points: number = 0;

    constructor(name: string, sport: SportType) {
        this.name = name;
        this.sport = sport;
    }

    addPlayer(player: Player): void {
        if (player.skillLevel < 40) {
            console.log(`❌ ${player.name} rejected (skill too low)`);
        } else {
            this.players.push(player);
            console.log(`✅ ${player.name} added to ${this.name}`);
        }
    }

    getTeamStrength(): number {
        let total = 0;
        for (let p of this.players) {
            total += p.skillLevel;
        }
        return total;
    }
}

class Match {
    constructor(private teamA: Team, private teamB: Team) {}

    play(): void {
        const a = this.teamA.getTeamStrength();
        const b = this.teamB.getTeamStrength();

        console.log(`\n🏟 ${this.teamA.name} vs ${this.teamB.name}`);

        if (a > b) {
            this.teamA.points += 2;
            console.log(`🏆 Winner: ${this.teamA.name}`);
        } else if (b > a) {
            this.teamB.points += 2;
            console.log(`🏆 Winner: ${this.teamB.name}`);
        } else {
            this.teamA.points++;
            this.teamB.points++;
            console.log(`🤝 Draw`);
        }
    }
}

class Tournament {
    constructor(public name: string, public teams: Team[]) {}

    start(): void {
        console.log(`\n🎯 Tournament Started: ${this.name}`);

        for (let i = 0; i < this.teams.length; i++) {
            for (let j = i + 1; j < this.teams.length; j++) {
                new Match(this.teams[i], this.teams[j]).play();
            }
        }
    }

    leaderboard(): void {
        console.log(`\n📊 Leaderboard`);
        this.teams.sort((a, b) => b.points - a.points);

        let rank = 1;
        for (let t of this.teams) {
            console.log(`${rank}. ${t.name} - ${t.points} pts`);
            rank++;
        }
    }
}



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (q: string): Promise<string> =>
    new Promise(resolve => rl.question(q, resolve));


async function main() {
    const tournamentName = await ask("Enter tournament name: ");
    const teamCount = Number(await ask("How many teams? "));

    const teams: Team[] = [];

    for (let i = 0; i < teamCount; i++) {
        const teamName = await ask(`\nTeam ${i + 1} name: `);
        const team = new Team(teamName, SportType.CRICKET);

        const playerCount = Number(await ask(`Number of players in ${teamName}: `));

        for (let j = 0; j < playerCount; j++) {
            const name = await ask(`Player ${j + 1} name: `);
            const age = Number(await ask(`Age: `));
            const skill = Number(await ask(`Skill (1–100): `));

            team.addPlayer({
                id: j + 1,
                name,
                age,
                skillLevel: skill
            });
        }

        teams.push(team);
    }

    const tournament = new Tournament(tournamentName, teams);
    tournament.start();
    tournament.leaderboard();

    rl.close();
}

main();