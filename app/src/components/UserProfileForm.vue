<template>
    <div class="login" style="height: 85vh">
        <b-modal id="perfil" :title="modal_title" ok-only @ok="reload">
            <p>{{modal_text}}</p>
        </b-modal>
        <h2 style="margin: 6vh 0 3vh 0">Modificar Perfil</h2>
        <div v-if="error" class="text-danger">
            <li v-for="error in errors" :key="error.msg">
                {{error.msg}}
            </li>
        </div>
        <b-form @submit="onSubmit">
            <b-form-group
                id="input-group-firstname"
                label='Nombre'
                label-for="input-first-name"
                :invalid-feedback="firstNameFeedback"
            >
                <b-form-input style="min-width: 16rem;" :class="firstname"
                    id="input-first-name"
                    v-model="form.firstname"
                    type="text"
                    placeholder="Nombre"
                />
            </b-form-group>

            <b-form-group
                id="input-group-lastname"
                label='Apellidos'
                label-for="input-last-name"
                :invalid-feedback="lastNameFeedback"
            >
                <b-form-input style="min-width: 16rem;" :class="lastname"
                    id="input-last-name"
                    v-model="form.lastname"
                    type="text"
                    placeholder="Apellidos"
                />
            </b-form-group>

            <b-form-group
                id="input-group-email"
                label='Correo Electrónico'
                label-for="input-email"
                :invalid-feedback="emailFeedback"
            >
                <b-form-input style="min-width: 16rem;" :class="email"
                    id="input-email"
                    v-model="form.email"
                    type="email"
                    placeholder="ejemplo@ejemplo.com"
                />
            </b-form-group>

            <b-form-group
                id="input-group-opassword"
                label-for="input-opassword"
                :invalid-feedback="opasswordFeedback"
            >
                <template #label>
                    Contraseña actual<span class="text-danger">*</span>
                </template>
                <b-form-input style="min-width: 16rem;" :class="opassword"
                    id="input-opassword"
                    v-model="form.opassword"
                    type="password"
                    placeholder="Contraseña actual"
                />
            </b-form-group>

            <b-form-group
                id="input-group-password"
                label-for="input-password"
                :invalid-feedback="passwordFeedback"
            >
                <template #label>
                    Nueva contraseña<span class="text-danger">*</span>
                </template>
                <b-form-input style="min-width: 16rem;" :class="password"
                    id="input-password"
                    v-model="form.password"
                    type="password"
                    placeholder="Nueva contraseña"
                />
            </b-form-group>

            <b-form-group
                id="input-group-rpassword"
                label-for="input-rpassword"
                :invalid-feedback="rpasswordFeedback"
            >
                <template #label>
                    Repite nueva contraseña<span class="text-danger">*</span>
                </template>
                <b-form-input style="min-width: 16rem;" :class="rpassword"
                    id="input-rpassword"
                    v-model="form.rpassword"
                    type="password"
                    placeholder="Repite nueva contraseña"
                />
            </b-form-group>
            <div class="login-form-buttons">
                <b-button type="button" @click="deleteAccount" variant="danger">Eliminar Cuenta</b-button>
                <b-button type="submit" variant="primary">Guardar</b-button>
            </div>
        </b-form>
    </div>
</template>

