<template>
    <div class="d-flex flex-column align-items-center">
        <div v-if="error" class="text-danger">
            <li v-for="error in errors" :key="error.msg">
                {{error.msg}}
            </li>
        </div>
        <br v-if="error">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
                id="input-group-firstname"
                label-for="input-first-name"
                :invalid-feedback="firstNameFeedback"
            >
                <template #label>
                    Nombre<span class="text-danger">*</span>
                </template>
                <b-form-input :class="firstname"
                    id="input-first-name"
                    v-model="form.firstname"
                    type="text"
                    placeholder="Nombre"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-lastname"
                label-for="input-last-name"
                :invalid-feedback="lastNameFeedback"
            >
                <template #label>
                    Apellidos<span class="text-danger">*</span>
                </template>
                <b-form-input :class="lastname"
                    id="input-last-name"
                    v-model="form.lastname"
                    type="text"
                    placeholder="Apellidos"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-username"
                label-for="input-username"
                :invalid-feedback="usernameFeedback"
            >
                <template #label>
                    Nombre de usuario<span class="text-danger">*</span>
                </template>
                <b-form-input :class="username"
                    id="input-username"
                    v-model="form.username"
                    type="text"
                    placeholder="Nombre de Usuario"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-email"
                label-for="input-email"
                :invalid-feedback="emailFeedback"
            >
                <template #label>
                    Correo Electrónico<span class="text-danger">*</span>
                </template>
                <b-form-input :class="email"
                    id="input-email"
                    v-model="form.email"
                    type="email"
                    placeholder="ejemplo@ejemplo.com"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-password"
                label-for="input-password"
                :invalid-feedback="passwordFeedback"
            >
                <template #label>
                    Contraseña<span class="text-danger">*</span>
                </template>
                <b-form-input :class="password"
                    id="input-password"
                    v-model="form.password"
                    type="password"
                    placeholder="Contraseña"
                    required
                />
            </b-form-group>
            
            <b-form-group
                id="input-group-rpassword"
                label-for="input-rpassword"
                :invalid-feedback="rpasswordFeedback"
            >
                <template #label>
                    Repite la contraseña<span class="text-danger">*</span>
                </template>
                <b-form-input :class="rpassword"
                    id="input-rpassword"
                    v-model="form.rpassword"
                    type="password"
                    placeholder="Contraseña"
                    required
                />
            </b-form-group>
            <b-button type="reset" variant="warning">Limpiar</b-button>
            <b-button type="submit" variant="primary">Registrame</b-button>
        </b-form>
    </div>
</template>

<script>
export default {
    name: 'RegisterForm',
    data() {
        return {
            form: {
                firstname: '',
                lastname: '',
                username: '',
                email: '',
                password: '',
                rpassword: '',
            },
            show: true,
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            rpassword: '',
            firstNameFeedback: '',
            lastNameFeedback: '',
            usernameFeedback: '',
            emailFeedback: '',
            passwordFeedback: '',
            rpasswordFeedback: '',
            error: false,
            errors: []
        }
    },
    computed: {
        errorComputed: function() {
            return this.error;
        },
        errorsComputed: function() {
            return this.errors;
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

            if (this.form.username == '' || this.form.username == null ||
                this.form.username.length < 5 || this.form.username.length > 20) {
                    isValid = false
                    this.username = 'form-control is-invalid';
                    if (this.form.lastname.length > 60) {
                        this.usernameFeedback = 'El nombre de usuario debe tener entre 5 y 20 carácteres'
                    } else {
                        this.usernameFeedback = 'El nombre de usuario no puede estar vacio';
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
                    url: 'http://api.rmoreno.me/user',
                    method: 'post',
                    headers: {'Content-type': 'application/json'},
                    data: {
                        fname: this.form.firstname,
                        lname: this.form.lastname,
                        username: this.form.username,
                        email: this.form.email,
                        pwd: this.form.password,
                        rpwd: this.form.rpassword
                    }
                }).then((res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        // TODO: Avisar al user que sa registrao correctamente
                        this.$router.push('/');
                    } else {
                        this.error = true;
                        if (res.data.code.length == undefined) {
                            switch (res.data.code) {
                                case 1:
                                    console.log('Caso 1');
                                    this.errors.push({ msg: 'El email ya esta en uso' });
                                    this.errors.push({ msg: 'El nombre de usuario ya esta en uso' });
                                    break;
                                case 2:
                                    this.errors.push({ msg: 'El email ya esta en uso' });
                                    break;
                                case 3:
                                    this.errors.push({ msg: 'El nombre de usuario ya esta en uso' });
                                    break;
                                default:
                                    alert('Ha ocurrido un problema con el servidor');
                            }
                        } else {
                            res.data.code.forEach(error => {
                            switch (error) {
                                case 4:
                                    this.errors.push({ msg: 'Error con el nombre' });
                                    break;
                                case 5:
                                    this.errors.push({ msg: 'Error con los apellidos'});
                                    break;
                                case 6:
                                    this.errors.push({ msg: 'Error con el nombre de usuario' });
                                    break;
                                case 7:
                                    this.errors.push({ msg: 'Error con el correo electrónico' });
                                    break;
                                case 8:
                                    this.errors.push({ msg: 'Error con las contraseñas' });
                                    break;
                                default:
                                    console.log('ERROR');
                                    //alert('Ha ocurrido un problema con el servidor');
                            }
                        });
                        }       
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        }, 
        onReset(event) {
            event.preventDefault();
            this.firstname = '';
            this.lastname = '';
            this.username = '';
            this.email = '';
            this.password = '';
            this.rpassword = '';
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        }
    }
}
</script> 