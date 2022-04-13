import type { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

import axios from "axios";
axios.defaults.baseURL = 'https://api.coingecko.com/api/v3';

interface Coin {
  id: string;
  symbol: string;
  name: string;
}

enum Currencies {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
}

enum Coins {
  Bitcoin = "Bitcoin",
  Ethereum = "Ethereum",
  Polygon = "Polygon",
  Monero = "Monero",
  Litecoin = "Litecoin",
}

const currenciesSign = {
  [Currencies.USD]: '$',
  [Currencies.EUR]: '€',
  [Currencies.GBP]: '£',
  [Currencies.JPY]: '¥',
}

@Discord()
export class Commands {
  @Slash("price")
  async choose(
    @SlashChoice(Coins.Bitcoin, Coins.Ethereum, Coins.Polygon, Coins.Monero, Coins.Litecoin)
    @SlashOption("coin", { description: "What coin price you want to see ?" })
    coin: string,

    @SlashChoice(Currencies.USD, Currencies.EUR, Currencies.GBP, Currencies.JPY)
    @SlashOption("currency", { description: "In what currency you want to get the result ?" })
    currency: string,

    interaction: CommandInteraction
  ): Promise<void> {
    const { data: list } = await axios.get('/coins/list')

    const foundedCoin = list.find((c: Coin) => {
      return c.name.toLowerCase() === coin.toLowerCase()
    })

    if (!coin) interaction.reply('Currency not found');

    const { data } = await axios.get(`/simple/price?ids=${foundedCoin.id}&vs_currencies=${currency.toLowerCase()}`)

    const price = data[foundedCoin.id][currency.toLowerCase()]
    const sign = currenciesSign[currency as Currencies]

    interaction.reply('The current price of `' + coin + '` is ' + `${price} ${sign}`);
  }
}
