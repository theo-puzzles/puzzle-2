// Maybe it's a Vigenère cipher with key from hint or video

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

function vigenereDecode(str, key) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            const keyChar = key[(i) % key.length].charCodeAt(0);
            const shift = (keyChar >= 65 && keyChar <= 90) ? keyChar - 65 : (keyChar >= 97 && keyChar <= 122) ? keyChar - 97 : 0;
            result += String.fromCharCode(((c - 65 - shift + 26) % 26) + 65);
        } else if (c >= 97 && c <= 122) {
            const keyChar = key[(i) % key.length].charCodeAt(0);
            const shift = (keyChar >= 65 && keyChar <= 90) ? keyChar - 65 : (keyChar >= 97 && keyChar <= 122) ? keyChar - 97 : 0;
            result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
        } else {
            result += str[i];
        }
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Try keys from hint and video
const keys = ["drum", "break", "drum break", "skate", "iphone", "ultra", "ultra wide", "wide", "camera", "video", 
             "apple", "where it all began", "began", "N_0mpxB5iVQ", "0mpxB5iVQ"];

console.log("=== Vigenere on ROT47 result ===");
const decoded = rot47(line1);
for (const key of keys) {
    const result = vigenereDecode(decoded, key);
    if (result.toLowerCase().includes("the ") || result.toLowerCase().includes("https") || result.includes("http") || result.toLowerCase().includes("puzzle")) {
        console.log(`Key "${key}":`, result.substring(0, 70));
    }
}

// Let's also check if maybe it's just a simple substitution based on some key
// Notice: /r/ at start might be reddit
console.log("\n=== Check for /r/ pattern ===");
// The encoded starts with /rRo - maybe /r/ is a prefix
// Let's check if the decoded text has /r/ in it
const decodedNoRot = line1; // don't rotate yet
console.log("Original contains:", decodedNoRot.includes("/r/"));

// Let me try different approach - decoding as URL-safe base64 with variations
console.log("\n=== Try different base64 interpretations ===");
// Try standard base64 decode
const b64decoded = Buffer.from(line1, 'base64');
console.log("Base64 bytes:", Array.from(b64decoded).slice(0, 20));

// Maybe it needs to be XORed with something after base64 decode
const b64bytes = Array.from(b64decoded);
console.log("\n=== XOR each byte with key ===");
const keys2 = ["drum", "break", "skate", "apple", "ultra"];
for (const key of keys2) {
    let result = "";
    const keyBytes = key.split('').map(c => c.charCodeAt(0));
    for (let i = 0; i < b64bytes.length; i++) {
        result += String.fromCharCode(b64bytes[i] ^ keyBytes[i % keyBytes.length]);
    }
    // Check readable
    if (result.includes("the") || result.includes("http") || /[a-z]{4,}/i.test(result)) {
        console.log(`XOR key "${key}":`, result.substring(0, 60));
    }
}