import Seneca from 'seneca';

class SenecaServiceInterface {
    create(listenConfig) {
        this.seneca = Seneca({
            //log: 'silent'
        });

        this.listen(listenConfig);

        return this;
    }

    listen(config) {
        return this.seneca.listen(Object.assign({}, config, {
            host: '127.0.0.1'
        }));
    }

    add(pattern, action) {
        return this.seneca.add(pattern, action);
    }

    client(config) {
        return this.seneca.client(config);
    }

    act(message, callback) {
        return this.seneca.act(message, callback);
    }
}

export default SenecaServiceInterface;