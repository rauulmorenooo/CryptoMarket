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

        var logged = false;
        var user_id = '';
    
        if (this.$cookies.isKey('logged')) logged = this.$cookies.get('logged');
        else {
            if (this.$session.exists() && this.$session.has('logged')) 
                logged = this.$session.get('logged');
        }

        if (this.$cookies.isKey('user_id')) user_id = this.$cookies.get('user_id');
        else {
            if (this.$session.exists() && this.$session.has('user_id')) 
                user_id = this.$session.get('user_id');
        }

        if (logged && user_id != '') this.$router.push('/');
    }
}

</script>
