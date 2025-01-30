const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
transpileDependencies: true,
publicPath: process.env.NODE_ENV
//publicPath: process.env.BASE_URL
})

module.exports = {
   
    publicPath:''
    //publicPath: process.env.NODE_ENV === 'production' ? '/localhost:8080/' : '/',

    
}

