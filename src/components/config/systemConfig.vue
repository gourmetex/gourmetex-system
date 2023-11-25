<template>
    <div class="system-config">
        <div class="config-section">
            <label>Logomarca</label>
            <div class="image-container">
                <form @submit.prevent="uploadPhoto(formData)" method="post" enctype="multipart/form-data"></form>
                <img src="https://rabsystems-storage.s3.sa-east-1.amazonaws.com/mokaly-thumb.png">
                <input type="file" name="photo" id="photo" @change.prevent="preSendPhoto($event)" title="Envie uma foto nos formatos PNG ou JPG">
                <button type="submit" class="btn btn-primary" v-on:click="clickInInputFile()">Alterar</button>
            </div>
            <div class="response error">{{ response }}</div>
        </div>
    </div>
</template>
<script>
import { globalMethods } from '@/js/globalMethods';
import api from "../../configs/api.js";
import $ from 'jquery';

export default {
    name: "systemConfig",
    mixins: [globalMethods],
    data() {
        return {
            
        }
    },
    methods: {
        preSendPhoto: function (event) {
            let self = this;
            let file = event.target.files.item(0);

            self.formData = new FormData;
            self.resetResponse();

            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") { // Se o arquivo tiver um desses formatos (PNG, JPG E JPEG), a imagem é exibida no modal e é permitida a requisição para o servidor, se não aparece a mensagem (arquivo não suportado).
                let adress = new FileReader();

                self.formData.set("company_image", file);
                adress.readAsDataURL(file);
            } else {
                self.setResponse("Tipo de arquivo não suportado", "error");
            }
        },
        uploadPhoto: function (formData) {
            let self = this;

            self.resetResponse();

            api.patch("/companies/change_photo", formData)
            .then(function () { 
                location.reload();
            })
            .catch(function (error) {
                self.setResponse(error.response, "error");
            })
        },
        clickInInputFile: function () {
            $("#photo").click();
        }
    }
}
</script>
<style scoped>

.system-config {
    width: 100%;
    height: 100%;
}

input[type="file"] {
    display: none;
}

.image-container {
    margin: var(--space-2);
    display: flex;
    align-items: center;
}

    .image-container img {
        margin-right: var(--space-6);
        width: 200px;
        height: 200px;
        object-fit: contain;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        border: 1px dashed var(--blue);
        padding: var(--space-3);
    }
</style>