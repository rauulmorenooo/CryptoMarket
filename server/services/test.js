const axios = require('axios');
const timer = require('timers');
const { performance } = require('perf_hooks');

var x = 0;

var tg_0 = performance.now();

function test() {
    axios.get('https://api.binance.com/api/v3/ticker/price')
    .then(res => {
        //console.log(res.data);
        let t0 = performance.now();

        let btcusdt = res.data.find(o => o.symbol == 'BTCUSDT');
        console.log(btcusdt);
        
        let ethusdt = res.data.find(o => o.symbol == 'ETHUSDT');
        console.log(ethusdt);
        
        let bnbusdt = res.data.find(o => o.symbol == 'BNBUSDT');
        console.log(bnbusdt);
        
        let dotusdt = res.data.find(o => o.symbol == 'DOTUSDT');
        console.log(dotusdt);

        let adausdt = res.data.find(o => o.symbol == 'ADAUSDT');
        console.log(adausdt);

        let xrpusdt = res.data.find(o => o.symbol == 'XRPUSDT');
        console.log(xrpusdt);

        let ltcusdt = res.data.find(o => o.symbol == 'LTCUSDT');
        console.log(ltcusdt);

        let linkusdt = res.data.find(o => o.symbol == 'LINKUSDT');
        console.log(linkusdt);

        let bchusdt = res.data.find(o => o.symbol == 'BCHUSDT');
        console.log(bchusdt);

        let t1 = performance.now();
        console.log('Ha tardado ' + (t1 - t0) + " milisegundos ");
        //console.log(res.data["BTCUSDT"]);
        x++;
        if (x == 360) {
            timer.clearInterval(intervalID);
            var tg_1 = performance.now();
            console.log('EL LOOP Ha tardado ' + (tg_1 - tg_0) + " milisegundos ");
        }
    })
    .catch(err => {
        console.log(err);
    });
}

var intervalID = timer.setInterval(test, 5000);

