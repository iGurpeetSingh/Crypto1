const fs = require('fs');
const path = 'c:/Users/GauriSingh/Downloads/Crypto/Crypto/src/pages/portfolio/PortfolioPage.jsx';
let c = fs.readFileSync(path, 'utf8');
const old = c;
fs.writeFileSync(path, old);