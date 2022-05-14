const qrcode = require('qrcode');
const createClients = require("../config/client");
const clients = require("../data/clients");

module.exports = (io, socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        // join room
        console.log(`joining room ${data}`);
        socket.join(data);

        // checking client
        const isExist = clients.find(({ id }) => id === data);
        let client = null;
        if (!isExist || isExist === -1) {
            console.log("creating new client");
            io.to(data).emit('response', {
                message: 'creating new client',
                data: false,
            });
            const res = createClients(data);
            const { client: newClient } = res;
            client = newClient;
            clients.push(res);
            client.initialize();
        } else {
            console.log("client alredy exist");
            if (isExist.logined) {
                io.to(data).emit('response', {
                    message: 'logined',
                    data: true,
                });
                return;;
            }
            io.to(data).emit('response', {
                message: 'client alredy exist, wait until new qr generate',
                data: false,
            });
            client = isExist.client;
        }

        // break if client null
        if (!client) {
            return;
        }

        // qr generate
        client.on('qr', (qr) => {
            console.log('QR RECEIVED');
            qrcode.toDataURL(qr, (err, url) => {
                io.to(data).emit('qr', url);
            });
        });

        // handle when logined
        client.on("authenticated", () => {
            const index = clients.findIndex(({ id }) => id === data);
            clients[index] = { ...clients[index], logined: true };
            io.to(data).emit('response', {
                message: 'logined',
                data: true,
            });
            console.log("AUTHENTICATED")
        })

        // handle when loggout
        client.on("disconnected", () => {
            const index = clients.findIndex(({ id }) => id === data);
            clients[index] = { ...clients[index], logined: false };
            console.log("DISCONNECTED")
        })
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
}