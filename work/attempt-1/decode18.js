// Let me look at this more systematically - maybe there's a simple transformation I'm missing

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

// What if the entire string is some kind of URL encoding, or a custom encoding?
// Let's test if maybe it's "URL-safe" base64 with - and _ instead of + and /
console.log("=== Try URL-safe base64 ===");
// Replace standard base64 chars with URL-safe
const urlSafe = line1.replace(/\+/g, '-').replace(/\//g, '_');
console.log("URL-safe:", Buffer.from(urlSafe, 'base64').toString());

// Try different approach - maybe it's hexdump of something
console.log("\n=== Try hex decoding ===");
const hexToStr = (hex) => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
};
const ashex = Buffer.from(line1, 'base64').toString('hex');
console.log("Hex:", ashex);
console.log("Hex decode:", hexToStr(ashex.substring(0, 40)));

// What about treating the bytes as offset and converting to string
console.log("\n=== Try offset 47 on bytes instead of charcode ===");
const bytes = Array.from(Buffer.from(line1, 'base64'));
const offset47 = bytes.map(b => ((b + 47) % 128));
console.log("Offset 47:", String.fromCharCode(...offset47));

// Try reading the bytes as ASCII codes directly (might be like 2-digit decimal pairs)
console.log("\n=== Interpret as decimal pairs ===");
const decimalPairs = bytes.map(b => b.toString().padStart(2, '0')).join('');
console.log("As pairs:", decimalPairs.substring(0, 60));

// Actually, 99 chars - maybe it's 97 chars message + 2 padding chars?
// But we need a key, could the key come from somewhere like video?

// Video title is "iPhone 11 UltraWide Skate Footage Demo" 
// Could be 'ultra-wide', 'ultra wide', 'ultrawide'
// Let me try 'ultrawide' as key
console.log("\n=== Try ultrawide as decryption key ===");
const key = "ultrawide";
const data = Buffer.from(line1, 'base64');
let result = "";
for (let i = 0; i < data.length; i++) {
    const byte = data[i] ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(byte);
}
console.log("XOR ultrawide:", result.substring(0, 60));