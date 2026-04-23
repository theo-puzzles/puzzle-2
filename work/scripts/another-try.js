const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// The output from ROT47(line1) is garbled-looking data.
// Maybe I need to interpret it differently?

// After base64 decoding line1, interpret as: string of bytes.
// Bytes: 74 bytes of binary data (the base64 decode)
// Raw hex: feb46849aa6c1b499826d7ccc4a0372e281c7053b294bf992fbb2d2bcc75764fb8dd9dac8d784834bfaad41b5605209005f9c025747062404d181c59ca29ca57e233def4a97d12daea48

// The result after applying ROT47 is also 74 characters.
// Let me look at both more carefully:

console.log("Original line1:", line1);
console.log("Length:", line1.length, "chars");

function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

const rot47Result = rot47(line1);
console.log("\nROT47(line1):", rot47Result);
console.log("Length:", rot47Result.length, "chars");

// Both are 74 characters - interesting!

// Now interpret the base64-decoded data differently:
// The base64-decoded result from line1 is 74 bytes binary.

const decodedBase64 = Buffer.from(line1, 'base64');
console.log("\nBase64 decoded length:", decodedBase64.length, "bytes");
console.log("As hex:", decodedBase64.toString('hex'));
console.log("As binary:", decodedBase64.toString('binary').substring(0, 50));

// If we interpret each byte as an ASCII value (even if not printable), what's the pattern?
// Maybe each byte maps to specific letters? Like using ASCII positions?

// Check the range of bytes:
// 0x00 to 0xFF cover 0-255
// The decoded hex shows values from 0x00 to 0xff

// Maybe it should be interpreted as numbers mod 26 to get letters?
// That's an A1-Z26, etc. mapping

function a1z26(str) {
    return str.split('').map(char => {
        if (char >= 'a' && char <= 'z') {
            return char.charCodeAt(0) - 96;
        } else if (char >= 'A' && char <= 'Z') {
            return char.charCodeAt(0) - 64;
        }
        return char;
    }).join(' ');
}

console.log("\n=== Try numeric interpretation ===");

// Take the first bytes and see what numbers we get
let nums = [];
for (let i = 0; i < decodedBase64.length; i++) {
    let val = decodedBase64[i] % 26;  // A=1..Z=26
    if (val === 0) val = 26;
    nums.push(String.fromCharCode(96 + val));  // Convert back to letter
}
console.log("Bytes as letters:", nums.join(''));

// Try modulo 26 differently:
let nums2 = [];
for (let i = 0; i < decodedBase64.length; i++) {
    let val = (decodedBase64[i] + i) % 26;  // With shift
    if (val === 0) val = 26;
    nums2.push(String.fromCharCode(96 + val));
}
console.log("Bytes as letters (with shift):", nums2.join(''));

// Try: value is 1-26 mapped to A-Z
// But we need more variation. How about:
console.log("\n=== Try simple substitution with key ===");

// XOR with specific single-byte keys that produce readable letters
for (let key = 0; key < 256; key++) {
    let result = [];
    for (let i = 0; i < decodedBase64.length; i++) {
        const val = decodedBase64[i] ^ key;
        if (val >= 65 && val <= 90) {
            result.push(String.fromCharCode(val));
        } else if (val >= 97 && val <= 122) {
            result.push(String.fromCharCode(val));
        } else {
            break;
        }
    }
    if (result.length > decodedBase64.length * 0.8) {
        console.log(`XOR key ${key}:`, result.join(''));
    }
}

// Nothing found. Let me step back.

console.log("\n=== Let me check if answer needs another transform after ROT47 ===");

// From the result in ROT47(line1):
// ^C#@$2ADv_>*yE7|Izpb{:844u~J={Z+{fDEzgI`5<Zcb+aD;)9x}{ZB`qE(q$r"q7?py)#H*<q}vqI+J:?z'ZxKbG$A7#{2e<;l

// Can this be interpreted as more base64 or something else?

// What if: ROT47(line1) is still encoded and needs decoding in another form?
// Let's see if there's valid data we can extract.

