const fs = require('fs');
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

    const { passed, failed, coverage } = await page.evaluate(async () => {
        const result = await Typtap.Default.run();
        if(typeof __coverage__ !== 'undefined') {
            result.coverage = JSON.stringify(__coverage__);
        }
        return result;
    });

    if(coverage) {
        fs.writeFileSync('build/coverage/coverage.json', coverage);
    }

    process.exitCode = failed;

    await browser.close();
})();
