<template>
    <div class="prices">
        <NavBar />
        <PricesComponent />
        <Footer />
    </div>
</template>

<script>
import NavBar from '../components/NavBar'
import PricesComponent from '../components/PricesComponent'
import Footer from '../components/Footer'

export default {
    name: 'Prices',
    components: {
        'NavBar': NavBar,
        'PricesComponent': PricesComponent,
        'Footer': Footer
    }
}
</script>
