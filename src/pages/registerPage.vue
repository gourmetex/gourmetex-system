<template>
    <div class="register-page">
        <img src="https://www.cdc.gov/policy/polaris/tis/assets/tis-img/systems-problems-hero-medium.png" class="company-logo-p">
        <div class="register-container">
            <form @submit.prevent="register()" id="register-form">
                <h2>REGISTRAR</h2>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" required>
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" name="password" id="password" required>
                </div>
                <div class="form-group">
                    <label for="repeat-password">Repita a senha</label>
                    <input type="password" id="repeat-password" required>
                </div>
                <button type="submit" class="btn btn-primary" id="register-button">Registrar</button>
                <div class="complement">
                    <h3>Já possui cadastro? <router-link to="/login"><span>Entre</span></router-link></h3>
                    <h3 class="response">{{ response }}</h3>
                </div>
            </form>
        </div>
        <h3 class="copyright">© {{ year }} Gourmetech - Todos os direitos reservados</h3>
    </div>
</template>
<script>
import { globalMethods } from '@/js/globalMethods';
import $ from 'jquery';

export default {
    name: "registerPage",
    mixins: [globalMethods],
    methods: {
        register: function () {
            let response = $(".response");
            this.resetResponse(response);

            let registerButton = $("#register-button");
            registerButton.attr("disabled", "disabled").addClass("btn-loading");

            let data = $("#register-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            let password = $("#password").val();
            let repeatPassword = $("#repeat-password").val();

            setTimeout(() => {
                if (password == repeatPassword) {
                    console.log(data);
                } else {
                    response.addClass("error");
                    this.response = "As senhas não coencidem";
                }
                registerButton.removeAttr("disabled").removeClass("btn-loading");
            }, 2000)
        }
    }
}
</script>
<style scoped>
.register-page {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100vw;
    height: 100vh;
}

.company-logo-p {
    top: 10vh;
}

.company-logo-p, .copyright {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
}

.copyright {
    bottom: 10vh;
}

form, .register-container {
    display: flex;
    flex-direction: column;
}

form {
    border: 1px solid var(--gray-2);
    padding: var(--space-6);
    border-radius: var(--radius-md);
    box-shadow: var(--boxshadow-default);
    min-width: 200px;
    width: 90vw;
    max-width: 500px;
    min-height: fit-content;
    height: 90vh;
    max-height: 370px;
    justify-content: center;
}

    form h2 {
        margin-bottom: var(--space-3);
        text-align: center;
    }

.complement {
    margin-top: var(--space-3);
    text-align: center;
}

    .complement span {
        cursor: pointer;
        text-decoration: underline;
    }
</style>