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
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function ask(q) {
    return new Promise(function (resolve) { return rl.question(q, resolve); });
}
var BabyNameSuggestion = /** @class */ (function () {
    function BabyNameSuggestion() {
        this.boyNames = ["Aarav", "Vivaan", "Arjun", "Aditya", "Krishna"];
        this.girlNames = ["Ananya", "Aadhya", "Diya", "Kavya", "Ishita"];
    }
    BabyNameSuggestion.prototype.showNames = function (gender) {
        switch (gender) {
            case "boy":
                for (var i = 0; i < this.boyNames.length; i++) {
                    console.log("".concat(i + 1, ". ").concat(this.boyNames[i]));
                }
                break;
            case "girl":
                for (var i = 0; i < this.girlNames.length; i++) {
                    console.log("".concat(i + 1, ". ").concat(this.girlNames[i]));
                }
                break;
            default:
                console.log("Invalid gender");
        }
    };
    BabyNameSuggestion.prototype.selectName = function (gender, choice) {
        switch (gender) {
            case "boy":
                console.log("Selected Name:", this.boyNames[choice - 1]);
                break;
            case "girl":
                console.log("Selected Name:", this.girlNames[choice - 1]);
                break;
        }
    };
    return BabyNameSuggestion;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var gender, suggester, choice, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ask("Enter baby gender (boy/girl): ")];
                case 1:
                    gender = (_b.sent()).toLowerCase();
                    suggester = new BabyNameSuggestion();
                    suggester.showNames(gender);
                    _a = Number;
                    return [4 /*yield*/, ask("Select name number: ")];
                case 2:
                    choice = _a.apply(void 0, [_b.sent()]);
                    suggester.selectName(gender, choice);
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
main();
