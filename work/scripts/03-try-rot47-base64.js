function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Try ROT47 on the base64 string first
const rot47Line1 = rot47(line1);
console.log("Original line 1:", line1);
console.log("ROT47 of line 1:", rot47Line1);

// Try to base64 decode the ROT47 result
try {
    const decoded = Buffer.from(rot47Line1, 'base64');
    console.log("Decoded after ROT47+base64:", decoded.toString('utf8'));
    console.log("As hex:", decoded.toString('hex'));
} catch(e) {
    console.log("Error decoding:", e.message);
}
