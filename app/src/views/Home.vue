<template>
  <div class="home">
    <NavBar />
    <Footer />
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export default {
  name: 'Home',
  components: {
    'NavBar': NavBar,
    'Footer': Footer
  }
}
</script>
