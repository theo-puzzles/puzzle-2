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

const rot47line1 = rot47(line1);
console.log("Line1:", line1);
console.log("ROT47(line1):", rot47line1);

// Now try to base64 decode this
// But wait, ROT47 of a base64 string will have invalid base64 characters
// Unless the original encoding used a custom base64 alphabet?

// Actually, let me think again.
// If the encoding was: plaintext -> step1 -> step2 -> step3 -> step4 -> ROT47 -> base64 -> line1
// Then decoding is: line1 -> base64 decode -> ROT47 -> step4^-1 -> step3^-1 -> step2^-1 -> step1^-1 -> plaintext

// I tried base64 decode -> ROT47 and got garbage.
// What if it's: line1 -> ROT47 -> base64 decode -> step4^-1 -> etc?

console.log("\n=== Try: line1 -> ROT47 -> base64 decode ===");
try {
    // ROT47line1 likely has invalid base64 chars, but let's see what happens
    const decoded = Buffer.from(rot47line1, 'base64');
    console.log("Base64 decode successful:");
    console.log("As string:", decoded.toString('utf8'));
    console.log("As hex:", decoded.toString('hex'));
} catch(e) {
    console.log("Base64 decode failed:", e.message);
    
    // The error is expected because ROT47 produces non-base64 characters
    // But what if we need to convert the ROT47 output back to valid base64?
    // That is, apply the inverse mapping of ROT47 to the base64 alphabet
    
    console.log("\n=== Trying to fix the alphabet ===");
    // The ROT47 of a valid base64 string will have characters that are 
    // the ROT47 of the base64 alphabet
    // To get back to a valid base64 string, we need to apply ROT47 again
    // Because ROT47 is its own inverse
    
    const doubleRot47 = rot47(rot47line1);
    console.log("ROT47(ROT47(line1)):", doubleRot47);
    console.log("This should equal original line1:", doubleRot47 === line1);
    
    // So ROT47(line1) is not valid base64, but if we treat it as if it were
    // encoded with a custom alphabet where each char is ROT47 of std base64 char
    // Then we can decode it with that custom alphabet
    
    // Let's try that approach from earlier but more carefully
    
    const stdAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function rot47Char(c) {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return c;
    }
    const customAlphabet = stdAlphabet.split('').map(rot47Char).join('');
    
    console.log("Custom alphabet:", customAlphabet);
    
    // Now decode rot47line1 using customAlphabet as the base64 alphabet
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
        
        // Now we've done: line1 -> ROT47 -> custom base64 decode
        // According to our theory, this should be equivalent to:
        // line1 -> [inverse of step5] -> [inverse of step4] 
        // where step5 = base64 encode with custom alphabet
        // and step4 = ROT47
        
        // So we still need to undo steps 3, 2, 1
        // Let's try applying ROT47 again (in case step3 is also ROT47)
        const afterRot47again = Buffer.from(rot47(result.toString('latin1')), 'latin1');
        console.log("\nAfter applying ROT47 again:");
        console.log("As string:", afterRot47again.toString('utf8'));
        console.log("As hex:", afterRot47again.toString('hex'));
        
        // Try XOR with video ID
        function xorBuffer(buffer, key) {
            const keyBytes = Buffer.from(key);
            const result = Buffer.alloc(buffer.length);
            for (let i = 0; i < buffer.length; i++) {
                result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
            }
            return result;
        }
        
        for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began"]) {
            const xored = xorBuffer(afterRot47again, key);
            console.log(`\nXOR with "${key}":`);
            console.log("As string:", xored.toString('utf8'));
            console.log("As hex:", xored.toString('hex'));
        }
        
    } catch(e) {
        console.log("Custom base64 decode failed:", e.message);
    }
}

// Let me also try the direct approach: what if we just XOR the base64 decoded data
// with the video ID and see if we get something that looks like it needs ROT47
console.log("\n=== Alternative: base64 decode -> XOR -> check if needs ROT47 ===");
const decoded = Buffer.from(line1, 'base64');
for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began"]) {
    const xored = xorBuffer(decoded, key);
    // Check if applying ROT47 helps
    const maybeRot47 = Buffer.from(rot47(xored.toString('latin1')), 'latin1');
    const str = maybeRot47.toString('utf8');
    let printable = 0;
    for (let i = 0; i < maybeRot47.length; i++) {
        if (maybeRot47[i] >= 32 && maybeRot47[i] <= 126) {
            printable++;
        }
    }
    const ratio = printable / maybeRot47.length;
    if (ratio > 0.5) {
        console.log(`Key "${key}" then ROT47: ${str.substring(0, 60)}... (${Math.round(ratio*100)}% printable)`);
        if (ratio > 0.8) {
            console.log(`  FULL: "${str}"`);
        }
    }
}
