const yandexMoney = require("yandex-money-sdk");
const request = require('request');
const config = require('config');
const redirectURI = config.redirectURI;
const clientId = config.clientId;

if (!config.instanceId){
    yandexMoney.ExternalPayment.getInstanceId(clientId,
    function getInstanceComplete(err, data) {
        if(err) {
            // process error
        }
        var instanceId = data.instance_id;
        // save it to DB
        console.log('data.instance_id: ', data.instance_id)

    });
}

let externalPayment = new yandexMoney.ExternalPayment(config.instanceId);



module.exports.externalPayment = externalPayment;


// externalPayment.process({"request_id": '333538343838353635365f66383838303936303037666338306563653634373064643235393665353436343837653664363061',
//     instance_id: config.instanceId,
//     ext_auth_success_uri: 'https://t.me/kursy_nahalyvu_bot',
//     ext_auth_fail_uri: 'https://t.me/kursy_nahalyvu_bot'
//
// }, function (err, data) {
//     if(err) {
//         // process error
//     }
//     // process data
//     console.log('dataProcess', data)
// });

//let scope = ['account-info', 'operation-history']
//let url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, redirectURI, scope);
//console.log('url', url);


