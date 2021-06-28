<template>
    <div class="login" style="height: 85vh;">
        <b-modal id="login" :title="modal_title" ok-only @ok="reload">
            <p>{{modal_text}}</p>
        </b-modal>
        <h2 style="margin: 6vh 0 3vh 0">Iniciar Sesión</h2>
        <div v-if="error" class="text-danger">Los credenciales son incorrectos</div>
        <br v-if="error">
        <b-form class="form-login" @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group 
                id="input-group-email"
                label="Correo Electrónico:"
                label-for="input-email"
                :invalid-feedback="emailFeedback"
            >
                <b-form-input style="min-width: 16rem;" :class="email"
                    id="input-email"
                    v-model="form.email"
                    type="email"
                    placeholder="Correo Electrónico"
                    required
                />
            </b-form-group>

            <b-form-group 
                id="input-group-password"
                label="Contraseña:"
                label-for="input-password"
                :invalid-feedback="passwordFeedback"
            >
                <b-form-input style="min-width: 16rem;" :class="password"
                    id="input-password"
                    v-model="form.password"
                    type="password"
                    placeholder="Contraseña"
                    required
                />
            </b-form-group>

            <b-form-group 
                id="input-group-checkboxes" 
                v-slot="{ ariaDescribedby }"
            >
                <b-form-checkbox-group
                    v-model="form.checked"
                    id="checboxes-rememberme"
                    :aria-describedby="ariaDescribedby"
                >
                    <b-form-checkbox value="remember">Recuerdame</b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>
            <div class="login-form-buttons">
                <b-button type="reset" variant="warning">Limpiar</b-button>
                <b-button type="submit" variant="primary">Iniciar Sesión</b-button>
            </div>
        </b-form>
    </div>
</template>

<script>

export default {
  name: 'LoginForm',
  data() {
      return {
          formFeedback: '',
          form: {
              email: '',
              password: '',
              checked: []
          },
          show: true,
          email: '',
          password: '',
          emailFeedback: '',
          passwordFeedback: '',
          error: false,
          modal_title: '',
          modal_text: '',
          ok: false
      }
  },
  computed: {
      errorComputed: function() {
          return this.error;
      }
  },
  methods: {
      onSubmit(event) {
          event.preventDefault();

          let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
          let isValid = true;
          
          if (this.form.email == '' || this.form.email == null || !emailRegex.test(this.form.email)) {
              isValid = false;
              this.email = 'form-control is-invalid';
              this.emailFeedback = 'El correo electrónico es incorrecto'
          }

          if (this.form.password == '' || this.form.password == null) {
              isValid = false;
              this.password = 'form-control is-invalid';
              this.passwordFeedback = 'La contraseña es incorrecta'
          }

          if (isValid) {
              this.$http({
                  url: 'http://api.rmoreno.me/user/login',
                  method: 'post',
                  headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                  data: {
                      email: this.form.email,
                      pwd: this.form.password
                  }
              }).then((res) => {
                  console.log(res);
                  if (res.data.code === 0) {
                      if (this.form.checked.includes('remember')) { // Set up cookies
                        this.$cookies.set('logged', true);
                        this.$cookies.set('user_id', res.data.user_id);
                        this.$cookies.set('username', res.data.username);
                      } else { // Set up session
                        this.$session.set('logged', true);
                        this.$session.set('user_id', res.data.user_id);
                        this.$session.set('username', res.data.username);
                      }
                      
                      this.modal_title = "¡Iniciada Sesión!";
                      this.modal_text = "Has iniciado sesión correctamente";
                      this.ok = true;
                      this.$bvModal.show("login");
    
                  } else {
                      if (res.data.code === 1) {
                        this.error = true;
                        this.modal_title = "¡Ha ocurrido un problema!";
                        this.modal_text = "Ha ocurrido un problema al iniciar sesión";
                        this.$bvModal.show("login");
                      } else {
                          this.modal_title = "¡Ha ocurrido un problema!";
                          this.modal_text = "Ha ocurrido un problema al iniciar sesión";
                          this.$bvModal.show("login");
                      }
                  }
              }, (err) => {
                  console.log(err);
              });
          }
      },
    onReset(event) {
        event.preventDefault();
        this.form.email = '';
        this.form.password = '';
        this.form.checked = [];
        this.show = false;
        this.$nextTick(() => {
            this.show = true;
        });
    },
    reload: function() {
        if (this.ok) this.$router.push('/');
        this.ok = false;
    }
  }
}
</script>