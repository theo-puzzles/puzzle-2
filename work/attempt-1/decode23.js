// Steps 1-5: Let's try more systematically

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

function rot13(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) result += String.fromCharCode(((c - 65 + 13) % 26) + 65);
        else if (c >= 97 && c <= 122) result += String.fromCharCode(((c - 97 + 13) % 26) + 97);
        else result += str[i];
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Let's try different step combinations
const step2 = rot47(line1);
console.log("After Step 2 (ROT47):", step2);

// Step 3 variants
console.log("\n=== Step 3 options ===");
console.log("ROT13:", rot13(step2).substring(0, 60));
console.log("ROT47 x2:", rot47(step2).substring(0, 60));

// Step 3 as base64 decode (the result has non-base64 chars, need to map them)
console.log("\n=== Step 3: Try converting to base64 ===");
// Map rot47 result to base64 valid chars somehow
let base64Str = step2.replace(/[^A-Za-z0-9+/]/g, '').substring(0, 96);
if (base64Str.length % 4 !== 0) base64Str += '='.repeat(4 - (base64Str.length % 4));
try {
    const decoded = Buffer.from(base64Str, 'base64');
    console.log("As base64:", decoded.toString());
} catch(e) {}

// Step 4: What if we interpret step2 chars as different numeric base?
console.log("\n=== Step 4: Interpret as decimal ===");
// Each char code / 2 = something?
let decimalResult = "";
for (let i = 0; i < step2.length; i++) {
    const val = Math.floor(step2.charCodeAt(i) / 2);
    decimalResult += val > 31 ? String.fromCharCode(val) : '?';
}
console.log("Div by 2:", decimalResult);

// Step 5: Maybe subtract position
console.log("\n=== Step 5: Subtract position ===");
let posSubtract = "";
for (let i = 0; i < step2.length; i++) {
    const val = step2.charCodeAt(i) - i;
    posSubtract += val > 31 ? String.fromCharCode(val) : '?';
}
console.log("Subtract position:", posSubtract);

// Or ADD position
console.log("\n=== Add position ===");
let posAdd = "";
for (let i = 0; i < step2.length; i++) {
    const val = (step2.charCodeAt(i) + i) % 127;
    posAdd += val > 31 ? String.fromCharCode(val) : '?';
}
console.log("Add position:", posAdd);

// What if step3 is converting char codes to digits then interpreting?
console.log("\n=== Char codes to digits ===");
let digitStr = "";
for (let i = 0; i < step2.length; i++) {
    digitStr += (step2.charCodeAt(i) - 33).toString().padStart(2, '0');
}
console.log("Digits (first 60):", digitStr.substring(0, 60));

// Take every 3rd digit and interpret as char (ASCII)
let every3rd = "";
for (let i = 0; i < digitStr.length - 2; i += 3) {
    const num = parseInt(digitStr.substring(i, i+3));
    if (num >= 32 && num <= 126) every3rd += String.fromCharCode(num);
}
console.log("Every 3rd digit parsed:", every3rd);

// Or groups of 2 - base 10 to ASCII
console.log("\n=== Groups of 2 digits ===");
let pairs = "";
for (let i = 0; i < digitStr.length - 1; i += 2) {
    const num = parseInt(digitStr.substring(i, i+2));
    if (num >= 32 && num <= 126) pairs += String.fromCharCode(num);
}
console.log("Pairs:", pairs);