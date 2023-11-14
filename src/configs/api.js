import axios from 'axios'

let url_api;

const dev_environment = "http://192.168.15.43:3000/"; //Ambiente de desenvolvimento.
const publish_environment = "http://coreteste.gourmetech.com.br/"; //Ambiente de teste ou produção.
// TROCA DO AMBIENTE DA API
//
// O parâmetro que deverá ser informado será 0 ou 1, sendo que:
// 0 - Ambiente de teste
// 1 - Ambiente de produção
// 
// ==============================
let test_or_publish = 1;
// ==============================
//


switch (test_or_publish) {
    case 0:
        url_api = dev_environment;
        break;
    case 1: 
        url_api = publish_environment;
        break;
}

const api = axios.create({
    baseURL: url_api
});

export default api;