<template>
    <div class="prices">
        <NavBar />
        <PricesTable />
        <Footer />
    </div>
</template>

<script>
import NavBar from '../components/NavBar'
import PricesTable from '../components/PricesTable'
import Footer from '../components/Footer'

export default {
    name: 'Prices',
    components: {
        'NavBar': NavBar,
        'PricesTable': PricesTable,
        'Footer': Footer
    }
}
</script>
