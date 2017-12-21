import {
  fork
} from 'child_process';
import SenecaServiceInterface from '../interface/SenecaServiceInterface'
import CommandLineInterface from '../../interface/CommandLineInterface';

class CliService {
  start() {
    this.prepareServiceInterface(SenecaServiceInterface);
    this.prepareCli(CommandLineInterface);
    this.communicateStateReady();
  }

  prepareCli(CommandLineInterface) {
    this.cli = new CommandLineInterface();

    this.cli.commandBuild('get <topic>', 'g', 'Get data about topic', this.requestTopicData.bind(this));
  }

  prepareServiceInterface(ServiceInterface) {
    this.service = new ServiceInterface();
    
    this.service.create({
      port: '8250',
      pin: 'emit:data,medium:topic'
    });

    this.service.add({
      emit: 'data',
      medium: 'topic',
    }, this.onTopicDataReady.bind(this));
  }

  communicateStateReady() {
    if (process.send) {
      process.send({
        state: 'ready'
      });
    }
  }

  requestTopicData(command) {
    console.log('CliService:requestTopicData', {
      command
    });

    const topic = command.topic;

    try {
      this.service.act('request:topic:,topic:' + topic, console.log);
    } catch (error) {
      console.log('Hey! Be patient, we are building this shit', {
        error
      });
      process.exit(1);
    }

  }

  onTopicDataReady(msg) {
    console.log('CliService:onTopicDataReady', {
      command
    });

    const topicData = msg.topicData;

    console.log('Your final data is: ', {
      topicData
    });
  }
}

const cliService = new CliService();

cliService.start();