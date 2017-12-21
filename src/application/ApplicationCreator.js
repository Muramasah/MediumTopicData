class ApplicationCreator {
    create(userInterface, mainService) {
        this.setUserInterface(userInterface);
        this.setMainService(mainService);

        return this;
    }

    start() {
        this.mainService.send('start');
        this.mainService.on('message', this.startUserInterfaceOnMainServiceReady.bind(this));
    }

    startUserInterfaceOnMainServiceReady(message) {
        if (message.state === 'ready') {
            this.userInterface.send('start');
        }
    }

    setUserInterface(userInterface) {
        this.userInterface = userInterface;
    }

    setMainService(mainService) {
        this.mainService = mainService;
    }
}

const applicationCreator = new ApplicationCreator();

export default applicationCreator;