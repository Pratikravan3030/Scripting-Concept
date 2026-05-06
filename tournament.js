"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var SportType;
(function (SportType) {
    SportType["CRICKET"] = "Cricket";
    SportType["FOOTBALL"] = "Football";
})(SportType || (SportType = {}));
var Team = /** @class */ (function () {
    function Team(name, sport) {
        this.players = [];
        this.points = 0;
        this.name = name;
        this.sport = sport;
    }
    Team.prototype.addPlayer = function (player) {
        if (player.skillLevel < 40) {
            console.log("\u274C ".concat(player.name, " rejected (skill too low)"));
        }
        else {
            this.players.push(player);
            console.log("\u2705 ".concat(player.name, " added to ").concat(this.name));
        }
    };
    Team.prototype.getTeamStrength = function () {
        var total = 0;
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var p = _a[_i];
            total += p.skillLevel;
        }
        return total;
    };
    return Team;
}());
var Match = /** @class */ (function () {
    function Match(teamA, teamB) {
        this.teamA = teamA;
        this.teamB = teamB;
    }
    Match.prototype.play = function () {
        var a = this.teamA.getTeamStrength();
        var b = this.teamB.getTeamStrength();
        console.log("\n\uD83C\uDFDF ".concat(this.teamA.name, " vs ").concat(this.teamB.name));
        if (a > b) {
            this.teamA.points += 2;
            console.log("\uD83C\uDFC6 Winner: ".concat(this.teamA.name));
        }
        else if (b > a) {
            this.teamB.points += 2;
            console.log("\uD83C\uDFC6 Winner: ".concat(this.teamB.name));
        }
        else {
            this.teamA.points++;
            this.teamB.points++;
            console.log("\uD83E\uDD1D Draw");
        }
    };
    return Match;
}());
var Tournament = /** @class */ (function () {
    function Tournament(name, teams) {
        this.name = name;
        this.teams = teams;
    }
    Tournament.prototype.start = function () {
        console.log("\n\uD83C\uDFAF Tournament Started: ".concat(this.name));
        for (var i = 0; i < this.teams.length; i++) {
            for (var j = i + 1; j < this.teams.length; j++) {
                new Match(this.teams[i], this.teams[j]).play();
            }
        }
    };
    Tournament.prototype.leaderboard = function () {
        console.log("\n\uD83D\uDCCA Leaderboard");
        this.teams.sort(function (a, b) { return b.points - a.points; });
        var rank = 1;
        for (var _i = 0, _a = this.teams; _i < _a.length; _i++) {
            var t = _a[_i];
            console.log("".concat(rank, ". ").concat(t.name, " - ").concat(t.points, " pts"));
            rank++;
        }
    };
    return Tournament;
}());
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var ask = function (q) {
    return new Promise(function (resolve) { return rl.question(q, resolve); });
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tournamentName, teamCount, _a, teams, i, teamName, team, playerCount, _b, j, name_1, age, _c, skill, _d, tournament;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ask("Enter tournament name: ")];
                case 1:
                    tournamentName = _e.sent();
                    _a = Number;
                    return [4 /*yield*/, ask("How many teams? ")];
                case 2:
                    teamCount = _a.apply(void 0, [_e.sent()]);
                    teams = [];
                    i = 0;
                    _e.label = 3;
                case 3:
                    if (!(i < teamCount)) return [3 /*break*/, 13];
                    return [4 /*yield*/, ask("\nTeam ".concat(i + 1, " name: "))];
                case 4:
                    teamName = _e.sent();
                    team = new Team(teamName, SportType.CRICKET);
                    _b = Number;
                    return [4 /*yield*/, ask("Number of players in ".concat(teamName, ": "))];
                case 5:
                    playerCount = _b.apply(void 0, [_e.sent()]);
                    j = 0;
                    _e.label = 6;
                case 6:
                    if (!(j < playerCount)) return [3 /*break*/, 11];
                    return [4 /*yield*/, ask("Player ".concat(j + 1, " name: "))];
                case 7:
                    name_1 = _e.sent();
                    _c = Number;
                    return [4 /*yield*/, ask("Age: ")];
                case 8:
                    age = _c.apply(void 0, [_e.sent()]);
                    _d = Number;
                    return [4 /*yield*/, ask("Skill (1\u2013100): ")];
                case 9:
                    skill = _d.apply(void 0, [_e.sent()]);
                    team.addPlayer({
                        id: j + 1,
                        name: name_1,
                        age: age,
                        skillLevel: skill
                    });
                    _e.label = 10;
                case 10:
                    j++;
                    return [3 /*break*/, 6];
                case 11:
                    teams.push(team);
                    _e.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 3];
                case 13:
                    tournament = new Tournament(tournamentName, teams);
                    tournament.start();
                    tournament.leaderboard();
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
main();
