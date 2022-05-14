const clients = require("../data/clients");
const { phoneNumberFormatter } = require("../utils/formater");

module.exports = (io, socket) => {
    socket.on("send_message", (data) => {
        console.log(data);
        console.log(clients);
        const isExist = clients.find(({ id }) => id === data.id);
        if (!isExist || isExist === -1) {
            io.to(data.id).emit('response', {
                message: 'loggin first',
                data: false,
            });
            return;
        }
        const index = clients.findIndex(({ id }) => id === data.id);
        const client = clients[index].client;
        const {
            number = '', message = '',
        } = data;
        client.sendMessage(phoneNumberFormatter(number), message)
            .then(() => {
                io.to(data.id).emit('response', {
                    message: 'send message success',
                    data: true,
                });
            })
            .catch(() => {
                io.to(data.id).emit('response', {
                    message: 'send message failed',
                    data: false,
                });
            })
    });
}