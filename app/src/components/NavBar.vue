<template>
        <b-navbar toggleable="lg" variant="faded" type="light">
            <b-navbar-brand href="/">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36" height="36" viewBox="0 0 640 640">
                    <image id="Rectángulo_1_copia_3" data-name="Rectángulo 1 copia 3" x="9" y="48" width="625" height="545" xlink:href="data:img/png;base64,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"/>
                </svg>
                Crypto Market
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/prices">Precios</b-nav-item>
                    <b-nav-item href="/ranking">Ranking</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto" v-if="logged === true || logged === 'true'">
                    <b-dropdown right variant="primary" id="user-dropdown">
                        <template #button-content>
                            <b-icon icon="person-circle" aria-hidden="true" />
                        </template>
                        <b-dropdown-item :href="'/user/' + id">
                            Perfil
                        </b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item-button >
                            <span class="text-danger" @click="closeSession">Cerrar Sesión</span>
                        </b-dropdown-item-button>                      
                    </b-dropdown>
                </b-navbar-nav>
                
                <b-navbar-nav class="ml-auto" v-else>
                    <b-nav-item href="/login">Login</b-nav-item>
                    <b-nav-item href="/register">Registrarse</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
</template>

<script>

export default {
  name: 'NavBar',
  computed: {
      logged: function() {
          if (this.$cookies.isKey('logged')) {
            return this.$cookies.get('logged');   
          }
          else {
              if (this.$session.exists() && this.$session.has('logged')) 
                return this.$session.get('logged');
          }
      },
      id: function() {
          if (this.$cookies.isKey('user_id')) return this.$cookies.get('user_id');
          else {
              if (this.$session.exists() && this.$session.has('user_id')) 
                return this.$session.get('user_id');
          }
      },
      username: function() {
          if (this.$cookies.isKey('username')) return this.$cookies.get('username');
          else {
              if (this.$session.exists() && this.$session.has('username')) 
                return this.$session.get('username');
          }
      }
  },
  methods: {
      closeSession() {
          console.log('yeeeeet');
          
      }
  }
};
</script>