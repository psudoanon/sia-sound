const express = require('express');
const path    = require('path');

(async () => {

    const app = express();
    
    const PORT = process.env.port || 5000;

    app.use(express.static(path.join(__dirname, 'dist')));

    app.listen(PORT, () => {
        console.log(`music frontend listening on ${PORT}`);
    });

})();
