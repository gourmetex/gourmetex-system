const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://viacep.com.br',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: false // Adicione isso se estiver enfrentando problemas de certificado SSL
      }
    }
  }
})
