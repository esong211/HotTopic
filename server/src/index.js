
const io = require('socket.io')();

const myPythonScriptPath = 'script.py';

// Use python shell
const PythonShell = require('python-shell');


io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
    client.on('message', (event) => {
        console.log('running app');
        const options = {
            pythonPath: 'python3',
            args: event,
        };
        const pyshell = new PythonShell(myPythonScriptPath, options);

        pyshell.on('message', (message) => {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
            client.emit('response', { 'tweet': JSON.parse(message), 'coord': event });
        });

// end the input stream and allow the process to exit
        pyshell.end((err) => {
            if (err) {
                throw err;
            }

            console.log('finished');
        });
        console.log(event);
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
