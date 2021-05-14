<template>
  <div class="home">
    <NavBar />
    <div>

    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

import * as d3 from 'd3';

export default {
  name: 'Home',
  components: {
    'NavBar': NavBar,
    'Footer': Footer
  }
}
</script>
