const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Standard base64 alphabet
const stdAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Apply ROT47 to the standard alphabet to get a custom one
function rot47Char(c) {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) {
        return String.fromCharCode(33 + ((code - 33 + 47) % 94));
    }
    return c;
}

const customAlphabet = stdAlphabet.split('').map(rot47Char).join('');
console.log("Standard alphabet:", stdAlphabet);
console.log("Custom (ROT47) alphabet:", customAlphabet);

// Now decode line1 using this custom alphabet
function base64DecodeWithAlphabet(str, alphabet) {
    // Build lookup
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
            throw new Error(`Invalid character '${char}' at position ${i}`);
        }
        const val = lookup[char];
        bits += val.toString(2).padStart(6, '0');
    }
    
    // Convert bits to bytes
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
    const decoded = base64DecodeWithAlphabet(line1, customAlphabet);
    console.log("\nDecoded with custom ROT47 alphabet:");
    console.log("As string:", decoded.toString('utf8'));
    console.log("As hex:", decoded.toString('hex'));
    
    // Try to see if it's further encoded
    // Maybe it's base64 again?
    try {
        const maybeBase64 = decoded.toString('utf8');
        const doubleDecoded = Buffer.from(maybeBase64, 'base64');
        console.log("\nPossible double base64 decode:");
        console.log("As string:", doubleDecoded.toString('utf8'));
        console.log("As hex:", doubleDecoded.toString('hex'));
    } catch(e) {
        console.log("\nNot a valid base64 string:", e.message);
    }
    
} catch(e) {
    console.log("Error decoding:", e.message);
}

// Try the inverse: what if we ROT47 the line1 first, then decode with std alphabet?
console.log("\n=== Alternative: ROT47 line1, then std base64 decode ===");
function rot47Str(str) {
    return str.split('').map(rot47Char).join('');
}

const rot47Line1 = rot47Str(line1);
console.log("ROT47 of line1:", rot47Line1);

try {
    // This likely won't be valid base64 since ROT47 produces non-base64 chars
    const decoded2 = Buffer.from(rot47Line1, 'base64');
    console.log("Std base64 decode of ROT47 line1:", decoded2.toString('utf8'));
} catch(e) {
    console.log("Not valid base64 after ROT47:", e.message);
    
    // But what if we need to fix the alphabet after ROT47?
    // The ROT47 of base64 chars should give us a permutation that we can map back
    // Actually, if we have X = base64_encode(plaintext)
    // And we have Y = ROT47(X)
    // Then X = ROT47(Y) because ROT47 is its own inverse
    // So plaintext = base64_decode(ROT47(Y))
    // Which is what I just tried above and it failed.
    
    // Unless... the encoding was: plaintext -> base64 with CUSTOM alphabet -> line1
    // And we just tried: line1 -> std base64 decode (which would be wrong)
    // What we need is: line1 -> custom base64 decode
    // Where the custom alphabet is what?
    
    // If line1 = base64_encode_with_custom_alphabet(plaintext)
    // And we suspect the custom alphabet is ROT47(std_alphabet)
    // Then plaintext = base64_decode_with_alphabet(line1, ROT47(std_alphabet))
    // Which is exactly what I did above!
}

// Let me try another common transformation: what if the base64 was reversed?
console.log("\n=== Try reversing line1 then base64 decode ===");
const reversed = line1.split('').reverse().join('');
console.log("Reversed line1:", reversed);
try {
    const decodedRev = Buffer.from(reversed, 'base64');
    console.log("Base64 decode of reversed:", decodedRev.toString('utf8'));
    console.log("Hex:", decodedRev.toString('hex'));
} catch(e) {
    console.log("Not valid base64 when reversed:", e.message);
}

// Try ROT47 then reverse
console.log("\n=== Try ROT47 then reverse then base64 decode ===");
const rot47ThenReverse = rot47Str(line1).split('').reverse().join('');
console.log("ROT47 then reverse:", rot47ThenReverse);
try {
    const decodedRTR = Buffer.from(rot47ThenReverse, 'base64');
    console.log("Base64 decode of ROT47+reverse:", decodedRTR.toString('utf8'));
} catch(e) {
    console.log("Not valid base64:", e.message);
}

// Let me think about the "5 steps" again
// From the hint: Where it all begaN_0mpxB5iVQ
// This suggests: "Where it all began" + video ID
// 
// What if the steps are:
// 1. Start with plaintext
// 2. Apply some transform A
// 3. Apply some transform B (the hard one)
// 4. Apply some transform C
// 5. Base64 encode -> line1
//
// And we know that applying ROT47 to line2 gives us a hint
// So maybe line2 was: hint -> some transform -> line2
// And we reversed it: line2 -> inverse transform -> hint
//
// If that's the case, then maybe:
// line1 -> inverse transform C -> inverse transform B (hard) -> inverse transform A -> plaintext
// 
// And we know that for line2: line2 -> inverse transform (ROT47) -> hint
//
// So maybe the same transform family is used for both lines?
//
// Let me assume that the same steps are used, just different content.
// Then for line2 we know step 5 (last) is ROT47.
// So working backwards:
// line2 = ROT47(step4_output)
// step4_output = ROT47(line2) = "Where it all begaN_0mpxB5iVQ"
//
// If the same 5 steps are used for line1:
// line1 = step5_output
// step4_output = inverse_step5(line1)
// step3_output = inverse_step4(step4_output)
// step2_output = inverse_step3(step3_output)
// step1_output = inverse_step2(step2_output)
// plaintext = inverse_step1(step1_output)
//
// If step5 is ROT47, then inverse_step5 is also ROT47.
// So step4_output = ROT47(line1)
//
// Let me try that and see if step4_output looks like it could be further processed.
