<template>
    <div class="d-flex flex-column align-items-center" style="height: 85vh">
        <div class="table-father">
            <b-button class="btn-table" id="historico" :status='selected_hist' :variant="historico" @click="select">Histórico</b-button>
            <b-button class="btn-table" id="diario" :status='selected_diario' :variant="diario" @click="select">Diario</b-button>
        </div>

        <div class="table-content" v-if="selected_hist">
            <PricesHistoric />
        </div>

        <div class="table-content" v-if="selected_diario">
            <PricesDaily />
        </div>
    </div>
</template>

<script>
    import PricesDaily from './PricesDaily';
    import PricesHistoric from './PricesHistoric';

    export default {
        name: 'PricesComponent',
        components: {
            'PricesDaily': PricesDaily,
            'PricesHistoric': PricesHistoric
        },
        data() {
            return {
                historico: 'outline-info',
                diario: 'info',
                selected_hist: false,
                selected_diario: true,
            }
        },
        methods : {
            select: function(event) {
                switch(event.target.id) {
                    case 'historico':
                        this.selected_hist = true;
                        this.selected_diario = false;
                        this.historico = 'info';
                        this.diario = 'outline-info';
                        break;
                    case 'diario':
                        this.selected_hist = false;
                        this.selected_diario = true;
                        this.diario = 'info';
                        this.historico = 'outline-info';
                        break;
                    default:
                        alert('An error has occured');
                        break;
                }
            }
        }
        
    }
</script>