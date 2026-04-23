// The hint says "A drum break might shatter it!" - this might be a key phrase

// Let's try using that phrase as a key for decryption

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

// Let's also check what video the hint points to and see if there's some theme
// N_0mpxB5iVQ - YouTube video about iPhone 11 UltraWide Skate Footage
// Maybe "skate" or "ultra wide" is important

// Let's see if there's another layer - maybe we need to do something with the decoded text
const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded1 = rot47(line1);

console.log("Line1 ROT47 decoded:", decoded1);
console.log("Length:", decoded1.length);

// Try splitting into chunks or reading as something else
// Maybe it's a URL encoded?

// Let's try URL decoding
console.log("\n=== Try URL decode ===");
try {
    const urlDecoded = decodeURIComponent(decoded1);
    console.log("URL decoded:", urlDecoded);
} catch(e) {
    console.log("URL decode error:", e.message);
}

// Try hex decoding if it looks like hex pairs
console.log("\n=== Try hex pairs ===");
let hexStr = "";
for (let i = 0; i < decoded1.length; i++) {
    hexStr += decoded1.charCodeAt(i).toString(16).padStart(2, '0');
}
console.log("Hex:", hexStr);

// Maybe it's a substitution cipher with shift based on the key from hint "drum break"
console.log("\n=== Try Caesar shift with key from hint ===");
const hintKey = "drum break"; // from hint
for (let shift = 1; shift < 26; shift++) {
    let result = "";
    for (let i = 0; i < decoded1.length; i++) {
        const c = decoded1.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode(((c - 65 - shift + 26) % 26) + 65);
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
        } else {
            result += decoded1[i];
        }
    }
    if (result.toLowerCase().includes("the") || result.toLowerCase().includes("and")) {
        console.log(`Shift ${shift}:`, result.substring(0, 60));
    }
}