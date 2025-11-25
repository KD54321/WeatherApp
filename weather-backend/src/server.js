require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`)
})