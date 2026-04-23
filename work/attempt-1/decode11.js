// Let me try different cipher library approaches

function rot47(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 33 && charCode <= 126) {
            let decoded = ((charCode - 33 + 47) % (126 - 33 + 1)) + 33;
            result += String.fromCharCode(decoded);
        } else {
            result += str[i];
        }
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

// Base64 to bytes
const data = Buffer.from(line1, 'base64');
console.log("=== Data as hex ===");
console.log(data.toString('hex').substring(0, 60));

console.log("\n=== Try treating as ROT47 then base64 then hex ===");
const rot47decoded = rot47(line1);
console.log("ROT47:", rot47decoded.substring(0, 60));

console.log("\n=== Reverse string first, then ROT47 ===");
const reversed = line1.split('').reverse().join('');
console.log("Reverse ROT47:", rot47(reversed));

console.log("\n=== Char codes analysis ===");
console.log("First chars:", line1.substring(0, 10).split('').map(c => c.charCodeAt(0)));

// The pattern /r at start - could this be a URL?
// Like /r/??? but it's not valid base64 for URL

console.log("\n=== Try base64 to hex then ROT47 ===");
const dataHex = data.toString('hex');
const rot47OnHex = rot47(dataHex);
console.log("Hex with ROT47:", rot47OnHex.substring(0, 60));

// Try treating original as hex representation and decode from hex
console.log("\n=== Try treating as hex pairs instead of base64 ===");
// Check if original string can be interpreted as hex
let isHex = true;
for (const c of line1) {
    if (!"0123456789abcdefABCDEF".includes(c) && c !== '=') {
        isHex = false;
        break;
    }
}
console.log("Could be hex?", isHex);

// If we interpret the base64 as some other encoding...
// What's the raw byte pattern?
const rawBytes = Array.from(data);
console.log("\n=== Looking at byte pattern ===");
console.log("First 20 bytes:", rawBytes.slice(0, 20));

// Notice the first byte - 254. Could that be a flag?
// Let me see what different encodings produce
console.log("\n=== Check what encoding produces readable text ===");
// If we negate all bytes
const negated = rawBytes.map(b => 255 - b);
console.log("Negated:", String.fromCharCode(...negated));

// Try subtract 1 from each byte
const minus1 = rawBytes.map(b => b - 1);
console.log("Minus 1:", String.fromCharCode(...minus1.filter(b => b > 0)));

// Try each possible XOR key (0-127)
console.log("\n=== XOR brute force ===");
for (let key = 0; key < 100; key++) {
    let result = "";
    for (const b of rawBytes) {
        result += String.fromCharCode(b ^ key);
    }
    const words = result.toLowerCase().split(' ');
    const hasWord = words.some(w => w === 'the' || w === 'and' || w === 'puzzle' || w === 'answer' || w === 'hint');
    if (hasWord) {
        console.log(`XOR ${key}:`, result.substring(0, 60));
        break;
    }
}