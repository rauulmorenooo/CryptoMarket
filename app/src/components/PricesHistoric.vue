<template>
    <div>
        <div class="historic-options">
            <b-form-select class="selector" v-model="crypto" :options="cryptos"></b-form-select>
            <div v-if="crypto != ''" class="d-flex">
                <strong>De:</strong> <b-form-datepicker class="date-picker" id="de" v-model="de" />
                <strong>Hasta:</strong> <b-form-datepicker class="date-picker" id="hasta" v-model="hasta" />
                <b-button style="margin: 0 1rem;" variant="success" @click="query">Aplicar</b-button>
            </div>
        </div>

        <div v-if="crypto != ''">
            <b-table striped bordered small hover no-border-collapse 
                :items="items"
                :per-page="perPage"
                :current-page="currentPage"
            >
            </b-table>
            <b-pagination v-if="items.length > 0"
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
            ></b-pagination>
        </div>
        <div v-if="crypto == ''">
            <h3>
                Por favor, selecciona una criptomoneda y un rango 
                de fechas para visualizar la tabla de precios.
            </h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PricesTable',
        data() {
            return {
                crypto: '',
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
                de: '',
                hasta: '',
                items: [],
                currentPage: 1,
                perPage: 10,

            }
        },
        computed: {
            rows() {
                return this.items.length
            }
        },
        methods: {
            query: function() {
                this.items = [];
                var from = new Date(this.de);
                from.setHours(0, 0, 0);
                var to = new Date(this.hasta);
                to.setHours(23, 59, 59);
                console.log(from);
                console.log(to);
                console.log('http://api.rmoreno.me/symbol/' + this.crypto + '/historic');
                this.$http({
                    url: 'http://api.rmoreno.me/symbol/' + this.crypto + '/historic',
                    method: 'post',
                    headers: {'Content-type': 'application/json'},
                    data: {
                        fdate: from,
                        ldate: to
                    }
                }).then((res) => {
                    console.log(res.data.msg);
                    res.data.msg.forEach((r, i) => {
                        console.log(r);
                        var symbol = '';
                        var s = r.symbol;
                        if (s.indexOf('LINK') != -1) {
                            var symbol = s.slice(0,4) + "/" + s.slice(4);
                        } else {
                            var symbol = s.slice(0, 3) + "/" + s.slice(3);
                        }

                        var date = r.start_time;
                        console.log(typeof(date));
                        var sDate = date.substring(0, 10);
                        sDate = sDate.substring(8, 10) + '/' +
                         sDate.substring(5, 7) + '/' + sDate.substring(0, 4);
                        


                        this.items.push({
                            "Símbolo": symbol,
                            "Fecha (DD/MM/YYYY)": sDate,
                            "Precio Apertura (USDT $)": r.open_price.replaceAll("\"", "") + " $",
                            "Precio Cierre (USDT $)": r.close_price.replaceAll("\"", "")  + " $"
                        });
                    });
                });
            }
        }
    }
</script>