import {
    fork
} from 'child_process';
import SenecaServiceInterface from '../interface/SenecaServiceInterface'
const googleSearchSubProcess = fork('./bin/service/google-search.js');

class MediumTopicService {
    start() {
        console.log('MediumTopicService:start');
        this.prepareGoogleSearchSubProcess(googleSearchSubProcess);
    }

    prepareGoogleSearchSubProcess(googleSearchSubProcess) {
        console.log('MediumTopicService:prepareGoogleSearchSubProcess');
        googleSearchSubProcess.send('start');
        googleSearchSubProcess.on('message', this.onGoogleSearchServiceReady.bind(this));
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
    prepareServiceInterface(ServiceInterface) {
        console.log('MediumTopicService:prepareServiceInterface');

        this.service = new ServiceInterface();

        this.service.create({
            port: '8260'
        });

        this.service.add('role:request,cmd:topic', this.onRequestTopicData.bind(this));
    }
    communicateStateReady() {
        console.log('MediumTopicService:communicateStateReady');
        if (process.send) {
            process.send({
                state: 'ready'
            });
        } else {
            console.error('ERROR', process.send)
        }
    }

    onRequestTopicData(msg, reply) {
        console.log('MediumTopicService:onRequestTopicData');
        const topic = msg.data;

        this.requestData(topic);

        reply(null, {
            topic
        });
    }

    requestData(topic) {
        console.log('MediumTopicService:requestData');
        const search = 'site:https://medium.com ' + topic;

        this.requestDataToGoogleService(search);
    }

    requestDataToGoogleService(search) {
        console.log('MediumTopicService:requestDataToGoogleService', {
            search
        });

        this.service.client({
            host: '127.0.0.1',
            port: '8271'
        });

        this.service.act({
            role: 'request',
            cmd: 'search',
            data: search
        }, this.onDataReadyEmitTopic.bind(this));
    }

    onDataReadyEmitTopic(error, result) {
        console.log('MediumTopicService:onDataReadyEmitTopic', {
            error,
            result
        });

        if (error) {
            return console.error(error);
        }

        const searchData = result;

        this.service.client({
            host: '127.0.0.1',
            port: '8250'
        });

        this.service.act({
            role: 'emit',
            cmd: 'topic',
            data: searchData
        }, this.onMediumTopicEmited.bind(this));
    }

    onMediumTopicEmited(error, result) {
        console.log('MediumTopicService:onMediumTopicEmited', {
            error,
            result
        });

        if (error) {
            return console.error({
                error
            });
        }

        const topicData = result.topicData;

        console.log('Your final data is: ', {
            topicData
        });
    }
}

const service = new MediumTopicService();

service.start();