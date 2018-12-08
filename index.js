const config = require('config');
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
//const md5 = require('md5');
const payment = require('./payment');
const server = require('./server');
server();



let templates = [];
let settings ={};
let regexpKeyboard = /\/buttons/gim;
let formApi_id;
let count = 0;
let requestId;
// let merchand_id = '108839'
// let secretCode = 'vi1y0qwa'
// let s = md5(merchand_id+secretCode);
// let  freeKassaReuest = `http://www.free-kassa.ru/api.php?merchant_id=${merchand_id}&s=${s}&action=get_balance`

const sendTemplate = function(template, id){


    let postQuery = `https://${settings.host}`

    const requestSms = (id)=>{
        request.post(postQuery, {
            form: formApi_id
        }, function (err, httpResponse, body) {
            if (err) {
                console.error('Error !!!!!!:', err);
                return;
            }
            let res = JSON.parse(body);
            let responce;
            console.log('res', res)
            if (res.sms) {
                for (let phoneinsms in res.sms) {
                    responce = (res.sms[phoneinsms].status_code == 100) ? 'Сообщение на номер ' + phoneinsms + ' успешно отправлено. Ваш баланс: ' + res.balance :
                        'ERROR: ' + res.sms[phoneinsms].status_text + '. Ваш баланс: ' + res.balance
                }
            }
            else {
                responce = res.status +':' +res.status_text
            }
            bot.sendMessage(id, responce);
            phonenumber = null;
            formApi_id.to = null;
        })
    }
    const checkPhoneNumber = (id, msg)=> {
        if (msg.match(regexp)) {
            console.log('msg', msg);
            formApi_id.to = msg.replace(/[\D]/g, '');
            formApi_id.to = (formApi_id.to.length == 10) ? '+7' + msg : '+7' + msg.slice(1)
            requestSms(id);


        }
        else {
            bot.sendMessage(id, 'Не удалось определить номер телефона в данном сообщении, введите номер телефона в формате 89663760909', {
                reply_markup: {
                    force_reply: true
                }
            }).then(gotTelephone => {
                bot.onReplyToMessage(gotTelephone.chat.id, gotTelephone.message_id, txt => {
                   return checkPhoneNumber( gotTelephone.chat.id, txt.text)
                })
            })
        }
    }
if (!formApi_id.to) {
    phonenumber = true;
    bot.sendMessage(id, `Введите номер телефона для отправки сообщения`, {
        reply_markup: {
            force_reply: true
        }
    })
        .then(gotTelephone=>{
            bot.onReplyToMessage(gotTelephone.chat.id, gotTelephone.message_id,  msg => {
                checkPhoneNumber(gotTelephone.chat.id, msg.text);
            })
        })
}
else {
    requestSms(id);
}
}

const TOKEN = config.get('token');

const bot = new TelegramBot (TOKEN, {
    polling: true
});

const COMMAND_PAYMENT_TEMPLATE1 = 'paymentTemplate1';
const COMMAND_PAYMENT_TEMPLATE2 = 'paymentTemplate2';



const sendRequest = (id)=>{
    let options = {
        pattern_id: 'p2p',
        instance_id: config.instanceId,
        to: '410014565623814',
        amount: 5,
        message: 'Бизнес молодость',
        merchantArticleId: 123,
        label: 'Бизнес молодость'

    };
    payment.externalPayment.request(options, function requestComplete(err, data) {
        if (err) {
            // process error
        }
        requestId = data.request_id;
        console.log('data', data);
        payment.externalPayment.process({
            "request_id": requestId,
            ext_auth_success_uri: 'https://t.me/kursy_nahalyvu_bot',
            ext_auth_fail_uri: 'https://t.me/kursy_nahalyvu_bot'

        }, function (err, data) {
            if (err) {
                // process error
            }
            // process data
            console.log('dataProcess', data);

            let payment_keyboard = [
                [
                    {
                        text: `оплатить`,
                        callback_data: COMMAND_PAYMENT_TEMPLATE1,
                        url: `https://m.money.yandex.ru/internal/public-api/to-payment-type?cps_context_id=${requestId}&paymentType=FC`
                    }
                ],
                [
                    {
                        text: `Назад`,
                        callback_data: COMMAND_PAYMENT_TEMPLATE2
                    }
                ]
            ];


            bot.sendMessage(id, 'Наименование: 39 курсов Бизнес Молодости 2018 год. \n' +
                'Описание: МЗС Storage 3 курса, Инструментариум,Основные курсы (20 курсов), Блогер быстрый старт, Реальный YouTube, Упаковка бизнеса, БМ институт (9 курсов), Инстаграм 2.0,Продажи как система, Яндекс Директ 2.0, Простые Финансы, Школа интернет-маркетологов, Воронка продаж, Реальный Авито, Блогер быстрый старт, Реальный YouTube, Упаковка бизнеса. \n' +
                'Стоимость: 990 RUB ',{
                reply_markup:{
                    inline_keyboard: payment_keyboard
                }
            });
        });
    })

}

