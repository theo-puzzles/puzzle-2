// The hint says we need ~5 steps! Step 2 is ROT47 (what we've been getting)
// Let me try step 3 and beyond

// Step 2 was ROT47 decode: ^C#@$2ADv_>*yE7|Izpb{:844u~J={Z+{fDEzgI`5<Zcb+aD;)9x}{ZB`qE(q$r"q7?py)#H*<q}vqI+J:?z'ZxKbG$A7#{2e<;l

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

// Step 2 result
const step2 = rot47(line1);
console.log("Step 2 (ROT47):", step2);

// Step 3 - try base64 decode on step 2 result
// But step2 has special chars like ^ # $ @ etc - not standard base64
// What if we first convert step2 to standard base64 chars and then decode?

// Actually, what if step 3 is: convert result to binary/bytes and interpret differently?
console.log("\n=== Step 3: Try interpreting step2 as bytes then decode/transform ===");
// Convert each char to its ASCII code, treat as hex, then decode
let hexStr = "";
for (let i = 0; i < step2.length; i++) {
    hexStr += step2.charCodeAt(i).toString(16).padStart(2, '0');
}
console.log("As hex string:", hexStr);

// Now decode from hex
const step3_from_hex = Buffer.from(hexStr, 'hex');
console.log("As decoded bytes to string:", step3_from_hex.toString());

// Step 3 - Try step2 as URL-encoded
console.log("\n=== Step 3: URL decode ===");
try {
    console.log("URL decoded:", decodeURIComponent(step2));
} catch(e) { console.log("URL decode error"); }

// Step 3 - Maybe XOR each byte with something constant?
console.log("\n=== Step 3: XOR with constant ===");
for (let key = 1; key < 50; key++) {
    let result = "";
    for (let i = 0; i < step2.length; i++) {
        const b = step2.charCodeAt(i) ^ key;
        if (b >= 32 && b <= 126) result += String.fromCharCode(b);
    }
    if (result.includes("http") || result.toLowerCase().includes("the")) {
        console.log(`XOR ${key}:`, result);
    }
}

// Step 4 - Maybe reverse or transpose
console.log("\n=== Step 4: Different transforms ===");
// Reverse step 2
console.log("Reverse:", step2.split('').reverse().join(''));

// Swap case
console.log("Swap case:", step2.swapCase().substring(0, 60));

// Step 5: Maybe we need to split and recombine
console.log("\n=== Step 5: Split step2 in half and combine ===");
// Take first half and second half and interleave
const half = Math.floor(step2.length / 2);
const firstHalf = step2.substring(0, half);
const secondHalf = step2.substring(half);
let interleaved = "";
for (let i = 0; i < half; i++) {
    interleaved += firstHalf[i] + secondHalf[i];
}
console.log("Interleaved:", interleaved);

// Actually let me be systematic - let's try treating the ROT47 result AS base64
// First, let's see if we can make it valid base64 by replacing special chars
console.log("\n=== Try step2 as base64 after char replacement ===");
// Replace chars outside base64 set with something
let base64ish = step2.replace(/[^A-Za-z0-9+/=]/g, '@');
console.log("Base64-ish:", base64ish.substring(0, 60));
try {
    console.log("Decode attempt:", Buffer.from(base64ish, 'base64').toString());
} catch(e) {}