// Let me try the video frame number approach
// Maybe the video frame provides a key

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
const decoded = rot47(line1);

// Try different cipher - A to Z index shift based on something
// Like A=1, B=2 mapping to decode
console.log("=== Try A=1 shift (seek position in alphabet then read) ===");
// Convert letters to alphabet positions and interpret as new letters
// First convert to positions (a=1, b=2 etc), then interpret differently
function seekPosition(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            // Convert A-Z to 1-26
            const pos = c - 64;
            // Map differently
            const newPos = ((pos * 7 + 13) % 26) || 26;
            result += String.fromCharCode(newPos + 64);
        } else if (c >= 97 && c <= 122) {
            const pos = c - 96;
            const newPos = ((pos * 7 + 13) % 26) || 26;
            result += String.fromCharCode(newPos + 96);
        } else {
            result += str[i];
        }
    }
    return result;
}
console.log(seekPosition(decoded).substring(0, 60));

// Let me try looking at this more simply
// What if it's simply a string like "https://..." hidden inside
console.log("\n=== Search for http or www in decoded ===");
const hasHttp = decoded.includes("http");
console.log("Has http:", hasHttp);

// More brute force: try each single char XOR key on ROT47 result
console.log("\n=== XOR each char with key (full scan) ===");
const data = Buffer.from(line1, 'base64');
for (let key = 0; key < 256; key++) {
    let res = "";
    for (let i = 0; i < data.length; i++) {
        const b = data[i] ^ key;
        if (b >= 32 && b <= 126) {
            res += String.fromCharCode(b);
        }
    }
    const words = res.toLowerCase().split(/\s+/);
    if (words.some(w => w === 'the' || w === 'puzzle' || w === 'answer' || w === 'solve' || w === 'key' || w === 'hint' || w === 'code')) {
        console.log(`Key ${key}:`, res.substring(0, 70));
    }
}