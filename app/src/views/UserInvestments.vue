<template>
    <div class="content-cryptomarket">
        <NavBar />
        <UserInvestmentsComponent />
        <Footer />
    </div>

</template>

<script>
import NavBar from '../components/NavBar'
import UserInvestmentsComponent from '../components/UserInvestmentsComponent'
import Footer from '../components/Footer'

export default {
    name: 'UserInvestments',
    components: {
        'NavBar': NavBar,
        'UserInvestmentsComponent': UserInvestmentsComponent,
        'Footer': Footer
    },
    mounted() {
        var logged = false;
        var user_id = '';
        
        document.title = "Mis Inversiones - Crypto Market";

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

        if (!logged && user_id == '') this.$router.push('/');
    },
}
</script>
