import {
    fork
} from 'child_process';
import applicationCreator from './ApplicationCreator';

const mediumTopicService = fork('bin/service/medium-topic.js');
const cliService = fork('bin/interface/cli.js');
const cliMediumTopicApp = applicationCreator.create(cliService, mediumTopicService);

cliMediumTopicApp.start();