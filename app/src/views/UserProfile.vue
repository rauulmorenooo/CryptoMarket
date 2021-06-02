<template>
    <div class="profile">
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
    components: {
        'NavBar': NavBar,
        'UserProfileForm': UserProfileForm,
        'Footer': Footer
    },
    mounted() {
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

        if (!logged && user_id == '') this.$router.push('/');
    },
}
</script>
