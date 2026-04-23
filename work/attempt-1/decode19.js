// Let me approach this differently - maybe it just decodes directly without ROT47
// What if line1 was encoded with a DIFFERENT method?

// First, check if maybe we should NOT do ROT47 first
// The line2 IS the hint that was ROT47 encoded to give us the video
// Maybe line1 uses a DIFFERENT cipher like base64, then some transform

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

// Try different combinations on line1 WITHOUT ROT47 first
console.log("=== Try base64 only ===");
console.log(Buffer.from(line1, 'base64').toString());

console.log("\n=== Try base32 decode first ===");
try {
    console.log(Buffer.from(line1, 'base32').toString());
} catch(e) {
    console.log("Base32 failed");
}

console.log("\n=== Try hex decode first ===");
// Maybe it's actually hex that looks like base64 chars
try {
    const asHex = Buffer.from(line1, 'hex');
    console.log(asHex.toString());
} catch(e) {
    console.log("Hex decode failed");
}

// Try decoding different number of times
console.log("\n=== Try ROT47 multiple times ===");
let current = line1;
for (let i = 1; i <= 5; i++) {
    current = rot47(current);
    console.log(`ROT47 x${i}:`, current.substring(0, 50));
}

// Try using the hint string as key to decode
console.log("\n=== Use hint string with XOR ===");
// hint: "Where it all begaN_0mpxB5iVQ" or just "Where it all began"
const hintKey = "0mpxB5iVQ";
const bytes = Array.from(Buffer.from(line1, 'base64'));
let resultXOR = "";
for (let i = 0; i < bytes.length; i++) {
    const keyByte = hintKey.charCodeAt(i % hintKey.length);
    resultXOR += String.fromCharCode(bytes[i] ^ keyByte);
}
console.log("XOR with video key:", resultXOR);

// Wait - let's go back to what we KNOW works - ROT47 works on line2
// The hint is: "Where it all begaN_0mpxB5iVQ" 
// Let me search online for this combination - maybe it's a known puzzle type

// Actually - look at the phrase: "A drum break might shatter it!"
// "Shatter" - could be decoding using " shatter" (like shattering a cipher)
// OR "drum break" - could refer to the audio "drum and bass" or breakbeat
// The phrase might literally decode something - like "break" as in BREAK the cipher by trying each key

// Let me try each character in hint as a key (try Caesar cipher)
console.log("\n=== Try Caesar cipher for each shift (0-26) ===");
const decodedROT = rot47(line1);
for (let shift = 0; shift <= 26; shift++) {
    let result = "";
    for (let i = 0; i < decodedROT.length; i++) {
        const c = decodedROT.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode(((c - 65 - shift + 26) % 26) + 65);
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
        } else {
            result += decodedROT[i];
        }
    }
    if (result.includes("http") || result.toLowerCase().includes("the ") || result.includes(" puzzle") || result.includes(" answer")) {
        console.log(`Caesar -${shift}:`, result.substring(0, 60));
    }
}