var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import axios from "axios";
axios.defaults.baseURL = 'https://api.coingecko.com/api/v3';
var Currencies;
(function (Currencies) {
    Currencies["USD"] = "USD";
    Currencies["EUR"] = "EUR";
    Currencies["GBP"] = "GBP";
    Currencies["JPY"] = "JPY";
})(Currencies || (Currencies = {}));
var Coins;
(function (Coins) {
    Coins["Bitcoin"] = "Bitcoin";
    Coins["Ethereum"] = "Ethereum";
    Coins["Polygon"] = "Polygon";
    Coins["Monero"] = "Monero";
    Coins["Litecoin"] = "Litecoin";
})(Coins || (Coins = {}));
const currenciesSign = {
    [Currencies.USD]: '$',
    [Currencies.EUR]: '€',
    [Currencies.GBP]: '£',
    [Currencies.JPY]: '¥',
};
let Commands = class Commands {
    async choose(coin, currency, interaction) {
        const { data: list } = await axios.get('/coins/list');
        const foundedCoin = list.find((c) => {
            return c.name.toLowerCase() === coin.toLowerCase();
        });
        if (!coin)
            interaction.reply('Currency not found');
        const { data } = await axios.get(`/simple/price?ids=${foundedCoin.id}&vs_currencies=${currency.toLowerCase()}`);
        const price = data[foundedCoin.id][currency.toLowerCase()];
        const sign = currenciesSign[currency];
        interaction.reply('The current price of `' + coin + '` is ' + `${price} ${sign}`);
    }
};
__decorate([
    Slash("price"),
    __param(0, SlashChoice(Coins.Bitcoin, Coins.Ethereum, Coins.Polygon, Coins.Monero, Coins.Litecoin)),
    __param(0, SlashOption("coin", { description: "What coin price you want to see ?" })),
    __param(1, SlashChoice(Currencies.USD, Currencies.EUR, Currencies.GBP, Currencies.JPY)),
    __param(1, SlashOption("currency", { description: "In what currency you want to get the result ?" })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function]),
    __metadata("design:returntype", Promise)
], Commands.prototype, "choose", null);
Commands = __decorate([
    Discord()
], Commands);
export { Commands };
