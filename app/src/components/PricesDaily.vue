<template>
    <div style="width: 50%">
        <b-table class="text-center" striped bordered small hover no-border-collapse :items="items"></b-table>
    </div>
</template>

<script>
    var previousPrices = [];
    var interval = undefined;

    export default {
        name: 'PricesTable',
        data() {
            return {
                items: []
            }
        },
        methods: {
            updateItems: function(){
                this.$http({
                    url: 'http://api.rmoreno.me/symbol',
                    method: 'get',
                    headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                }).then((res) => {
                    var prices = previousPrices;
                    this.items = [];
                    res.data.msg.forEach((r, i) => {
                        var variant = 'success';
                        var s = r[0].symbol;
                        if (s.indexOf('LINK') != -1) {
                            var symbol = s.slice(0,4) + "/" + s.slice(4);
                        } else {
                            var symbol = s.slice(0, 3) + "/" + s.slice(3);
                        }

                        var sPrice = '0';
                        var price = 0;



                        if (previousPrices.length < 9) {
                            previousPrices.push(r[0].price);
                            sPrice = r[0].price.toString();
                        } else {
                            price = r[0].price;

                            if (price > prices[i]) {
                                variant = 'success';
                                sPrice = price.toString();
                            } else {
                                if (price < prices[i]) {
                                    variant = 'danger';
                                    sPrice = price.toString();
                                } else {
                                    variant = 'success';
                                    sPrice = price.toString();
                                }
                            } 
                        }
                        previousPrices = prices;
                        this.items.push({"Símbolo": symbol, "Precio ($)": sPrice + ' $', _cellVariants: { "Precio ($)": variant } });

                    });
                });
            }
        },
        mounted: function() {
            this.updateItems();
            interval = setInterval(this.updateItems, 10000);
        },
        beforeDestroy: function() {
            clearInterval(interval);
        }
    }
</script>