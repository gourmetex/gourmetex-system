<template>
    <div class="login-page">
        <img src="https://www.cdc.gov/policy/polaris/tis/assets/tis-img/systems-problems-hero-medium.png" class="company-logo-p">
        <div class="login-container">
            <form @submit.prevent="login()" id="login-form">
                <h2>LOGIN</h2>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" required>
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" name="password" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary" id="login-button">Entrar</button>
                <div class="complement">
                    <h3>Não tem cadastro? <router-link to="/register"><span>Registre-se</span></router-link></h3>
                </div>
                <h3 class="response">{{ response }}</h3>
            </form>
        </div>
        <h3 class="copyright">© {{ year }} Gourmetech - Todos os direitos reservados</h3>
    </div>
</template>
<script>
import { globalMethods } from '@/js/globalMethods';
import $ from 'jquery';

export default {
    name: "loginPage",
    mixins: [globalMethods],
    methods: {
        login: function () {
            let response = $(".response");
            this.resetResponse(response);

            let loginButton = $("#login-button");
            loginButton.attr("disabled", "disabled").addClass("btn-loading");

            let data = $("#login-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            setTimeout(() => {
                console.log(data)
                loginButton.removeAttr("disabled").removeClass("btn-loading");
            }, 2000)

            console.log(data)
        }
    }
}
</script>
<style scoped>
.login-page {
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

form, .login-container {
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
}

    .complement span {
        cursor: pointer;
        text-decoration: underline;
    }
</style>