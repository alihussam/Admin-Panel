const http=require('http');
const app=require('./app');
const server = http.createServer(app);
server.listen(5000 , () => {
    console.log(`server is up and running on port: ${5000}`);
});