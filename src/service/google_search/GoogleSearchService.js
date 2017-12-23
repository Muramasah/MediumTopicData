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

    prepareServiceInterface(ServiceInterface) {
        console.log('GoogleSearchService:prepareServiceInterface');
        this.service = new ServiceInterface();

        this.service.create({
            port: '8271'
        });

        this.service.add('role:request,cmd:search', this.onRequestSearchData.bind(this));
    }

    communicateStateReady() {
        console.log('GoogleSearchService:communicateStateReady');
        process.send({
            state: 'ready'
        });
    }

    onRequestSearchData(msg, reply) {
        console.log('GoogleSearchService:onRequestSearchData', {
            msg
        });

        const search = msg.data;

        //this.requestData(search);

        reply(null, {
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
        console.log('GoogleSearchService:requestData');

        this.service.client({
            port: '8280'
        });

        this.service.act({
            role: 'request',
            cmd: 'scrap',
            data: search
        }, this.onScrapReady.bind(this))
    }

    onScrapReady(error, result) {
        console.log('GoogleSearchService:onScrapReady', {
            error,
            result
        });

        this.scrapedData = result;
    }
}

const service = new GoogleSearchService();

service.start();