const r = rot47(line1);
// The chars are all in ASCII range 33-126, could be printable text. 
// If you ROT47 again, you should get back original line1 (test ROT47 property).
const doubleRot47 = rot47(r);
console.log("ROT47 applied twice gives original:", doubleRot47 === line1);

// So if after ROT47 it returns to itself, doesn't help.

// What if after ROT47, now there's another encoding scheme?

// Wait. I just realized something. Let me re-read the hint in task:
// "2nd line is a hint. It is NOT THE ANSWER. It decodes to `Where it all begaN_0mpxB5iVQ`"
// The hint talks about line2 decoding, NOT what we should do with line1!

// The puzzle gives us line1 and line2 in puzzle.txt. We decrypt line1 to get answer.
// And we use line2 as hint.

console.log("\n=== Consider: What does line2's decoded hint tell us? ===");
console.log("line2 decodes to: Where it all begaN_0mpxB5iVQ");

// Where it all began + video ID. This is about starting.
// Maybe we should start with line1 and do something to find answer?

// What if we should decode line1 in the same way we decoded line2: apply ROT47.
// Yes, that's what we tried first!

// But maybe it's: base64 decode, then apply ROT47? That gave different results.

console.log("\n=== Another approach: decode differently ===");

// What if it's: Apply ROT47 to base64-decoded bytes, not string?
// That changes things.

function rot47Bytes(buf) {
    const result = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) {
        const byte = buf[i];
        if (byte >= 33 && byte <= 126) {
            result[i] = 33 + ((byte - 33 + 47) % 94);
        } else {
            result[i] = byte;
        }
    }
    return result;
}

const decoded = Buffer.from(line1, 'base64');
const afterROT47Bytes = rot47Bytes(decoded);
console.log("Applying ROT47 to base64-decoded bytes:");
console.log("As string:", afterROT47Bytes.toString('utf8'));
console.log("As hex:", afterROT47Bytes.toString('hex'));

// Try printing those where byte in printable range
let charOutput = '';
let hexChars = [];
for (let i = 0; i < afterROT47Bytes.length; i++) {
    const b = afterROT47Bytes[i];
    if (b >= 32 && b <= 126) {
        charOutput += String.fromCharCode(b);
    } else {
        charOutput += '.';
    }
}
console.log("Printable-ish:", charOutput);

// None produced any readable text...


// Try reverse of bytes and then ROT47 or XOR.
// Since ROT47 gave back line1, maybe reversing THEN XOR?

function xorBytes(data, keyStr) {
    const key = Buffer.from(keyStr);
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        result[i] = data[i] ^ key[i % key.length];
    }
    return result;
}

// Reverse the data first
const reversedOriginal = Buffer.from([...decoded].reverse());
console.log("\n=== Reversed decoded base64, then try XOR ===");
for (const key of ["iPhone", "UltraWide", "N_0mpxB5iVQ", "Where", "began", "DEMO", "FOOTAGE", "Skate"]) {
    // Try XOR after reversing
    const xored = xorBytes(reversedOriginal, key);
    const str = xored.toString('utf8');
    // Count printable chars
    let printable = 0;
    for (let i = 0; i < xored.length; i++) {
        if (xored[i] >= 32 && xored[i] <= 126) printable++;
    }
    if (printable / xored.length > 0.7) {
        console.log(`Reverse then XOR ${key}: ${str.substring(0, 60)}... (${Math.round(printable/xored.length*100)}%)`);
    }
}

// Nothing significant in readable...


// Final thought: what's a "plaintext decryption" even mean? It probably means readable characters, but all my attempts result in binary/bad output. Could some step be custom encoding (like simple substitution) needed?

// Or perhaps the key is video ID? Let's try key = "N_0mpxB5iVQ" exactly but as key.
console.log("\n=== One more try: use the exact video ID as key in XOR ===");
const xoredFinal = xorBytes(decoded, "N_0mpxB5iVQ");
const strFinal = xoredFinal.toString('utf8');
let printableCount = 0;
for (let i = 0; i < xoredFinal.length; i++) {
    if (xoredFinal[i] >= 32 && xoredFinal[i] <= 126) printableCount++;
}
console.log("Result printable:", Math.round(printableCount/xoredFinal.length*100) + "%");
console.log("String:", strFinal.substring(0, 60));