<template>
  <div class="home">
    <NavBar />
    <Charts />
    <Footer />
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import Charts from '../components/Charts';
import Footer from '../components/Footer'

export default {
  name: 'Home',
  components: {
    'NavBar': NavBar,
    'Charts': Charts,
    'Footer': Footer
  }
}
</script>
