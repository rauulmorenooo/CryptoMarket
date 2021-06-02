<template>
    <div class="content-cryptomarket">
        <div class="main">
            <div class="options">
                <h4>Tipo de gráfica</h4>
                <div class="type">
                    <b-button id="historico" :status='selected_hist' :variant="historico" @click="select">Histórico</b-button>
                    <b-button id="diario" :status='selected_diario' :variant="diario" @click="select">Diario</b-button>
                </div>
                <h4>Criptomoneda</h4>
                <b-form-select class="selector" v-model="crypto" :options="cryptos" @change="getData"></b-form-select>

                <h4>Intervalo</h4>
                <b-form-select class="selector" v-model="interval" :options="intervals" @change="getData"></b-form-select>

                <b-button 
                    variant="success"
                    @click="showChart"
                >
                Aplicar
                </b-button>
            </div>
            <div class="d-flex justify-content-center chart">
                <apexchart v-if="show" ref="cryptochart" width="1200" type="candlestick" :options="options" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Chart',
    data() {
        return {
            show: false,
            crypto: null,
            cryptos: [
                {value: null, text: 'Selecciona una criptomoneda'},
                {value: 'BNB', text: 'Binance Coin (BNB)' },
                {value: 'BTC', text: 'Bitcoin (BTC)' },
                {value: 'BCH', text: 'Bitcoin Cash (BCH)' },
                {value: 'ADA', text: 'Cardano (ADA)' },
                {value: 'LINK', text: 'Chainlink (LINK)' },
                {value: 'ETH', text: 'Ethereum (ETH)' },
                {value: 'LTC', text: 'Litecoin (LTC)' },
                {value: 'DOT', text: 'PolkaDot (DOT)' },
                {value: 'XRP', text: 'XRP (XRP)'},  
            ],
            interval: null,
            intervals: [
                {value: null, text: 'Selecciona un intervalo'},
                {value: '5m', text: '5 minutos'},
                {value: '15m', text: '15 minutos'},
                {value: '30m', text: '30 minutos'},
                {value: '1h', text: '1 hora'},
                {value: '4h', text: '4 horas'},
                {value: '12h', text: '12 horas'},
            ],
            de: '',
            hasta: '',
            historic: false,
            series: [],
            options: {
                chart: {
                    type: 'candlestick',
                    height: 400
                },
                title: {
                    text: 'Daily Chart',
                    align: 'center'
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            colors: ["red"]
                        }
                    }
                },
                yaxis: {
                    tooltip: {
                        enabled: true
                    }
                }
            },
            historico: 'outline-info',
            diario: 'info',
            selected_hist: false,
            selected_diario: true,
        }
    },
    methods: {
        showChart: function() {
            this.getData();

            if (this.crypto != null && this.interval != null);
            this.show = true;
        },
        getData: function() {
            var data = [];
            this.series = [];
            this.$http({
                url: 'http://api.rmoreno.me/symbol/' + this.crypto + '/dailychart',
                method: 'get',
                headers: {'Content-type': 'application/json'},
            }).then((res) => {
                // x = fecha || y = [apertura, max, low, close]
                res.data.msg.forEach(r => {
                    console.log("Start_time: " + r.start_time);
                    console.log("Array: " + [r.open_price, r.highest, r.lowest, r.close_price])
                    data.push({
                        x: new Date(r.start_time),
                        y: [r.open_price.replaceAll("\"", ""),
                            r.highest.replaceAll("\"", ""),
                            r.lowest.replaceAll("\"", ""),
                            r.close_price.replaceAll("\"", "")]
                    });
                });
                this.series.push({data: data});
            });

            this.$http({
                url: 'http://api.rmoreno.me/symbol/' + this.crypto + '/daily',
                method: 'post',
                headers: {'Content-type': 'application/json'},
                data: {
                    interval: this.interval
                }
            }).then((res) => {
                res.data.msg.forEach(r => {
                    
                });
            })

        }
    },
};
</script>
