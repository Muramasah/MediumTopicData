import SenecaServiceInterface from '../interface/SenecaServiceInterface'
import CommandLineInterface from '../../interface/CommandLineInterface';

class CliService {
  start() {
    console.log('CliService:start');
    this.prepareServiceInterface(SenecaServiceInterface);
    this.prepareCli(CommandLineInterface);
    this.communicateStateReady();
  }

  prepareCli(CommandLineInterface) {
    console.log('CliService:prepareCli');
    this.cli = new CommandLineInterface();

    this.cli.commandBuild('get <topic>', 'g', 'Get data about topic', this.requestTopicData.bind(this));
  }

  prepareServiceInterface(ServiceInterface) {
    console.log('CliService:prepareServiceInterface', {
      ServiceInterface
    })

    this.service = new ServiceInterface();

    this.service.create({
      port: '8250'
    });

    this.service.add('role:emit,cmd:topic', this.onTopicDataReady.bind(this));
  }

  communicateStateReady() {
    console.log('CliService:communicateStateReady');

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

    const data = command.topic;

    try {
      this.service.client({
        host: '127.0.0.1',
        port: '8260',
      });

      this.service.act({
        role: 'request',
        cmd: 'topic',
        data
      }, console.log);

    } catch (error) {
      console.log('Hey! Be patient, we are building this shit', {
        error
      });
      process.exit(1);
    }

  }

  onTopicDataReady(msg, reply) {
    console.log('CliService:onTopicDataReady', {
      msg
    });

    const topicData = msg.data;

    reply(null, {
      topicData
    });
  }
}

const cliService = new CliService();

cliService.start();