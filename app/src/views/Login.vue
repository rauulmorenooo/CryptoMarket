<template>
    <div class="login">
        <NavBar />
        <LoginForm />
        <Footer />
    </div>
</template>

<script>
import NavBar from '../components/NavBar'
import LoginForm from '../components/LoginForm'
import Footer from '../components/Footer'

export default {
    name: 'Login',
    components: {
        'NavBar': NavBar,
        'LoginForm': LoginForm,
        'Footer': Footer
    }
}
</script>
