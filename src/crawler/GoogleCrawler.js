import Seneca from 'seneca';
import webdriver from 'selenium-webdriver';

const seneca = Seneca();

class GoogleCrawler {
    start() {
        console.log('start')

        seneca
            .listen({
                port: '8280',
                pin: 'request:scrap'
            })
            .add({
                request: 'scrap',
                google: 'search',
            }, this.onRequestGoogleScrap.bind(this));

    }

    onRequestGoogleScrap(msg, done) {
        console.log('onRequestGoogleScrap');
        const search = msg.search;
        const html = this.getSearchHtml(search);

        this.requestGooglePaginationScrap(html);
        this.requestGoogleResultsScrap(html);

        done(null, { search, html });
    }

    getSearchHtml(search) {
        console.log('getSearchHtml');
        const By = webdriver.By;
        let until = webdriver.until;
        let driver = new webdriver
            .Builder()
            .forBrowser('firefox')
            .build();

        driver.get('http://www.google.com/ncr');
        driver.findElement(By.name('q')).sendKeys(search);
        driver.findElement(By.name('btnG')).click();
        driver.wait(until.titleContains(search), 1000);

        const html = driver.getAttribute('innerHTML');
        driver.quit();

        return html;
    }

    requestGooglePaginationScrap(html) {
        console.log('requestGooglePaginationScrap');

        seneca
            .client({
                port: '8290',
                pin: 'request:pages,google:parse'
            }).act({
                request: 'parse',
                google: 'pages',
                html
            }, this.onScrapUrlsReady.bind(this));
    }

    requestGoogleResultsScrap(html) {
        console.log('requestGooglePaginationScrap');
        
                seneca
                    .client({
                        port: '8295',
                        pin: 'request:pages,google:pages'
                    }).act({
                        request: 'pages',
                        google: 'pages',
                        html
                    }, this.onScrapUrlsReady.bind(this));
    }

    onScrapUrlsReady(err, data) {
        console.log('onScrapUrlsReady', { data });
    }
}

export default MediumDataObtainer;