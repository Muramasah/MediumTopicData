/**
 * 
 */
import SenecaServiceInterface from '../interface/SenecaServiceInterface';

class GoogleSearchService {
    start() {
        console.log('GoogleSearchService:start');
        this.prepareServiceInterface(SenecaServiceInterface);
        this.communicateStateReady();
    }

    prepareServiceInterface(serviceInterface) {
        this.service = (new SenecaServiceInterface()).create({
            port: '8271',
            pin: 'request:data,google:search'
        });

        this.service.add({
            request: 'data',
            google: 'search',
        }, this.onRequestSearchData.bind(this));
    }

    communicateStateReady() {
        process.send({
            state: 'ready'
        });
    }

    onRequestSearchData(msg, done) {
        const search = msg.search;

        //this.requestData(search);

        done(null, {
            search,
            results: {
                total: 290000,
                pages: 15,
                results: [{
                        title: 'Javascript – Medium',
                        link: 'https://medium.com/topic/javascript',
                        date: '16/11/2017',
                        abstract: "As we build sites more heavily reliant on JavaScript, we sometimes pay for what we send down in ways that we can't always easily see. In…"
                    },
                    {
                        title: 'The most insightful stories about JavaScript – Medium',
                        link: 'https://medium.com/tag/javascript',
                        date: false,
                        abstract: "Read stories about JavaScript on Medium. Discover smart, unique perspectives on JavaScript and the topics that matter most to you like web development, react ..."
                    }
                ]
            }
        });
    }

    requestData(search) {
        this.scrapedData = false;

        this.service
            .client({
                port: '8280',
                pin: 'request:scrap'
            })
            .act({
                request: 'scrap',
                google: 'search',
                search
            }, this.onScrapReady.bind(this))
    }

    onScrapReady(scrapedData) {
        console.log('onScrapReady', {
            scrapedData
        });

        this.scrapedData = scrapedData;
    }
}

const service = new GoogleSearchService();

service.start();