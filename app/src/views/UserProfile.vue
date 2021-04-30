<template>
    <div class="user-profile">
        <NavBar />
        <UserProfileForm />
        <Footer />
    </div>
</template>

<script>
import NavBar from '../components/NavBar'
import UserProfileForm from '../components/UserProfileForm'
import Footer from '../components/Footer'

export default {
    name: 'UserProfile',
    mounted() {
        var logged = false;
        var user_id = '';
        
        if (this.$cookies.isKey('logged')) logged = his.$cookies.get('logged');
        else {
            if (this.$session.exists() && this.$session.has('logged')) 
                logged = this.$session.get('logged');
        }

        if (this.$cookies.isKey('user_id')) user_id = his.$cookies.get('user_id');
        else {
            if (this.$session.exists() && this.$session.has('user_id')) 
                user_id = this.$session.get('user_id');
        }

        if (!logged && user_id == '') this.$router.push('/');
    },
    components: {
        'NavBar': NavBar,
        'UserProfileForm': UserProfileForm,
        'Footer': Footer
    }
}
</script>
