const axios = axios('axios')
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = '/*your Discord token*/'; 
const prefix = ("!");
const talkedRecently = new Set();
const logUpdate = require('log-update');
var fx = require("money");
const cheerio = require('cheerio');
const d = new Date();
const cmc_api = require("cmc-info");
const mySecret ='Your CoinMarketCap secret'

const cmc = new cmc_api(mySecret);


client.on('ready', () => {
  console.log( `Logged in as ${client.user.tag}!` );
  
});


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function numberFormat(x, precision) {
  x = Math.round(x * Math.pow(10, precision)) / Math.pow(10, precision);
  let arr = x.toString().split(".");
  let formatted = arr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if(arr.length == 2) {
      formatted += "." + arr[1];
  }
  return formatted;
}


client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.trim().split(/ +/g);
    const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix



    //-Suggestion Bot------------//
    if(cmd === 'request'){
      console.log(`Request was received...`)
      var req = message.content
      var newMessage = req.replace("!request", "-")
      console.log(newMessage)
      var author = "<@" + message.author + ">"
      var sug  = new Discord.MessageEmbed()
                .setColor('#BF40BF')
                .setAuthor(message.author.username, message.author.avatarURL())
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
                
                .addFields({
                        name: `New Suggestion`,
                        value: `${newMessage}`,
                        inline: false
                      },{
                        name: `\u200B`,
                        value: "Please react if you agree✅, disagree❌, or don't understand❓",
                        inline: false
                      }
            )
            .setFooter('Topher'  ,' ');
            client.channels.cache.get(' YOUR SPECIFIC CHANNEL ID YOU WANT ').send({embed: sug}).then(message => {
              message.react('✅')
              message.react('❌')
              message.react('❓')
            })
      }
    
    
    //-RETRIEVES THE COIN LISTING------------------------------------//
    if(cmd === 'coin'){
      cmc.requestCoinBySymbol(args[1])
                        .then(data => {
                            let nameR = data['name'].replace(/ /g, '-');
                            let siteURL = `https://coinmarketcap.com/currencies/${nameR}/`;
                        
                            let id = data['id'];
                            let name = data['name'];
                            let rank = data['cmc_rank'];
                            let supply = numberFormat(data['circulating_supply'], 2);
                            let price = numberFormat(data['quote']['USD']['price'], 4);
                            let volume_24h = numberFormat(data['quote']['USD']['volume_24h'], 2);
                            let percent_change_1h = numberFormat(data['quote']['USD']['percent_change_1h'], 2);
                            let percent_change_24h = numberFormat(data['quote']['USD']['percent_change_24h'], 2);
                            let percent_change_7d = numberFormat(data['quote']['USD']['percent_change_7d'], 2);
                            let market_cap = numberFormat(data['quote']['USD']['market_cap'], 2);
                            let last_updated = data['last_updated'];
                            let chunk = `\n**Rank**: ${rank} \n\n**Volume 24H**: $${volume_24h} \n**Change 1H**: ${percent_change_1h}% \n**Change 24H**: ${percent_change_24h}% \n**Change 7D**: ${percent_change_7d}% \n\n**Price**: $${price} \n**Circulating supply**: ${supply} \n**Market cap**: $${market_cap}`;
                            

                            var embed = new Discord.MessageEmbed()
                            .setColor('#BF40BF')
                            .setAuthor('Tophers')
                            .setTitle("CoinMarketCap Stats")
                            .setURL(siteURL)
                            .setThumbnail(`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`)
                            .addFields({
                                    name: name,
                                    value: chunk,
                                    inline: false
                                  }
                        )
                        .setTimestamp()
                        .setFooter('Topher | ' ,' ');
                        message.channel.send({embed: embed});
                        console.log(siteURL)
                        })
                        .catch(error => {
                            message.channel.send(`Error: coin not found.`);
                            console.error(error);
                        });
    }

    //-Finds and retrievs the stock from yahoo------------------------------------//
    if(cmd === 'stock'){
      console.log('Stock message in use')
      async function stock(){
        var url = `https://finance.yahoo.com/quote/${args[1]}?p=${args[1]}&.tsrc=fin-srch`;
        var yahooFinance = require('yahoo-finance');

        yahooFinance.quote({
            symbol: args[1],
            modules: [ 'price', 'summaryDetail', 'summaryProfile'] // see the docs for the full         list
          }, function (err, quotes) {
                let stockName = quotes.price['longName'];
                let price = quotes.price['regularMarketPrice'];       
                let preMarket = quotes.price['preMarketPrice'];
                let postMarket = quotes.price['postMarketPrice'];
                let marketCap = quotes.summaryDetail['marketCap'];
                let volume =  quotes.summaryDetail['averageVolume'];
                let open = quotes.summaryDetail['open']
                let bid = quotes.summaryDetail['bid']
                let ask = quotes.summaryDetail['ask']
                let marketState = quotes.price['marketState']
                let website = quotes.summaryProfile['website']


          

          var cryp  = new Discord.MessageEmbed()
                .setColor('#BF40BF')
                .setTitle(stockName)
                .setURL(url)
                .setAuthor('Tophers')
                .addFields({
                        name: `Stock Price`,
                        value: `-$${price}`,
                        inline: true
                      },{
                        name: `Average Volume`,
                        value: `-${volume}`,
                        inline: true
                      },{
                        name: `Market Cap`,
                        value: `-$${marketCap}`,
                        inline: true
                      },{
                        name: `Bid`,
                        value: `-$${bid}`,
                        inline: true
                      },{
                        name: `Ask`,
                        value: `-$${ask}`,
                        inline: true
                      },{
                        name: `Market State`,
                        value: `-${marketState}`,
                        inline: true
                      },{
                        name: `Premarket`,
                        value: `-${preMarket}`,
                        inline: true
                      },{
                        name: `Postmarket`,
                        value: `-${postMarket}`,
                        inline: true
                      },{
                        name: `Stock Website`,
                        value: `-${website}`,
                        inline: true
                      },{
                        name: `Note:`,
                        value: `If any fields appear empty or misplaced, please contact one of the staff members.`,
                        inline: false
                      }
            )
            .setTimestamp()
            .setFooter('Topher' ,' ');
            message.channel.send({embed: cryp});
        })};

        
        
        
          
        
      
      stock();
    }

    //-Webscrapes CMC for the top 3 trending crypto------------------------------------//
    
    if(cmd === 'crypto'){
      console.log('crypto message in use...')
      async function getPriceFeed() {
        try {
            const siteURL = 'https://coinmarketcap.com/trending-cryptocurrencies/'
    
            const {data} = await axios({
                method: 'GET',
                url: siteURL,
            })
    
            const $ = cheerio.load(data)
            const elmselector = '#__next > div.bywovg-1.sXmSU > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'
                
            const keys = [
              'rank',
              'name',
              'price',
              'hour',
              'day',
              'days',
              'marketcap',
              'volume'
            ]

            const image = [
              'last7Days',
              'logo'
            ]
            const coinArr = []
            const imgArr = []
    
    
            $(elmselector).each((parentIdx, parentElm) => {
                let keyIdx = 0
                const coinObj = {}
                const imgObj = {}
    
                if(parentIdx <= 9){
                    $(parentElm).children().each((childIdx, childElm) => {
                        let tdvalue = ($(childElm).text())
                        let imgvalue = ($(childElm).attr('src'))

                        if(keyIdx === 1 || keyIdx ===6){
                            tdvalue = $('p:first-child', $(childElm).html()).text()
                            imgvalue = $('img', $(childElm).html()).attr('src')

                            
                        }
    
                        if (tdvalue) {
                            coinObj[keys[keyIdx]] = tdvalue
                            imgObj[image[keyIdx]] = imgvalue

                            keyIdx++
                            
                        }
                    })  
                    coinArr.push(coinObj)
                    imgArr.push(imgObj)
                }
    
              
            })

            var name = coinArr.map(function(i){
              return i.name
            })
            var rank = coinArr.map(function(i){
              return i.rank
            })
            var price = coinArr.map(function(i){
              return i.price
            })
            var hour = coinArr.map(function(i){
              return i.hour
            })
            var day = coinArr.map(function(i){
              return i.day
            })
            var days = coinArr.map(function(i){
              return i.days
            })
            var market = coinArr.map(function(i){
              return i.marketCap
            })
            var volume = coinArr.map(function(i){
              return i.volume
            })
            var logo = imgArr.map(function(i){
              return i.logo
            })


            for(i = 0; i <= 2; i++){
              let NameObj = JSON.stringify(name[i])
              let callName = JSON.parse(NameObj)

              let RankObj = JSON.stringify(rank[i])
              let callRank = JSON.parse(RankObj)

              let priceObj = JSON.stringify(price[i])
              let callPrice = JSON.parse(priceObj)

              let hourObj = JSON.stringify(hour[i])
              let callHour = JSON.parse(hourObj)

              let dayObj = JSON.stringify(day[i])
              let callDay = JSON.parse(dayObj)

              let daysObj = JSON.stringify(days[i])
              let callDays = JSON.parse(daysObj)

              //let marketObj = JSON.stringify(market[i])
              //let callMarket = JSON.parse(marketObj)

              let volumeObj = JSON.stringify(volume[i])
              //let callVolume = JSON.parse(volumeObj)

              let logoOb = JSON.stringify(logo[i])
              let callLogo = JSON.parse(logoOb)





              var cryp  = new Discord.MessageEmbed()
                .setColor('#BF40BF')
                .setTitle('Top 3 Trending Crypto ')
                .setURL('https://coinmarketcap.com/trending-cryptocurrencies/')
                .setAuthor('Topher')
                .addFields({
                        name: 'Crypto',
                        value: `**__${callName}__**`,
                        inline: false
                      },{
                        name: 'Rank',
                        value: `${callRank}`,
                        inline: true
                      },{
                        name: 'Price',
                        value: `${callPrice}`,
                        inline: true
                      },{
                        name: '24 Hour Change',
                        value: `${callHour}`,
                        inline: false
                      },{
                        name: '7 Day Change',
                        value: `${callDay}`,
                        inline: true
                      },{
                        name: '30 Day Change',
                        value: `${callDays}`,
                        inline: true
                      }
                    
                )
                .setFooter('Topher')
                .setThumbnail(callLogo)
                message.channel.send({embed: cryp});
        }

            

        } catch (err) {
            console.error(err)
        }
    
    }
    getPriceFeed();
    }



    //-Currency list display------------------------------------//

    if (message.content.includes('currency list')){
      const cur = "842950614015279104"
      var embed  = new Discord.MessageEmbed()
          .setColor('#BF40BF')
          .setTitle('Countries')
          .addFields({
            name: 'Countries avalible for currency conversions',
            value: `
            USD -US Dollar\n\nEUR -Euro\n\n\GBP -British Pound\n\nCAD -Canadian Dollar\n\nAUD -Australian Dollar\n\nJPY -Japanese Yen`,
            inline: false
            
            
          },{
            name: '\u200B',
            value: 'AED -Emirati Dirham\n\nAFN -Afghan Afghani\n\nALL -Albanian Lek\n\nAMD -Armenian Dram\n\nANG -Dutch Guilder\n\nAOA -Angolan Kwanza\n\nARS -Argentine Peso\n\nAUD -Australian Dollar\n\nAWG -Aruban or Dutch Guilder\n\nAZN -Azerbaijan Manat\n\nBAM -Bosnian Convertible Mark\n\nBBD -Barbadian or Bajan Dollar\n\nBDT -Bangladeshi Taka\n\nBGN -Bulgarian Lev\n\nBHD -Bahraini Dinar\n\nBIF -Burundian Franc\n\nBMD -Bermudian Dollar\n\nBND -Bruneian Dollar\n\nBOB -Bolivian Bolíviano\n\nBRL -Brazilian Real\n\nBSD -Bahamian Dollar\n\nBTN -Bhutanese Ngultrum\n\nBWP -Botswana Pula\n\nBYN -Belarusian Ruble\n\nBYR -Belarusian Ruble\n\nBZD -Belizean Dollar\n\nCAD -Canadian Dollar\n\nCDF -Congolese Franc\n\nCHF -Swiss Franc\n\nCLP -Chilean Peso\n\nCNY -Chinese Yuan Renminbi\n\nCOP -Colombian Peso\n\nCRC -Costa Rican Colon\n\nCUC -Cuban Convertible Peso\n\nCUP -Cuban Peso\n\nCVE -Cape Verdean Escudo\n\nCZK -Czech Koruna'
            ,inline: true
          },{
            name: '\u200B',
            value: `nDJF -Djiboutian Franc\n\nDKK -Danish Krone\n\nDOP -Dominican Peso\n\nDZD -Algerian Dinar\n\nEEK -Estonian Kroon\n\nEGP -Egyptian Pound\n\nERN -Eritrean Nakfa\n\nETB -Ethiopian Birr\n\nEUR -Euro\n\nFJD -Fijian Dollar\n\nFKP -Falkland Island Pound\n\nGBP -British Pound\n\nGEL -Georgian Lari\n\nGGP -Guernsey Pound\n\nGHS -Ghanaian Cedi\n\nGIP -Gibraltar Pound\n\nGMD -Gambian Dalasi\n\nGNF -Guinean Franc\n\nGTQ -Guatemalan Quetzal\n\nGYD -Guyanese Dollar\n\nHKD -Hong Kong Dollar\n\nHNL -Honduran Lempira\n\nHRK -Croatian Kuna\n\nHTG -Haitian Gourde\n\nHUF -Hungarian Forint\n\nIDR -Indonesian Rupiah\n\nILS -Israeli Shekel\n\nIMP -Isle of Man Pound\n\nINR -Indian Rupee\n\nIQD -Iraqi Dinar\n\nIRR -Iranian Rial\n\nISK -Icelandic Krona\n\nJEP -Jersey Pound\n\nJMD -Jamaican Dollar\n\nJOD -Jordanian Dinar\n\nJPY -Japanese Yen\n\nKES -Kenyan Shilling\n\nKGS -Kyrgyzstani Som\n\nKHR -Cambodian Riel\n\nKMF -Comorian Franc`
            ,inline: true
          },{
            name: '\u200B',
            value: '\n\nKPW -North Korean Won\n\nKRW -South Korean Won\n\nKWD -Kuwaiti Dinar\n\nKYD -Caymanian Dollar\n\nKZT -Kazakhstani Tenge\n\nLAK -Lao Kip\n\nLBP -Lebanese Pound\n\nLKR -Sri Lankan Rupee\n\nLRD -Liberian Dollar\n\nLSL -Basotho Loti\n\nLTL -Lithuanian Litas\n\nLVL -Latvian Lat\n\nLYD -Libyan Dinar\n\nMAD -Moroccan Dirham\n\n MDL -Moldovan Leu\n\nMGA -Malagasy Ariary\n\nMKD -Macedonian Denar\n\nMMK -Burmese Kyat\n\nMNT -Mongolian Tughrik\n\nMOP -Macau Pataca\n\nMRU -Mauritanian Ouguiya\n\nMUR -Mauritian Rupee\n\nMVR -Maldivian Rufiyaa\n\nMWK -Malawian Kwacha\n\nMXN -Mexican Peso\n\nMYR -Malaysian Ringgit\n\nMZN -Mozambican Metical\n\nNAD -Namibian Dollar\n\nNGN -Nigerian Naira\n\nNIO -Nicaraguan Cordoba\n\nNOK -Norwegian Krone\n\nNPR -Nepalese Rupee\n\nNZD -New Zealand Dollar\n\nOMR -Omani Rial\n\nPAB -Panamanian Balboa\n\nPEN -Peruvian Sol\n\n PGK -Papua New Guinean Kina\n\nPHP -Philippine Peso'
            ,inline: true
          },{
            name: '\u200B',
            value: '\n\nPKR -Pakistani Rupee\n\nPLN -Polish Zloty\n\n\PYG -Paraguayan Guarani\n\nQAR -Qatari Riyal\n\nRON -Romanian Leu\n\nRSD -Serbian Dinar\n\nRUB -Russian Ruble\n\nRWF -Rwandan Franc\n\nSAR -Saudi Arabian Riyal\n\nSBD -Solomon Islander Dollar\n\nSCR -Seychellois Rupee\n\nSDG -Sudanese Pound\n\nSEK -Swedish Krona\n\nSGD -Singapore Dollar\n\nSHP -Saint Helenian Pound\n\nSLL -Sierra Leonean Leone\n\nSOS -Somali Shilling\n\nSPL -Seborgan Luigino\n\nSRD -Surinamese Dollar\n\nSTN -Sao Tomean Dobra\n\nSVC -Salvadoran Colon\n\nSYP -Syrian Pound\n\nSZL -Swazi Lilangeni\n\nTHB -Thai Baht\n\nTJS -Tajikistani Somoni\n\nTMT -Turkmenistani Manat\n\nTND -Tunisian Dinar\n\nTOP -Tongan Paanga\n\nTRY -Turkish Lira\n\nTTD -Trinidadian Dollar\n\nTVD -Tuvaluan Dollar\n\nTWD -Taiwan New Dollar\n\nTZS -Tanzanian Shilling\n\nUAH -Ukrainian Hryvnia\n\nUGX -Ugandan Shilling\n\nUSD -US Dollar\n\nUYU -Uruguayan Peso'
            ,inline: true
          },{
            name: '\u200B',
            value: 'UZS -Uzbekistani Som\n\nVEF -Venezuelan Bolívar\n\nVES -Venezuelan Bolívar\n\nVND -Vietnamese Dong\n\nVUV -Ni-Vanuatu Vatu\n\n WST -Samoan Tala\n\nXAF -Central African CFA Franc BEAC\n\nXAG -Silver Ounce\n\nXAU -Gold Ounce\n\nXBT -Bitcoin\n\nXCD -East Caribbean Dollar\n\nXDR -IMF Special Drawing Rights\n\nXOF -CFA Franc\n\nXPD -Palladium Ounce\n\nXPF -CFP Franc\n\nXPT -Platinum Ounce\n\nYER -Yemeni Rial\n\nZAR -South African Rand\n\nZMK -Zambian Kwacha\n\nZMW -Zambian Kwacha\n\nZWD -Zimbabwean Dollar'
            ,inline: true
          }
    )
          .setThumbnail(' ')
          .setFooter('Topher');
           
    message.channel.send({embed}).catch(console.error);
    console.log("User used currency help command")  
    };

    //-Currency coversion------------------------------------//
    
    if (cmd === 'convert'){
      message.reply('Calculating the conversion amount, this may take 15-25 seconds.').then(msg => msg.delete({timeout: 10500}));

      function scrapeProduct() {
        let amount = args[1];
        let from = args[2].toUpperCase();
        let to = args[3].toUpperCase();
        var url = `https://www.xe.com/currencyconverter/convert/?Amount=${amount}&From=${from}&To=${to}`;
      

          axios.get(url).then(         (res) => {
              const $ = cheerio.load(res.data);
          
              var srcTxt = $('.iGrAod').text();
          

              var embed  = new Discord.MessageEmbed()
                .setColor('#BF40BF')
                .setTitle('Currency Calculator')
                .setURL('https://www.xe.com/currencyconverter/convert/')
                .addFields({
                        name: 'User Input',
                        value: `**Amount:** ${amount}\n**From:** ${from} \n**To:** ${to}`
                      },{
                        name: 'Conversion',
                        value: srcTxt
                      },{
                        name: '_Exchange rates and currency conversion are for informational    purposes only._',
                        value: '\u200B'
                      }

                )
                .setThumbnail(' ')
                .setFooter('Topher | ',' ');
              message.channel.send({embed});
              }) 

            
    
      };
      scrapeProduct();
      console.log('user used the covert command');
     };

    
    //-Shoe size Conversion------------------------------------//

    if (cmd === 'size'){
      

      if(args[2] === 'us'){


        let eucon = {
          3.5: 35.5,
          4: 36,
          4.5: 36.5,
          5: 37.5,
          5.5:38,
          6:38.5,
          6.5:39,
          7:40,
          7.5:40.5,
          8:41,
          8.5:42,
          9:42.5,
          9.5:43,
          10:44,
          10.5:44.5,
          11:45,
          11.5:45.5,
          12:46,
          12.5:48,
          13:47.5,
          13.5:48,
          14:48.5,
          15:49.5,
          16:50.5,
          17:51.5,
          18:52.5
        };
        let ukcon = {
          3.5 : 3,
          4   : 3.5,
          4.5 : 4,
          5   : 4.5,
          5.5 : 5,
          6   : 5.5,
          6.5 : 6,
          7   : 6,
          7.5 : 6.5,
          8   : 7,
          8.5 : 7.5,
          9   : 8,
          9.5 : 8.5,
          10  : 9,
          10.5: 9.5,
          11  : 10,
          11.5: 10.5,
          12  : 11,
          12.5: 11.5,
          13  :  12,
          13.5: 12.5,
          14  : 13,
          15  : 14,
          16  : 15,
          17  : 16,
          18  : 17
        }
        var eu = eucon[args[1]];
        var uk = ukcon[args[1]];

        var sizeembed  = new Discord.MessageEmbed()
          .setColor('#BF40BF')
          .setTitle('Shoe Size Converter')
          .setURL('https://stockx.com/news/mens-sneakers-sizing-chart/')
          .setAuthor('Topher')
          .addFields({
                  name: 'US',
                  value: `${args[1]}`,
                  inline: true
                },{
                  name: 'EU',
                  value: `${eu}`,
                  inline: true
                },{
                  name: 'UK',
                  value: `${uk}`,
                  inline: true
                }

          )
          .setFooter('Topher')
          .setThumbnail(' ')

      message.channel.send({embed:sizeembed});
      console.log("User used size command")

      }else if(args[2] === 'eu'){
       //var uscon = parseFloat(args[1]) - 32;
       //var ukcon = parseFloat(args[1]) - 32.5;

        let uscon = {
          
        35.5 : 3.5 ,
        36   : 4   ,
        36.5 : 4.5 ,
        37.5 : 5   ,
        38   : 5.5 ,
        38.5 : 6   ,
        39   : 6.5 ,
        40   : 7   ,
        40.5 : 7.5 ,
        41   : 8   ,
        42   : 8.5 ,
        42.5 : 9   ,
        43   : 9.5 ,
        44   : 10  ,
        44.5 : 10.5,
        45	 : 11  ,
        45.5 : 11.5,
        46	 : 12  ,
        47	 : 12.5,
        47.5 : 13  ,
        48	 : 13.5,
        48.5 : 14  ,
        49.5 : 15  ,
        50.5 : 16  ,
        51.5 : 17  ,
        52.5 : 18  
        };

        let ukcon = {
          35.5 :  3,
          36   :  3.5,
          36.5 :  4,
          37.5 :  4.5,
          38   :  5,
          38.5 :  5.5,
          39   :  6,
          40   :  6,
          40.5 :  6.5,
          41   :  7,
          42   :  7.5,
          42.5 :  8,
          43   :  8.5,
          44   :  9,
          44.5 :  9.5,
          45	 :  10,
          45.5 :  10.5,
          46	 :  11,
          47	 :  11.5,
          47.5 :  12,
          48	 :  12.5,
          48.5 :  13,
          49.5 :  14,
          50.5 :  15,
          51.5 :  16,
          52.5 :  17
        }  

        var us = uscon[args[1]];
        var uk = ukcon[args[1]];

        var sizeembed  = new Discord.MessageEmbed()
          .setColor('#BF40BF')
          .setTitle('Shoe Size Converter')
          .setURL('https://stockx.com/news/mens-sneakers-sizing-chart/')
          .setAuthor('Topher')
          .addFields({
                  name: 'US',
                  value: `${us}`,
                  inline: true
                },{
                  name: 'EU',
                  value: `${args[1]}`,
                  inline: true
                },{
                  name: 'UK',
                  value: `${uk}`,
                  inline: true
                }

          )
          .setFooter('Topher')
          .setThumbnail(' ')

      message.channel.send({embed:sizeembed});
      console.log("User used size command")
      }else if(args[2] === 'uk'){
        let uscon = {
          
          3   : 3.5 ,
          3.5 : 4   ,
          4   : 4.5 ,
          4.5 : 5   ,
          5   : 5.5 ,
          5.5 : 6   ,
          6   : 6.5 ,
          6   : 7   ,
          6.5 : 7.5 ,
          7   : 8   ,
          7.5 : 8.5 ,
          8   : 9   ,
          8.5 : 9.5 ,
          9   : 10  ,
          9.5 : 10.5,
          10  : 11  ,
          10. : 11.5,
          11  : 12  ,
          11. : 12.5,
          12  : 13  ,
          12. : 13.5,
          13  : 14  ,
          14  : 15  ,
          15  : 16  ,
          16  : 17  ,
          17  : 18  
          };
  
          let ukcon = {
          3   : 35.5,
          3.5 : 36  ,
          4   : 36.5,
          4.5 : 37.5,
          5   : 38  ,
          5.5 : 38.5,
          6   : 39  ,
          6   : 40  ,
          6.5 : 40.5,
          7   : 41  ,
          7.5 : 42  ,
          8   : 42.5,
          8.5 : 43  ,
          9   : 44  ,
          9.5 : 44.5,
          10  : 45	,
          10. : 45.5,
          11  : 46	,
          11. : 47	,
          12  : 47.5,
          12. : 48	,
          13  : 48.5,
          14  : 49.5,
          15  : 50.5,
          16  : 51.5,
          17  : 52.5
          }  
  
          var us = uscon[args[1]];
          var eu = ukcon[args[1]];

        var sizeembed  = new Discord.MessageEmbed()
          .setColor('#BF40BF')
          .setTitle('Shoe Size Converter')
          .setURL('https://stockx.com/news/mens-sneakers-sizing-chart/')
          .setAuthor('Topher')
          .addFields({
                  name: 'US',
                  value: `${us}`,
                  inline: true
                },{
                  name: 'EU',
                  value: `${eu}`,
                  inline: true
                },{
                  name: 'UK',
                  value: `${args[1]}`,
                  inline: true
                }

          )
          .setThumbnail(' ')
          .setFooter('Topher');
           
      message.channel.send({embed:sizeembed});
      console.log("User used size command")
      }else{
        message.channel.send("Error converting size -" + "<@" + message.author + "> \nPlease make sure you use the correct command format and the correct country\n!size <shoe size> <us/uk/eu> \nEx: !size 7 us\n ").then(msg => msg.delete({timeout: 10000}));

      };


    };

    //-Ebay view bot------------------------------------//

    if (cmd === 'view') {
        
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Please wait 5 minutes before viewing another post. - " + "<@" + message.author + ">").then(msg => msg.delete({timeout: 80000}));
            return false;
        } else {

           // the user can type the command ... your command code goes here :)

        // Adds the user to the set so that they can't talk for a minute
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, 300000);
        }

        if(isNaN(args[1])){
            message.channel.send("Please enter a valid number input \n!view <Number> <Ebay Link>").then(msg => msg.delete({timeout: 10000}));
            console.error(`Error:` + `Invalid number input`);
            return false;
        }else if(!args[2].includes('ebay')){
            message.channel.send("Please enter a valid Ebay link \n \n !view <Number> <Ebay Link>").then(msg => msg.delete({timeout: 10000}));
            console.error(`Error:` + `Invalid ebay link`);
            return false;
        }else if(args[1] > 100){
            console.error(`Error:` + `Views requested excceded the bots limit`);
            message.channel.send("Number of views request excced the bots view limit. Users may only call a view count of 100 views or less...").then(msg => msg.delete({timeout: 10000}));
            return false;
        };

        var sebayEmbed  = new Discord.MessageEmbed()
            .setColor('#BF40BF')
            .setTitle('Ebay View Bot')
            .setDescription(`Starting up ${args[1]} views...`)
            .setAuthor('Topher')
            .addFields({
                    name: `\u200B`,
                    value: `View Count: ${args[1]} \nUsers Link: ${args[2]}`
                  },{
                    name: `\u200B`,
                    value: `Go grab a cup of coffee, this may take a few seconds:smile:`
                  }

            )
            .setFooter('Topher');
        message.channel.send({embed: sebayEmbed});
        console.log("User used view command")
        
        const axios = require('axios');
        var i;
        var result = ' ';

        async function watch() {
        for (i = 1; i <= args[1]; i++){
            await sleep(750);
            axios.get(`${args[2]}`);
            result = result + i;
            setInterval(() => {
                logUpdate(`Views: ${i}`);
            });
        if(i == args[1]){
            var febayEmbed  = new Discord.MessageEmbed()
            .setColor('#BF40BF')
            .setTitle('Ebay View Bot')
            .setAuthor('Topher')
            .addFields({
                    name: `Successfully added ${args[1]} views to users ebay post`,
                    value: `_Recommended to wait a minimum of 5 minutes before starting another view count._\n` +"<@" + message.author.id + ">"
                  }

            )
            .setThumbnail(' ')
            .setFooter('Topher');
            message.channel.send({embed: febayEmbed});
            console.log('Finished Ebay views')
            break;
            }
        }   
        }
        watch();
        
        
    };

    //-Seller Fees------------------------------------//

    if (cmd === 'fees'){
        var num = parseFloat(args[1]);
        var stock1 = num - (num * .125);
        var stock2 = num - (num * .120);
        var stock3 = num - (num * .115);
        var stock4 = num - (num * .110);
        var goat = num - (num * .095) - 5;
        var goatCash = goat - (goat * .029);
        var paypal = num - (num * 0.029) - .30;
        var grailed = num - (num * 0.089) - .30;
        var flightclub = num - (num * .020);
        var ebay = num - (num * .129) - .30;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });

        
        var feeEmbed  = new Discord.MessageEmbed()
            .setColor('#BF40BF')
            .setTitle('Fee Calculater')
            .addFields({
                    name: 'Stock X Seller Level 1',
                    value: `$${num} - 12.5%: **_${formatter.format(stock1)}_** `
                  },{
                    name: 'Stock X Seller Level 2',
                    value: `$${num} - 12%: **_${formatter.format(stock2)}_** `
                  },{
                    name: 'Stock X Seller Level 3',
                    value: `$${num} - 11.5%: **_${formatter.format(stock3)}_** `
                  },{
                    name: 'Stock X Seller Level 4',
                    value: `$${num} - 11%: **_${formatter.format(stock4)}_** `
                  },{
                    name: 'Goat',
                    value: `$${num} - 9.5% - $5: **_${formatter.format(goat)}_** \nCashout option - 2.9%: **_${formatter.format(goatCash)}_** `
                  },{
                    name: 'Paypal',
                    value: `$${num} - 2.9% - 0.30 cents: **_${formatter.format(paypal)}_** `
                  },{
                    name: 'Grailed',
                    value: `$${num} - 8.9% - 0.30 cents: **_${formatter.format(grailed)}_**`
                  },{
                    name: 'Flight Club',
                    value: `$${num} - 20%: **_${formatter.format(flightclub)}_** `
                  },{
                    name: 'Stadium Goods',
                    value: `$${num} - 20%: **_${formatter.format(flightclub)}_** `
                  },{
                    name: 'Ebay',
                    value: `$${num} - 12.9% - 0.30 cents: **_${formatter.format(ebay)}_** \n__NOTE: Ebay does not charge seller fees on sneakers that are listed $100 or more.__`
                  },

            )
            .setFooter('Topher');
             
      message.channel.send({embed: feeEmbed});
      console.log("User used fee command")  
    };

    //-Alternate address examples------------------------------------//

    if(cmd === 'alt'){
      message.delete({timeout: 500}).catch(console.error)
      
      function getRandomLet(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < 2; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      };

      
        let number = Math.floor((Math.random() * 500) + 1);
        let letter = getRandomLet();
        let letter2 = getRandomLet();
        var address = args.slice(1).join(' ').toLowerCase();


        function jig(){
        var acro = ['street', 'way', 'road', ' avenue', 'boulevard', 'lane', 'court', 'drive', 'circle'];
        var n = address.indexOf(acro)
        if (n){
          var newAddress = address
              .replace("street", "St.")
              .replace("way", "Wy.")
              .replace("road", "Rd.")
              .replace("avenue", "Ave.")
              .replace("boulevard", "Blvd." )
              .replace("lane", "Ln.")
              .replace("court", "Ct.")
              .replace("drive", "Dr.")
              .replace("circle", "Cir.");
         
          var altaddy  = new Discord.MessageEmbed()
            .setColor('#BF40BF')
            .setTitle('Alternate Address example')
            .addFields({
                    name: 'Your address: ',
                    value: `${address}`
                  },{
                    name: 'Alt address: ',
                    value: `${letter} ${newAddress} \nAPT ${letter2} ${number}`
                  },{
                    name: "_Note:_", 
                    value: '_This is a example of how your address is when j1gged. If this did not j1g your address correctly, the bot had trouble proccessing your address.\n Ignore the second APT number if you live in a apartment_ '
                  }
  
              )
              .setFooter('Topher');
               
              message.author.send({embed: altaddy}).then(console.log("User used address command 1")).catch(console.error)
              


        }
        
        else{
          var altaddy2  = new Discord.MessageEmbed()
            .setColor('#BF40BF')
            .setTitle('Alternate Address example')
            .addFields({
                  name: 'Your address: ',
                  value: `${address}`
                },{
                  name: 'Alt address: ',
                  value: `${letter} ${address} \nAPT ${letter2} ${number}`
                },{
                  name: "_Note:_", 
                  value: 'This is a example of how your address when j1gged. If this did not j1g your address correctly, the bot had trouble proccessing your address.\n Ignore the second APT if you live in a apartment_ '
                }
  
              )
              .setFooter('Topher');
               
              message.author.send({embed: altaddy2}).then(console.log("User used address command 2")).catch(console.error)
        console.log("User used address command 2")

        }
      }
      jig();
    
    };

    //-Guide to post for members to use------------------------------------//

    if(cmd === 'guide'){
      if (!message.member.hasPermission("ADMINISTRATOR")){
        message.channel.send('Sorry but only memebers with "ADMINISTRATOR" perms can use this command').then(message.delete({timeout: 60000}));
        return false
      }else{
        var guide  = new Discord.MessageEmbed()
            .setColor('#BF40BF')
            .setTitle('Command guide')
            .setDescription('Topher command guide')
            .addFields({
                    name: 'Ebay views',
                    value: " ``<!view> <number of views> <URL listing link>``\n Example: ``!view 50 https://ebay.com/product/listing`` \nTopher bot will add the number of views requested to your listing url. Views count request cannot excced the limit of 101 views"
                  },{
                    name: 'App fee calculator',
                    value: "``<!fees> <listing price>``\n Example: ``!fees 270`` \nCalculates the payouts of each selling platform."
                  },{
                    name: 'Shoe size converter',
                    value: "``<!size> <shoe size> <country>(EU, US, UK)``\n Example: ``!size 12 uk`` \n Compares the shoe size of each country (US, EU, UK)"
                  },{
                    name: 'Currency calculator',
                    value: "``<!convert> <number amount> <from country> <to country>``\n Example: ``!convert 50 usd eur`` \nGet a currency conversion from https://www.xe.com "
                  },{
                    name: 'Curency List',
                    value: "``<!currency list>``\nExample:``!currency list`` \nProvides a list of countries that is avalible to convert to another currency."
                  },{
                    name: 'Alternate address',
                    value: "``<!alt> <first line address>``\nExample:``!alt 1235 Topher avenue``\n Provides an example of how your own address is j1gged."
                  },{
                    name: 'Stock',
                    value: "``<!stock> <stock acronym>``\nExample:``!stock aapl`` \nDisplays current stock information from yahoo finance API."
                  },{
                    name: 'Stock pinger',
                    value: "``<!watch> <stock acronym> <stock price>``\nExample:``!watch aapl 150`` \nSets a pinger to when the stock reaches the  stock price target."
                  },{
                    name: 'Top 3 Crypto',
                    value: "``<!crypto>``\nExample:``!crypto`` \nDisplays the top 3 trending cryptos according to CoinMarketCap."
                  },{
                    name: 'Suggestion post',
                    value: "``<!request> <suggestion>``\nExample:``!request more guides`` \nPost embed of your request in the suggestions channel. Please react to other suggestions for it helps improve the server."
                  },{
                    name: 'Crypto Coin Description',
                    value: "``<!coin> <Coin abbreviation >``\nExample:``!coin btc`` \nGathers the coins current information from CoinMarketCap."
                  }
  
              )
              .setFooter('Topher');
               
              message.channel.send({embed: guide}).then(console.log("command guide sent".green)).catch(console.error)
        }
      }      
});



client.login(TOKEN)
