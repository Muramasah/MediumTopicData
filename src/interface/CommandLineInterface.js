import vorpal from 'vorpal';

class CommandLineInterface {
    commandBuild(command, alias, description, action) {
        console.log('CommandLineInterface:commandBuild');
        const cli = vorpal();

        cli
            .command(command)
            .alias(alias)
            .description(description)
            .action(args => {
                console.log({
                    args
                });

                action(args);
            });

        cli
            .delimiter('MediumTopicDataObtainer$')
            .show();
    }
}

export default CommandLineInterface;