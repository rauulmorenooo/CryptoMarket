no<template>
    <div class="content-cryptomarket" style="height: 85vh">
        <div class="main">
            <b-modal id="inversion" :title="this.modal_title" class="inversion" @ok="test">
                <div class="i-data">
                    <p><strong>Precio:</strong> {{this.price}} $</p> <!-- Precio de la criptomoneda en ese momento-->
                    <p><strong>Cantidad:</strong> {{this.qty}} {{this.crypto}}</p> <!-- Cantidad de la criptomoneda a gastar-->
                    <div id="creditos">
                        <strong>Créditos a gastar:</strong>
                        <b-form-input
                            id="creditos-input"
                            type="number"
                            size="sm"
                            step="100"
                            min="0"
                            :max="this.creditos"
                            v-model="input.spent"
                            @change="computeQty"
                            @keypress="computeQty"
                        >
                        </b-form-input>
                    </div>
                    <p><strong>Mis créditos:</strong> {{this.restante}} $</p>
                </div>
            </b-modal>
            <b-modal id="register" :title="this.modal_title">
                <p>
                    ¡Antes de poder invertir en Crypto Market debes registrarte!
                    <a href="/register">
                        Registrarme
                    </a>
                </p>
            </b-modal>
            <b-modal id="correcto" :title="this.modal_title">
                <p>Inversión realizada correctamente. Puedes ver tus inversiones en <a href="/user/investments">Mis Inversiones</a></p>
            </b-modal>
            <div class="options">
                <h4>Criptomoneda</h4>
                <b-form-select class="selector" v-model="crypto" :options="cryptos" @change="updateChart"></b-form-select>
                
                <h4>Tipo</h4>
                <b-form-select class="selector" v-model="type" :options="types" @change="changeIntervals"></b-form-select>

                <h4>Intervalo</h4>
                <b-form-select class="selector" v-model="interval" :options="intervals" @change="updateChart"></b-form-select>

                <!-- if custom -> show date pickers -->
                <div v-if="interval == 'custom'" class="dates">
                    <span>
                        <h5>De:</h5>
                        <b-form-datepicker class="date-picker" id="from" v-model="from" @input="changeFrom" />
                    </span>
                    <span>
                        <h5>A:</h5>
                        <b-form-datepicker class="date-picker" id="to" v-model="to" @input="changeTo" />
                    </span>
                    <p style="color: #dc3545;" v-if="series.length == 0 && from != '' && to != ''">No existen datos para ese rango de fechas</p>
                </div>
            </div>
            <div class="d-flex justify-content-center chart">
                <apexchart ref="cryptochart" width="550%" height="95%" type="candlestick" :options="options" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'Chart',
    data() {
        return {
            // show: false,
            from: '',
            to: '',
            crypto: 'BTC',
            cryptos: [
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
            type: 'daily',
            types: [
                {value: 'daily', text: 'Diaria'},
                {value: 'historical', text: 'Histórica'},
            ],
            interval: '5m',
            intervalsDaily: [
                {value: '5m', text: '5 minutos'},
                {value: '15m', text: '15 minutos'},
                {value: '30m', text: '30 minutos'},
                {value: '1h', text: '1 hora'},
                {value: '4h', text: '4 horas'},
            ],
            intervalsHistorical: [
                {value: '1m', text: '1 mes'},
                {value: '3m', text: '3 meses'},
                {value: '6m', text: '6 meses'},
                {value: '12m', text: '12 meses'},
                {value: 'custom', text: 'Personalizado'},
            ],
            start_date: null,
            end_date: null,
            intervalFunction: null,
            series: [],
            options: {
                chart: {
                    type: 'candlestick',
                    height: 400,
                    width: '100%',
                    events: {
                        dataPointSelection: (event, chartContext, config) => {
                            if (this.logged && this.user_id != '') {
                                this.price = config.w.config.series[config.seriesIndex].data[config.dataPointIndex].y[0];
                                this.date = config.w.config.series[config.seriesIndex].data[config.dataPointIndex].x;
                                this.modal_title = '¿Invertir en ' + this.crypto + '?';
                                this.$http({
                                    url: 'http://api.rmoreno.me/user/' + this.user_id + '/credits',
                                    method: 'get',
                                    headers: {'Content-type':'application/json',
                                              'Access-Control-Allow-Origin': '*'
                                              }
                                }).then((res) => {
                                    this.creditos = res.data.msg;
                                })
                                this.$bvModal.show("inversion");
                            } else {
                                this.modal_title = '¡Debes registrarte!'
                                this.$bvModal.show('register');
                            }
                        }
                    },
                    animations: {
                        enabled: false
                    },
                },
                title: {
                    align: 'center'
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: 'MMM \ yy',
                            day: 'dd MMM',
                            hour: 'HH:mm'
                        },
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
            price: 0,
            modal_title: '',
            creditos: 0,
            logged: false,
            user_id: '',
            date: '',
            input: {
                spent: 0
            }
        }
    },
    methods: {
        changeIntervals: function() {
            this.interval = (this.type == 'daily' ? '5m' : '1m');
            this.updateChart();
        },
        updateChart: function() {
            this.getData(this.type, this.interval, this.crypto);
        },
        changeFrom: function() {
            if (this.from != '' && this.to != '')
                this.getData(this.type, this.interval, this.crypto);
        }, 
        changeTo: function() {
            if (this.from != '' && this.to != '')
                this.getData(this.type, this.interval, this.crypto);
        },
        getData: function(type, interval, crypto) {
            if (this.type == 'historical' && this.intervalFunction != null) {
                clearInterval(this.intervalFunction);
            }

            var data = [];
            this.series = [];

            if (interval == 'custom') {
                type = type + '/custom';

                if (this.from != '' && this.to != '') {
                    this.$http({
                        url: 'http://api.rmoreno.me/symbol/' + crypto + '/' + type,
                        method: 'post',
                        headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                        data: {
                            de: this.from,
                            a: this.to
                        }
                    }).then((res) => {
                        res.data.msg.forEach(r => {
                        data.push({
                            x: new Date(r.start_time),
                            y: [(typeof(r.open_price) == 'string' ? r.open_price.replaceAll("\"", "") : r.open_price),
                                (typeof(r.highest) == 'string' ? r.highest.replaceAll("\"", "") : r.highest),
                                (typeof(r.lowest) == 'string' ? r.lowest.replaceAll("\"", "") : r.lowest),
                                (typeof(r.close_price) == 'string' ? r.close_price.replaceAll("\"", "") : r.close_price)
                            ]
                        });
                    });

                        this.series.push({data: data});
                    });
                }

            } else {
                this.$http({
                url: 'http://api.rmoreno.me/symbol/' + crypto + '/' + type,
                method: 'post',
                headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                data: {
                    interval: interval
                }
            }).then((res) => {
                res.data.msg.forEach(r => {
                    data.push({
                        x: new Date(r.start_time),
                        y: [(typeof(r.open_price) == 'string' ? r.open_price.replaceAll("\"", "") : r.open_price),
                            (typeof(r.highest) == 'string' ? r.highest.replaceAll("\"", "") : r.highest),
                            (typeof(r.lowest) == 'string' ? r.lowest.replaceAll("\"", "") : r.lowest),
                            (typeof(r.close_price) == 'string' ? r.close_price.replaceAll("\"", "") : r.close_price)
                        ]
                    });
                });

                this.series.push({data: data});

                if (type == 'daily') {
                    this.getDaily();
                    this.intervalFunction = setInterval(this.getDaily, 10000);
                }
            });
            }
        },
        getDaily: function() {
            if (this.start_date == null) {
                this.start_date = moment();

                this.$http({
                    url: 'http://api.rmoreno.me/symbol/' + this.crypto + '/lastest',
                    method: 'get',
                    headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              }
                }).then((res) => {
                    this.series[0].data.push({
                        x: new Date(res.data.msg[0].time),
                        y: [(typeof(res.data.msg[0].price) == 'string' ? res.data.msg[0].price.replaceAll("\"", "") : res.data.msg[0].price),
                            (typeof(res.data.msg[0].price) == 'string' ? res.data.msg[0].price.replaceAll("\"", "") : res.data.msg[0].price),
                            (typeof(res.data.msg[0].price) == 'string' ? res.data.msg[0].price.replaceAll("\"", "") : res.data.msg[0].price),
                            (typeof(res.data.msg[0].price) == 'string' ? res.data.msg[0].price.replaceAll("\"", "") : res.data.msg[0].price)
                        ]
                    });

                })

            } else {

                var int = undefined;
                var end = moment();
                let data = this.series[0].data;
                

                this.$http({
                    url: 'http://api.rmoreno.me/symbol/' + this.crypto + '/lastest',
                    method: 'get',
                    headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              }
                }).then((res) => {
                    if (this.interval.indexOf('m') != -1) { // Interval is in minutes
                        int = parseInt(this.interval.replaceAll('m', ''));

                        var d = data[data.length - 1];
                        var y = d.y;
                        y[3] = res.data.msg[0].price;
                        y[1] = (y[1] < res.data.msg[0].price ? res.data.msg[0].price : y[1]);
                        y[2] = (y[2] > res.data.msg[0].price ? res.data.msg[0].price : y[2]);
                        d.y = y;
                        data[data.length - 1] = d;
                        this.series = [
                            {
                                data: data
                            }
                        ]
                        if (end.diff(this.start_date, 'minutes') >= int) { // Interval has ended
                            this.start_date = null;
                        }
                    } else { // Interval is in hours
                        int = parseInt(this.interval.replaceAll('h', ''));

                        var d = data[data.length - 1];
                        var y = d.y;
                        y[3] = res.data.msg[0].price;
                        y[1] = (y[1] < res.data.msg[0].price ? res.data.msg[0].price : y[1]);
                        y[2] = (y[2] > res.data.msg[0].price ? res.data.msg[0].price : y[2]);
                        d.y = y;
                        data[data.length - 1] = d;
                        this.series = [
                            {
                                data: data
                            }
                        ]
                        if (end.diff(this.start_date, 'hours') >= int) { // Interval has ended
                            this.start_date = null;
                        }
                    }
                });
            }
        },
        computeQty: function() {
            if (this.input.spent > this.creditos) {
                this.input.spent = this.creditos;
            }
        },
        test: function() {
            this.$http({
                url: 'http://api.rmoreno.me/user/' + this.user_id + '/invest',
                method: 'post',
                headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                data: {
                    symbol: this.crypto,
                    qty: this.qty,
                    price: this.price,
                    creditos: this.input.spent,
                    date: this.date
                }
            }).then((res) => {
                this.input.spent = 0;
                this.modal_title = '¡Inversión realizada!';
                this.$bvModal.show("correcto");
            });
        }
    },
    computed: {
        intervals() {
            return (this.type == 'daily' ? this.intervalsDaily : this.intervalsHistorical);
        },
        qty() {
            return parseFloat(this.input.spent / this.price).toFixed(4);
        },
        restante() {
            return (this.creditos - this.input.spent);
        }
    },
    mounted: function() {
        this.getData(this.type, this.interval, this.crypto);


        if (this.$cookies.isKey('logged')) this.logged = this.$cookies.get('logged');
        else {
            if (this.$session.exists() && this.$session.has('logged')) 
                this.logged = this.$session.get('logged');
        }

        if (this.$cookies.isKey('user_id')) this.user_id = this.$cookies.get('user_id');
        else {
            if (this.$session.exists() && this.$session.has('user_id')) 
                this.user_id = this.$session.get('user_id');
        }
    }
};
</script>
