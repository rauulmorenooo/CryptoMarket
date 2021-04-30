<template>
  <div class="home">
    <NavBar />
    <div class="card center" style="margin: 0 5rem">
      <h1>Bienvenido a Crypto Market</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id diam ex. Nulla facilisi. Ut non nibh facilisis, molestie nisl sit amet, volutpat arcu. Duis ac lectus nisi. Sed euismod gravida tortor, nec egestas quam molestie sed. Cras non sem non mauris facilisis gravida. In efficitur odio ac nibh convallis, a lobortis velit ullamcorper. Etiam eu leo vitae nulla mollis finibus. Curabitur pulvinar vel arcu vel aliquet. Donec tempus felis lobortis bibendum efficitur. Ut dictum et urna sit amet euismod. Mauris eu quam nibh. Integer porttitor arcu ex, ut placerat justo tempus ut.

        Nunc libero mi, fringilla vitae commodo eu, gravida quis quam. In hac habitasse platea dictumst. Maecenas pellentesque leo sit amet interdum posuere. Nulla in varius nibh. Mauris nec nulla ipsum. Suspendisse potenti. Nullam eu tincidunt ex. Sed purus augue, bibendum ut libero in, gravida sagittis enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas vel lacus at massa euismod consectetur in vitae dolor. Proin porttitor metus vel turpis luctus, vel placerat mauris bibendum. Quisque velit magna, varius et placerat et, rutrum ullamcorper turpis. Phasellus eu mollis lorem, quis mattis dolor. Sed dapibus, neque sed sollicitudin blandit, ipsum diam rhoncus ante, id placerat ex magna ac ipsum. Nullam et urna quis augue posuere ultricies.

        Vivamus porttitor est eget metus malesuada, ut interdum nulla vulputate. Cras metus est, sodales ac ligula eu, feugiat pretium enim. Aliquam venenatis sed purus at semper. Vestibulum vel metus porttitor, maximus tortor nec, semper odio. Nullam sagittis ut ligula ut pretium. Duis elementum elementum ligula, mattis hendrerit lectus efficitur sed. Pellentesque scelerisque scelerisque enim, quis tristique erat aliquet sit amet. Proin elementum magna quis arcu egestas sagittis.
      </p>
    </div>
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
