<template>
    <div class="edit-tables">
        <form class="edit-table" id="informations-form" @submit.prevent="saveTable()">
            <div class="form-group">
                <label for="id">Número da mesa</label>
                <input type="number" name="id" id="id" v-model="table.id" required>
            </div>
            <div class="form-group">
                <label for="descricao">Categoria</label>
                <input type="text" name="descricao" id="descricao" v-model="table.descricao">
            </div>
            <div class="form-group">
                <label for="">QR Code</label>
                <div class="qr-code-container">
                    <qrcode
                        id="qr-code"
                        :text="table.qrcode"
                        :size="152"
                        :class="table.id == null ? 'blur-image' : ''"
                    />
                    <button v-if="table.id != null" type="button" class="btn btn-primary" v-on:click="printOutTableQRCode()">Imprimir</button>
                    <h3 v-else>Faça a inclusão da mesa para ver o QR Code</h3>
                </div>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
    </div>
</template>
<script>
import Qrcode from 'vue-qrcode-component';
import $ from 'jquery';

export default {
    name: "editTablesModalContent",
    props: ["tableid"],
    data() {
        return {
            table: {
                id: null,
                descricao: "",
                qrcode: "https://rabsystems.com.br?utm_source=gourmetech_table_qr_code"
            }
        }
    },
    watch: {
        "table.qrcode": function () {
            console.log(this.table.qrcode)
        }
    },
    methods: {
        printOutTableQRCode: function () {
            let qrCodeBase64 = $("#qr-code img").attr("src");
            this.$router.push("/home/printout?image=" + encodeURIComponent(qrCodeBase64));
        }
    },
    mounted: function () {
        
    },
    components: {
        Qrcode
    }
}
</script>
<style scoped>
.qr-code-container {
    display: flex;
    align-items: center;
}

#qr-code {
    margin-right: var(--space-6);
    padding: var(--space-4);
    border: 3px dashed var(--blue);
    border-radius: var(--radius-md);
}

@media (max-width: 425px) {
    .qr-code-container {
        flex-direction: column;
        margin: var(--space-6) 0;
    }

    #qr-code {
        margin-right: 0;
        margin-bottom: var(--space-6);
    }
}
</style>