<script>
export default {
    name: 'UserProfileForm',
    data() {
        return {
            id: '',
            form: {
                firstname: '',
                lastname: '',
                email: '',
                opassword: '',
                password: '',
                rpassword: '',
            },
            firstname: '',
            lastname: '',
            email: '',
            opassword: '',
            password: '',
            rpassword: '',
            firstNameFeedback: '',
            lastNameFeedback: '',
            emailFeedback: '',
            opasswordFeedback: '',
            passwordFeedback: '',
            rpasswordFeedback: '',
            error: false,
            errors: [],
            modal_title: '',
            modal_text: '',
            ok: false
        }
    },
    mounted() {
        let url = 'http://api.rmoreno.me/user/'

        if (this.$cookies.isKey('user_id')) url += this.$cookies.get('user_id');
        else {
            if (this.$session.exists() && this.$session.has('user_id')) 
                url += this.$session.get('user_id');
        }

        this.$http({
            url: url,
            method: 'get',
        }).then((res) => {
            this.form.firstname = res.data.fname;
            this.form.lastname = res.data.lname;
            this.form.username = res.data.username;
            this.form.email = res.data.email;
        }, (err) => {
            console.log(err);
        });

        if (this.$cookies.isKey('user_id')) this.id = this.$cookies.get('user_id');
      else {
          if (this.$session.exists() && this.$session.has('user_id'))
          this.id = this.$session.get('user_id');
      }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();

            let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            let isValid = true; 

            if (this.form.firstname == '' || this.form.firstname == null ||
                this.form.firstname.length > 60) {
                    isValid = false
                    this.firstname = 'form-control is-invalid';
                    if (this.form.firstname.length > 60) {
                        this.firstNameFeedback = 'El nombre no puede tener más de 60 carácteres';
                    } else {
                        this.firstNameFeedback = 'El nombre no puede estar vacio';
                    }
            }

            if (this.form.lastname == '' || this.form.lastname == null ||
                this.form.lastname.length > 60) {
                    isValid = false
                    this.lastname = 'form-control is-invalid';
                    if (this.form.lastname.length > 60) {
                        this.lastNameFeedback = 'Los apellidos no pueden tener más de 60 carácteres'
                    } else {
                        this.lastNameFeedback = 'Los apellidos no puede estar vacios';
                    }
            }

            if (this.form.email == '' || this.form.email == null || !emailRegex.test(this.form.email)) {
                isValid = false;
                this.email = 'form-control is-invalid';
                if (this.form.email == '') {
                    this.emailFeedback = 'El correo electrónico no puede estar vacio incorrecto';
                } else {
                    this.emailFeedback = 'El formato del correo electrónico es incorrecto';
                }
            }

            if (this.form.password == '' || this.form.password == null ||
                this.form.password.length < 6 || this.form.password.length > 20) {
                    isValid = false
                    this.password = 'form-control is-invalid';
                    if (this.form.lastname.length > 60) {
                        this.passwordFeedback = 'La contraseña debe tener entre 6 y 20 carácteres'
                    } else {
                        this.passwordFeedback = 'La contraseña no puede estar vacia';
                    }
                }

                if (this.form.rpassword == '' || this.form.rpassword == null ||
                this.form.rpassword.length < 6 || this.form.rpassword.length > 20) {
                    isValid = false
                    this.rpassword = 'form-control is-invalid';
                    if (this.form.lastname.length > 60) {
                        this.rpasswordFeedback = 'La contraseña debe tener entre 6 y 20 carácteres'
                    } else {
                        this.rpasswordFeedback = 'La contraseña no puede estar vacia';
                    }
                }

            if (this.form.password != this.form.rpassword) {
                isValid = false;
                this.password = 'form-control is-invalid';
                this.rpassword = 'form-control is-invalid';
                this.rpasswordFeedback = 'Las contraseñas no son iguales';
            }

            if (isValid) {
                this.$http({
                    url: 'http://api.rmoreno.me/user/' + this.id,
                    method: 'put',
                    headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                    data: {
                        fname: this.form.firstname,
                        lname: this.form.lastname,
                        email: this.form.email,
                        opwd: this.form.opassword,
                        pwd: this.form.password,
                        rpwd: this.form.rpassword
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.ok = true;
                        this.modal_title = "¡Información modificada!";
                        this.modal_text = "Se ha modificado la información de tu perfil";
                        this.$bvModal.show("perfil");
                    }
                }, (err) => {
                    this.modal_title = "¡Error!";
                    this.modal_text = "Ha ocurrido un error al modificar la información de tu perfil";
                    this.$bvModal.show("perfil");
                });
            }
        },
        deleteAccount(event) {
            event.preventDefault();
            if(confirm('¿Estas seguro de que quieres eliminar tu cuenta?')) {
                this.$http({
                url: 'http://api.rmoreno.me/user/' + this.id,
                method: 'delete',
                headers: {'Content-type':'application/json',
                              'Access-Control-Allow-Origin': '*'
                              },
                }).then((res) => {
                    if(res.data.code === 0) {
                        this.logged = false;
                        
                        if (this.$cookies.isKey('logged')) this.$cookies.remove('logged')
                        else {
                            if (this.$session.exists() && this.$session.has('logged'))
                            this.$session.remove('logged');
                        }

                        if (this.$cookies.isKey('user_id')) this.$cookies.remove('user_id')
                        else {
                            if (this.$session.exists() && this.$session.has('user_id'))
                            this.$session.remove('user_id');

                        }

                        if (this.$cookies.isKey('username')) this.$cookies.remove('username')
                        else {
                            if (this.$session.exists() && this.$session.has('username'))
                            this.$session.remove('username');
                        }
                        this.ok = true;
                        this.modal_title = "¡Cuenta Eliminada!";
                        this.modal_text = "Cuenta eliminada correctamente";
                        this.$bvModal.show("perfil");
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        },
        reload: function() {
        if (this.ok) this.$router.push('/');
        this.ok = false;
        }
      }
}
</script>
