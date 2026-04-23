// Let me try various encoding approaches more systematically

// Also try decoding the puzzle as a chain of operations

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

// Maybe it's double encoded - ROT47 twice?
console.log("=== ROT47 twice ===");
const rot47_2x = rot47(rot47(line1));
console.log(rot47_2x);

// Try Caesar on the ROT47 decoded text
console.log("\n=== Caesar shifts on ROT47 result ===");
const decoded = rot47(line1);
for (let shift = 1; shift < 26; shift++) {
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
        const c = decoded.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode(((c - 65 - shift + 26) % 26) + 65);
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
        } else {
            result += decoded[i];
        }
    }
    // Look for readable text
    if (result.toLowerCase().includes("the ") || result.includes("http") || result.toLowerCase().includes(" and ")) {
        console.log(`Caesar -${shift}:`, result.substring(0, 70));
    }
}

// Try hex decoding of the original string (each byte as hex)
console.log("\n=== Hex decode original ===");
const hexPairs = line1.match(/.{1,2}/g) || [];
let hexDecode = "";
for (const pair of hexPairs) {
    if (pair.length === 2) {
        const num = parseInt(pair, 16);
        if (!isNaN(num) && num > 31) {
            hexDecode += String.fromCharCode(num);
        }
    }
}
console.log("Potential hex decode:", hexDecode);

// Look at if there's some other cipher - maybe Atbash?
console.log("\n=== Atbash cipher ===");
function atbash(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode(90 - (c - 65));
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode(122 - (c - 97));
        } else {
            result += str[i];
        }
    }
    return result;
}
console.log("Atbash:", atbash(decoded));