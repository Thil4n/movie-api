const smsConfig = require("../config/sms");
const Axios = require("axios");

const send = async (phoneNumber, txtBody) => {
    return new Promise((resolve, reject) => {
        const url = `https://send.lk/sms/send.php?token=${smsConfig.token}&to=${phoneNumber}&from=${smsConfig.sender}&message=${txtBody}`;

        console.log(url);
        Axios.get(url)
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    return resolve(response.data);
                }
            })

            .catch((e) => {
                return reject(e.response);
            });
    });
};

module.exports = {
    send,
};
