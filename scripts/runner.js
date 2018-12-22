const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', (message) => {
        const type = message.type();
        if(type in console) {
            console[type](message.text());
        } else {
            console.dir(message);
        }
    });

    await page.goto(`file://${process.cwd()}/scripts/index.html`);
    await browser.close();
})();
