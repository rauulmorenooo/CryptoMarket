<template>
    <div class="d-flex flex-column align-items-center">
        <b-form @submit="onSubmit">
            <b-form-group
                id="input-group-firstname"
                label='Nombre'
                label-for="input-first-name"
                :invalid-feedback="firstNameFeedback"
            >
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
                label='Apellidos'
                label-for="input-last-name"
                :invalid-feedback="lastNameFeedback"
            >
                <b-form-input :class="lastname"
                    id="input-last-name"
                    v-model="form.lastname"
                    type="text"
                    placeholder="Apellidos"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-email"
                label='Correo Electrónico'
                label-for="input-email"
                :invalid-feedback="emailFeedback"
            >
                <b-form-input :class="email"
                    id="input-email"
                    v-model="form.email"
                    type="email"
                    placeholder="ejemplo@ejemplo.com"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-opassword"
                label='Contraseña'
                label-for="input-opassword"
                :invalid-feedback="opasswordFeedback"
            >
                <b-form-input :class="opassword"
                    id="input-opassword"
                    v-model="form.opassword"
                    type="password"
                    placeholder="Contraseña actual"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-password"
                label='Contraseña'
                label-for="input-password"
                :invalid-feedback="passwordFeedback"
            >
                <b-form-input :class="password"
                    id="input-password"
                    v-model="form.password"
                    type="password"
                    placeholder="Nueva contraseña"
                    required
                />
            </b-form-group>

            <b-form-group
                id="input-group-rpassword"
                label='Repite la contraseña'
                label-for="input-rpassword"
                :invalid-feedback="rpasswordFeedback"
            >
                <b-form-input :class="rpassword"
                    id="input-rpassword"
                    v-model="form.rpassword"
                    type="password"
                    placeholder="Repite nueva contraseña"
                    required
                />
            </b-form-group>
            <b-button type="submit" variant="primary">Guardar</b-button>
        </b-form>
    </div>
</template>

<script>
export default {
    name: 'UserProfileForm',
    data() {
        return {
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
        })
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
        }
    }
}
</script>
