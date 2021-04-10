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
    components: {
        'NavBar': NavBar,
        'UserProfileForm': UserProfileForm,
        'Footer': Footer
    }
}
</script>
