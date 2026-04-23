const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Apply ROT47 first (assuming it's the last encoding step)
function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

function xorBuffer(buffer, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
}

const rot47line1 = rot47(line1);
console.log("Line1:", line1);
console.log("ROT47(line1):", rot47line1);

// Try: line1 -> ROT47 -> base64 decode -> [more steps]
console.log("\n=== Try: line1 -> ROT47 -> base64 decode ===");
try {
    // ROT47line1 likely has invalid base64 chars, but let's see what happens
    const decoded = Buffer.from(rot47line1, 'base64');
    console.log("Base64 decode successful:");
    console.log("As string:", decoded.toString('utf8'));
    console.log("As hex:", decoded.toString('hex'));
} catch(e) {
    console.log("Base64 decode failed:", e.message);
    
    // Try with custom alphabet approach
    console.log("\n=== Trying custom base64 alphabet ===");
    const stdAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function rot47Char(c) {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return c;
    }
    const customAlphabet = stdAlphabet.split('').map(rot47Char).join('');
    
    function base64DecodeCustom(str, alphabet) {
        const lookup = {};
        for (let i = 0; i < alphabet.length; i++) {
            lookup[alphabet[i]] = i;
        }
        
        // Remove padding
        str = str.replace(/=+$/, '');
        
        let bits = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (!(char in lookup)) {
                throw new Error(`Invalid character '${char}' at position ${i} for alphabet`);
            }
            const val = lookup[char];
            bits += val.toString(2).padStart(6, '0');
        }
        
        const bytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            const byteStr = bits.substring(i, i + 8);
            if (byteStr.length === 8) {
                bytes.push(parseInt(byteStr, 2));
            }
        }
        
        return Buffer.from(bytes);
    }
    
    try {
        const result = base64DecodeCustom(rot47line1, customAlphabet);
        console.log("\nDecoded using custom ROT47 alphabet:");
        console.log("As string:", result.toString('utf8'));
        console.log("As hex:", result.toString('hex'));
        
        // Now try further transformations on this result
        console.log("\n=== Trying further transformations ===");
        
        // Try applying ROT47 again
        const afterRot47 = Buffer.from(rot47(result.toString('latin1')), 'latin1');
        console.log("After ROT47:", afterRot47.toString('utf8'));
        
        // Try XOR with various keys
        for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began"]) {
            const xored = xorBuffer(afterRot47, key);
            console.log(`XOR with "${key}":`, xored.toString('utf8'));
        }
        
        // Try XOR first, then ROT47
        console.log("\n--- XOR first, then ROT47 ---");
        for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began"]) {
            const xored = xorBuffer(result, key);
            const afterRot = Buffer.from(rot47(xored.toString('latin1')), 'latin1');
            console.log(`XOR with "${key}" then ROT47:`, afterRot.toString('utf8'));
        }
        
    } catch(e) {
        console.log("Custom base64 decode failed:", e.message);
    }
}

// Let me also try the direct approach that worked for line2
console.log("\n=== Direct approach: what if line1 just needs a different cipher? ===");
console.log("Line2 used ROT47. What if line1 uses a different rotation?");

// Try ROT13
function rot13(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // A-Z
            return String.fromCharCode((code - 65 + 13) % 26 + 65);
        } else if (code >= 97 && code <= 122) { // a-z
            return String.fromCharCode((code - 97 + 13) % 26 + 97);
        }
        return char;
    }).join('');
}

console.log("ROT13 of line1:", rot13(line1));

// Try ROT1
function rot1(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // A-Z
            return String.fromCharCode((code - 65 + 1) % 26 + 65);
        } else if (code >= 97 && code <= 122) { // a-z
            return String.fromCharCode((code - 97 + 1) % 26 + 97);
        }
        return char;
    }).join('');
}

console.log("ROT1 of line1:", rot1(line1).substring(0, 50) + "...");

// Try ROT5 for digits
function rot5(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 48 && code <= 57) { // 0-9
            return String.fromCharCode((code - 48 + 5) % 10 + 48);
        }
        return char;
    }).join('');
}

console.log("ROT5 of line1:", rot5(line1).substring(0, 50) + "...");

// Try combining ROTs
function rot47_then_rot5(str) {
    return rot5(rot47(str));
}
console.log("ROT47 then ROT5:", rot47_then_rot5(line1).substring(0, 50) + "...");
