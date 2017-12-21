import {
    fork
} from 'child_process';
import SenecaServiceInterface from '../interface/SenecaServiceInterface'
const googleSearchService = fork('./bin/service/google-search.js');

class MediumTopicService {
    start() {
        console.log('MediumTopicService:start');
        this.prepareGoogleSearchService(googleSearchService);
    }

    prepareGoogleSearchService(googleSearchService) {
        console.log('MediumTopicService:prepareGoogleSearchService');
        googleSearchService.send('start');
        googleSearchService.on('message', this.onGoogleSearchServiceReady.bind(this));
    }

    onGoogleSearchServiceReady({
        state
    }) {
        console.log('MediumTopicService:onGoogleSearchServiceReady');
        if (state === 'ready') {
            this.prepareServiceInterface(SenecaServiceInterface);
            this.communicateStateReady();
        }
    }
    prepareServiceInterface(serviceInterface) {
        console.log('MediumTopicService:prepareServiceInterface');
        this.service = (new SenecaServiceInterface()).create({
            port: '8260'
        });

        this.service.add('request:topic,topic:*', this.onRequestTopicData.bind(this));
    }
    communicateStateReady() {
        console.log('MediumTopicService:communicateStateReady');
        if (process.send) {
            process.send({
                state: 'ready'
            });
        } else {
            console.log('ERROR', process.send)
        }
    }

    onRequestTopicData(msg, done) {
        console.log('MediumTopicService:onRequestTopicData');
        const topic = msg.topic;

        this.requestData(topic);

        done(null, topicData);
    }

    requestData(topic) {
        console.log('MediumTopicService:requestData');
        const search = 'site:https://medium.com ' + topic;

        this.requestDataToGoogleService(search);
    }

    requestDataToGoogleService(search) {
        console.log('MediumTopicService:requestDataToGoogleService');
        this.service
            .client({
                port: '8270',
                pin: 'request:data,google:search'
            })
            .act({
                request: 'data',
                google: 'search',
                search
            }, this.onDataReadyEmitTopic.bind(this));
    }

    onDataReadyEmitTopic(msg) {
        console.log('MediumTopicService:onDataReadyEmitTopic');
        const searchData = msg.searchData;

        this.service
            .client({
                port: '8270',
                pin: 'emit:data,medium:topic'
            })
            .act({
                emit: 'data',
                medium: 'topic',
                searchData
            });
    }
}

const service = new MediumTopicService();

service.start();