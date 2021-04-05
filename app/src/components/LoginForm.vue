<template>
    <div class="loginform d-flex justify-content-center align-items-center">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
                id="input-group-email"
                label="Correo Electrónico"
                label-for="input-1"
            >
                <b-form-input
                    id="input-1"
                    v-model="form.email"
                    type="email"
                    placeholder="Correo Electrónico"
                    requried
                >
                </b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-password"
                label="Contraseña"
                label-for="input-2"
            >
                <b-form-input
                    id="input-2"
                    v-model="form.password"
                    type="password"
                    placeholder="Contraseña"
                    required
                >
                </b-form-input>
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
            <b-button type="submit" variant="primary">Iniciar Sesión</b-button>
            <b-button type="reset" variant="warning">Limpiar</b-button>
        </b-form>
    </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
      return {
          form: {
              email: '',
              password: '',
              checked: []
          },
          show: true
      }
  },
  methods: {
      onSubmit(event) {
          event.preventDefault();
          alert(JSON.stringify(this.form));//TODO: Modificar
      },
      onReset(event) {
          event.preventDefault();
          this.form.email = '';
          this.form.password = '';
          this.form.checked = [];
          this.show = false;
          this.$$nextTick(() => {
              this.show = true;
          });
      }
  }
}
</script>