console.log('\n\tAlgorithm LZW\n')

function createDictionary(message, type){
    const symbols = Array.from(new Set(message));
    let count = 1;
    const dict = new Map();
    symbols.forEach(elem => {
        if(type === 'encoding'){
            dict.set(elem, count.toString());
        } else {
            dict.set(count.toString(), elem);
        }
        count++;
    })

    return dict;
}

function formatOutput(sym1, sym2, code, newCode){
    return console.log(`| ${sym1.padEnd(10)} | ${sym2.padEnd(10)} | ${code.padEnd(10)} | ${newCode.padEnd(15)} |`);
}

function encoding(message){
    let encodedMessage = [];
    const dict = createDictionary(message, 'encoding');
    let count = dict.size + 1;

    console.log('\n\t\tEncoding table\n');
    formatOutput('char', 'next char', 'code', 'dictionary');
    console.log(''.padEnd(58, '-'));
    for(let i = 0; i < message.length; i++){
        if(i === message.length - 1){
            encodedMessage.push(dict.get(message[i]));
            formatOutput(message[i], ' - ', dict.get(message[i]), ' - ');
            break;
        }

        const newCharacter = message[i] + message[i + 1];
        if(dict.has(newCharacter)) {
            formatOutput(message[i], message[i + 1], ' - ', ' - ');
            message[i + 1] = newCharacter;
        } else {
            encodedMessage.push(dict.get(message[i]));
            dict.set(newCharacter, count.toString());
            formatOutput(message[i], message[i + 1], dict.get(message[i]), `${newCharacter} = ${count++}`);
        }
    }

    console.log(`\nEncoded message: ${encodedMessage.join(' ')}`);
    return encodedMessage;
}

function decoding(message, encodedMessage){
    let decodedMessage = [];
    const dict = createDictionary(message, 'decoding');
    let count = dict.size + 1;

    console.log('\n\t\tDecoding table\n');
    formatOutput('code', 'next code', 'char', 'dictionary');
    console.log(''.padEnd(58, '-'));
    for(let i = 0; i < encodedMessage.length; i++){
        if(i === encodedMessage.length - 1){
            decodedMessage.push(dict.get(encodedMessage[i]));
            formatOutput(encodedMessage[i], ' - ', dict.get(encodedMessage[i]), ' - ');
            break;
        }

        if(!dict.has(encodedMessage[i + 1])) {
            dict.set(count.toString(), dict.get(encodedMessage[i]) + dict.get('1'));
        }
        const newCharacter = dict.get(encodedMessage[i]) + dict.get(encodedMessage[i + 1])[0];
        dict.set(count.toString(), newCharacter);
        decodedMessage.push(dict.get(encodedMessage[i]));
        formatOutput(encodedMessage[i], encodedMessage[i + 1], dict.get(encodedMessage[i]), `${newCharacter} = ${count++}`);
    }

    console.log(`\nDecoded message: ${decodedMessage.join(' ')}`);
    return decodedMessage;
}

const readLine = require("readline");
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Type message: ", (answer) => {
    const encodedMessage = encoding(answer.split(''));
    const decodedMessage = decoding(answer.split(''), encodedMessage);
    rl.close();
    console.log('\n');
})