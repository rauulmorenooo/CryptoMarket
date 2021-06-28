<template>
    <div style="height: 85vh">
        <div class="investment-top">
            <h6>Mis créditos: <span class="text-success">{{this.creditos}}</span></h6>
            <b-button variant="info" :disabled="pedirActivo" @click="pedirCredito">Pedir crédito</b-button>
            <b-button variant="info" @click="showExportar">Exportar Inversiones</b-button>
            <b-button variant="info" @click="showImportar">Importar Inversiones</b-button>
        </div>

        <b-modal id="close" title="¿Cerrar Inversión?" @ok="close">
                <p>¿Estas seguro de cerrar la inversión?</p>
            </b-modal>
            <b-modal id="credito" :title="modal_title" ok-only @ok="reload">
                <p>{{modal_text}}</p>
            </b-modal>
            <b-modal id="exportar" title="Exportar inversiones" @ok="exportar">
                <p>¿Estas seguro de exportar las inversiones abiertas?</p>
            </b-modal>
            <b-modal id="importar" title="Importar inversiones" @ok="importar">
                <b-form-file
                    v-model="file1"
                    :state="Boolean(file1)"
                    placeholder="Escoge un fichero o arrastralo aquí..."
                    drop-placeholder="Arratra un fichero aquí..."
                    accept=".json"
                ></b-form-file>
                <div class="mt-3">Fichero seleccionado: {{file1 ? file1.name : ''}}</div>
            </b-modal>
            <b-modal id="importarFailed" title="No hay créditos suficientes" ok-only>
                <p>No tienes suficientes créditos para realizar las inversiones del fichero importado</p>
            </b-modal>
            <b-modal id="importOk" title="Importadas correctamente" ok-only @ok="reload">
                <p>¡Inversiones realizadas correctamente!</p>
            </b-modal>

        <div v-if="investments.length <= 0">
            <h3>¡Aún no has realizado ninguna inversión!</h3>
        </div>
        <div class="content-investment" v-if="investments.length > 0" style="
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-gap: 1rem;
        margin-left: 1rem;">
            <b-card v-for="i in this.investments" 
                :key="i._id"
                :title="i.symbol"
                tag="article"
                style="max-width: 20rem;"
                class="mb-2"
                no-body
            >
                <b-card-body>
                    <h4 style="margin: 0 0 -20px 0;">{{i.symbol}}</h4><BIconCircleFill 
                                class="justify-self-center align-self-center" 
                                :variant="i.closed ? 'danger' : 'success'" 
                                style="margin: 0 0 1rem 50px;"
                            />  
                <b-card-text>
                    <b-col>
                        <b-row>Cantidad: {{i.qty}} {{i.symbol}}</b-row>
                        <b-row>Fecha de la inversion: {{new Date(i.date).toLocaleDateString()}}</b-row>
                        <b-row>Precio de compra: {{i.price}} $</b-row>
                        <b-row>Créditos gastados: {{i.spent}}</b-row>
                        <b-row v-if="!i.closed">
                            Créditos: {{parseFloat(precio_actual[i.symbol] * i.qty).toFixed(4)}}
                        </b-row>
                        <b-row v-if="i.closed">
                            Créditos {{i.won - i.spent <= 0 ? 'perdidos: ' + parseFloat(i.won - i.spent).toFixed(4) : 'ganados: ' + parseFloat(i.won - i.spent).toFixed(4)}}
                                <!-- ganados: {{parseFloat(i.won - i.spent).toFixed(4)}} -->
                        </b-row>
                    </b-col>
                </b-card-text>
                <b-button v-if="!i.closed" variant="primary" @click="closePrompt(i._id, i.symbol)">Cerrar Inversión</b-button>
                </b-card-body>
            </b-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserInvestmentsComponent',
        data() {
            return {
                user_id: '',
                creditos: 0,
                investments: [],
                investment: null,
                actual: null,
                precio_actual: {
                    "ADA": 0,
                    "BCH": 0,
                    "BNB": 0,
                    "BTC": 0,
                    "DOT": 0,
                    "ETH": 0,
                    "LINK": 0,
                    "LTC": 0,
                    "XRP": 0
                },
                intervalFunction: null,
                modal_title: '',
                modal_text: '',
                json: null,
                file1: null
            }
        },
        methods: {
            getLastest: function() {
                this.$http({
                    url: 'http://api.rmoreno.me/symbol/',
                    method: 'get',
                    headers: {'Content-type':'application/json',
                              }
                }).then((res) => {
                    res.data.msg.forEach(r => {
                        var symbol = r[0].symbol.indexOf("LINK") != -1 ? r[0].symbol.slice(0,4) : r[0].symbol.slice(0, 3);
                        this.precio_actual[symbol] = r[0].price;
                    });
                })
            },
            closePrompt: function(id, s) {
                this.$bvModal.show("close");
                console.log(id);
                console.log(s);
                this.investment = id;
                this.actual = this.precio_actual[s];
            },
            close: function() {
                this.$http({
                    url: 'http://api.rmoreno.me/investment/' + this.investment + '/close',
                    method: 'put',
                    headers: {'Content-type':'application/json',
                              },
                    data: {
                        actual: this.actual
                    }
                }).then((res) => {
                    window.location.replace('/user/investments');
                })

                // Fianl
                this.investment = null;
                this.actual = null;
            },
            pedirCredito: function() {
                var total = 0;
                this.investments.forEach(i => {
                    if (!i.closed) total += (i.qty * this.precio_actual[i.symbol]);
                    console.log(total);
                });

                if (total <= 2500) {
                    this.$http({
                        url: 'http://api.rmoreno.me/user/' + this.user_id + '/addcredits',
                        method: 'get',
                        headers: {'Content-type':'application/json'}
                    }).then((res) => {
                        if (res.data.code == 0) {
                            this.modal_title = 'Crédito añadido correctamente';
                            this.modal_text = 'Se ha añadido correctamente crédito a tu cuenta';
                            this.$bvModal.show("credito");
                        }
                    });
                } else {
                    this.modal_title = 'No puedes pedir crédito';
                    this.modal_text = 'No puedes pedir más créditos ya que dispones de 2500 créditos o más en inversiones abiertas';
                    this.$bvModal.show("credito");
                }
            },
            showExportar: function() {
                this.$bvModal.show("exportar");
            },
            showImportar: function() {
                this.$bvModal.show("importar");
            },
            exportar: function() {
                var exportar = false;
                var inversiones = [];
                var total = 0;
                this.investments.forEach(r => {
                    if (!r.closed) {
                        exportar = true;
                        total += r.qty * this.precio_actual[r.symbol];
                        inversiones.push({
                            "symbol": r.symbol,
                            "date" : r.date,
                            "qty": r.qty,
                            "price": r.price,
                            "spent": r.spent
                        });
                    }
                });

                if (exportar) {
                    this.json = {
                        "total" : total,
                        "inversiones": inversiones
                    }

                    let text = JSON.stringify(this.json);
                    let filename = "inversiones.json";
                    let element = document.createElement('a');
                    element.setAttribute('href', 'data:application/json; charset=utf-8,' + encodeURIComponent(text));
                    element.setAttribute('download', filename);

                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            },
            importar: function() {
                if (this.file1) {
                    const fr = new FileReader();
                    fr.readAsText(this.file1);
                    

                    fr.onload = e => {
                        const result = JSON.parse(e.target.result);

                        if (this.creditos >= result.total) {
                            this.$http({
                                url: 'http://api.rmoreno.me/user/' + this.user_id + '/investmultiple',
                                method: 'post',
                                headers: {'Content-type':'application/json'},
                                data: {
                                    total: result.total,
                                    inversiones: result.inversiones
                                }
                            }).then((res) => {
                                console.log(res);
                                this.file1 = null;
                                this.$bvModal.show("importOk");
                            });
                        } else {
                            this.$bvModal.show("importarFailed");
                        }
                    }
                }
            },
            reload: function() {
                window.location.replace('/user/investments');   
            }
        },
        computed: {
            pedirActivo() {
                var total = 0;

                this.investments.forEach(i => {
                    if (!i.closed) total += (i.qty * this.precio_actual[i.symbol]);
                });

                return (total + this.creditos >= 2500);
            }
        },
        mounted() {
            if (this.$cookies.isKey('user_id')) this.user_id = this.$cookies.get('user_id');
             else {
            if (this.$session.exists() && this.$session.has('user_id'))
                this.user_id = this.$session.get('user_id');
            }
            this.$http({
                url: 'http://api.rmoreno.me/user/' + this.user_id + '/investments',
                method: 'get',
                headers: {'Content-type':'application/json',
                              }
            }).then((res) => {
                res.data.msg.forEach(r => {
                    this.investments.push(r);
                })
            });
            this.getLastest();
            this.intervalFunction = setInterval(this.getLastest, 10000);

            this.$http({
                url: 'http://api.rmoreno.me/user/' + this.user_id + '/credits',
                method: 'get',
                headers: {'Content-type':'application/json',
                            }
            }).then((res) => {
                this.creditos = res.data.msg;
            });
        }
    }
</script>
