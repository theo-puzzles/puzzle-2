// Let me try XOR with the hint or other transformations
// Also check if line1 contains reversed text or other patterns

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

// Try XOR with key from hint
const key = "WhereItAllBegan"; // from hint
console.log("=== Try XOR with key ===");
let xorResult = "";
for (let i = 0; i < line1.length; i++) {
    const keyChar = key[i % key.length];
    xorResult += String.fromCharCode(line1.charCodeAt(i) ^ keyChar.charCodeAt(0));
}
console.log("XOR result:", xorResult);

// Try ROT47 on line1, then reverse
console.log("\n=== Try ROT47 then reverse ===");
const rot47_decoded = rot47(line1);
console.log("Reversed ROT47:", rot47_decoded.split('').reverse().join(''));

// Try reversing first, then ROT47
console.log("\n=== Try reverse first, then ROT47 ===");
const reversed = line1.split('').reverse().join('');
console.log("After reverse then ROT47:", rot47(reversed));

// Try to find common puzzle encodings
// Let's look at character frequencies in decoded output
console.log("\n=== Character analysis of ROT47 decoded line1 ===");
const chars = {};
for (const c of rot47_decoded) {
    const ch = c;
    chars[ch] = (chars[ch] || 0) + 1;
}
console.log(chars);

// Maybe it needs to be interpreted as numbers or bytes?
console.log("\n=== Byte analysis ===");
const bytes = [];
for (let i = 0; i < rot47_decoded.length; i++) {
    bytes.push(rot47_decoded.charCodeAt(i));
}
console.log(bytes);

// Check if these are valid ASCII
const printable = bytes.filter(b => b >= 32 && b <= 126).length;
console.log("Printable chars:", printable, "of", bytes.length);