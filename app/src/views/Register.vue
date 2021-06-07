<template>
    <div class="register">
        <NavBar />
        <RegisterForm />
        <Footer />
    </div>
    
</template>

<script>
import NavBar from '../components/NavBar'
import RegisterForm from '../components/RegisterForm'
import Footer from '../components/Footer'

export default {
    name: 'Register',
    components: {
        'NavBar': NavBar,
        'RegisterForm': RegisterForm,
        'Footer': Footer
    },
    mounted: function() {
        document.title = "Registro - Crypto Market";
    }
}

</script>