const COMMAND_TEMPLATE1 = 'template1';
const COMMAND_TEMPLATE2 = 'template2';
const COMMAND_TEMPLATE3 = 'template3';
const COMMAND_TEMPLATE4 = 'template4';
const COMMAND_TEMPLATE5 = 'template5';

let inline_keyboard = [
    [
         {
            text: `Бизнес молодость`,
            callback_data: COMMAND_TEMPLATE1
        }

    ],[
        {
            text: 'Курсы Instagram',
            callback_data: COMMAND_TEMPLATE2
        }

    ],[
        {
            text: 'Аяз Шабутдинов',
            callback_data: COMMAND_TEMPLATE3
        }
    ],[
        {
            text: 'Радислав Гандапас',
            callback_data: COMMAND_TEMPLATE4
        }
    ],[
        {
            text: 'Трафик, таргетинг',
            callback_data: COMMAND_TEMPLATE5
        }
    ]
];

// bot.onText(/\/start/,  (msg, [source, match])=> {
//     const {chat: {id}} = msg;
//                 bot.sendMessage(id, `Введите настройки для sms провайдера. api-id:`, {
//                     reply_markup: {
//                         force_reply: true
//                     }
//                 }).then(addApiId => {
//                     bot.onReplyToMessage(addApiId.chat.id, addApiId.message_id, msg => {
//                         settings.api_id = msg.text;
//                         bot.sendMessage(addApiId.chat.id, 'Выберете шаблон',{
//                             reply_markup:{
//                                 inline_keyboard
//                             }
//                         })
//                     })
//                 })
// });



// bot.onText(regexp, (msg, [source, match]) =>{
//     if (!phonenumber){
//         const {chat: {id}} = msg;
//         phonenumber = match;
//         phonenumber = phonenumber.replace(/[\D]/g,'');
//         phonenumber = (phonenumber.length == 10)? '+7' + phonenumber: '+7' + phonenumber.slice(1)
//
//         bot.sendMessage(id, 'Выберете шаблон для отправки на номер:'+ phonenumber,{
//             reply_markup:{
//                 inline_keyboard
//             }
//         })
//
//     }
// })


bot.onText(/\/settings/, (msg, [source, match]) =>{
    const {chat: {id}} = msg;
    let settingsMessage = (Object.keys(settings).length == 0) ? 'No settings. Please set settings by a /start command': settings;

    bot.sendMessage(id, 'Настройки sms api: '+ JSON.stringify(settingsMessage), {
    })
});

bot.onText(/\/start/,(msg, [source, match])=>{
    const {chat: {id}} = msg;
    bot.sendMessage(id, 'Выберите шаблон',{
        reply_markup:{
            inline_keyboard: inline_keyboard
        }
    })
});

bot.on('callback_query',  query=>{
    const {message: {chat, message_id, text}= {}} = query
    switch (query.data) {
        case COMMAND_TEMPLATE1:
        sendRequest(chat.id);
        break
        case COMMAND_TEMPLATE2:
            templates[1] ? sendTemplate(templates[1], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №2');
            break
        case COMMAND_TEMPLATE3:
            templates[2] ? sendTemplate(templates[2], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №3');
            break
        case COMMAND_TEMPLATE4:
            templates[3] ? sendTemplate(templates[3], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №4');
            break
        case COMMAND_TEMPLATE5:
            templates[4] ? sendTemplate(templates[4],chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №5');
            break
        case COMMAND_PAYMENT_TEMPLATE1:


            break
        default:
    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
});


