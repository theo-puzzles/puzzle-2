const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'\"";

// Verify line2 decoding
function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

console.log("Line2:", line2);
console.log("ROT47 line2:", rot47(line2));
console.log("Expected: Where it all begaN_0mpxB5iVQ");
console.log("Match:", rot47(line2) === "Where it all begaN_0mpxB5iVQ");

// Theory: line1 was encoded with 5 steps + base64
// Where step5 = ROT47 (same as used for line2)
// So: plaintext → step1 → step2 → step3 → step4 → ROT47 → base64 → line1
// To decode: line1 → base64 decode → ROT47 → step4⁻¹ → step3⁻¹ → step2⁻¹ → step1⁻¹ → plaintext

console.log("\n=== Testing theory: line1 -> base64 decode -> ROT47 ===");
const decoded = Buffer.from(line1, 'base64');
console.log("Base64 decoded length:", decoded.length);
console.log("Base64 decoded hex:", decoded.toString('hex'));

const afterRot47 = Buffer.from(rot47(decoded.toString('latin1')), 'latin1'); // Treat as latin1 to preserve bytes
console.log("\nAfter ROT47 on decoded bytes:");
console.log("As string:", afterRot47.toString('utf8'));
console.log("As hex:", afterRot47.toString('hex'));
console.log("Length:", afterRot47.length);

// Now what could steps 1-4 be? Let me try common cipher combinations
// Maybe they are simple and repetitive?

// Try XOR with various keys on the result
function xorBuffer(buffer, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
}

console.log("\n=== Trying XOR after base64+ROT47 ===");
for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began", "11", "5"]) {
    const result = xorBuffer(afterRot47, key);
    const str = result.toString('utf8');
    let printable = 0;
    for (let i = 0; i < result.length; i++) {
        if (result[i] >= 32 && result[i] <= 126) {
            printable++;
        }
    }
    const ratio = printable / result.length;
    if (ratio > 0.5) {
        console.log(`XOR with "${key}": ${str.substring(0, 60)}... (${Math.round(ratio*100)}% printable)`);
        if (ratio > 0.8) {
            console.log(`  FULL: "${str}"`);
        }
    }
}

// What if the steps are: base64, XOR, ROT47, XOR, ROT47?
// Or some other pattern?

// Let me try to brute force the idea that steps 1-4 are simple and maybe symmetric
console.log("\n=== Trying to find simple patterns ===");

// What if after base64+ROT47, we just need to reverse?
const reversed = Buffer.from([...afterRot47].reverse());
console.log("Reversed after base64+ROT47:", reversed.toString('utf8'));

// What if we need to apply ROT47 again?
const rot47again = Buffer.from(rot47(reversed.toString('latin1')), 'latin1');
console.log("ROT47 again:", rot47again.toString('utf8'));

// What about applying ROT47 three times total?
const rot47three = Buffer.from(rot47(rot47again.toString('latin1')), 'latin1');
console.log("ROT47 three times:", rot47three.toString('utf8'));

// Four times?
const rot47four = Buffer.from(rot47(rot47three.toString('latin1')), 'latin1');
console.log("ROT47 four times:", rot47four.toString('utf8'));

// Five times?
const rot47five = Buffer.from(rot47(rot47four.toString('latin1')), 'latin1');
console.log("ROT47 five times:", rot47five.toString('utf8'));

// Six times?
const rot47six = Buffer.from(rot47(rot47five.toString('latin1')), 'latin1');
console.log("ROT47 six times:", rot47six.toString('utf8'));

// Since ROT47 is its own invariant, even times should give original, odd times should give ROT47 once
console.log("\nVerifying ROT47 properties:");
const once = Buffer.from(rot47(decoded.toString('latin1')), 'latin1');
const twice = Buffer.from(rot47(once.toString('latin1')), 'latin1');
console.log("Twice equals original:", twice.equals(decoded));

// So applying ROT47 an even number of times does nothing, odd number is same as once
// Therefore, if step5 is ROT47, and we applied it once after base64 decode,
// applying it again would undo it.

// Let me think about what the 5 steps could be...
// Maybe they are: ROT47, XOR, ROT47, XOR, ROT47?
// Then to decode we'd do: ROT47, XOR, ROT47, XOR, ROT47 (same since they're self-inverse or pairs)

// Actually, if the encoding steps are: [A, B, C, D, E]
// Then decoding steps are: [E⁻¹, D⁻¹, C⁻¹, B⁻¹, A⁻¹]

// If E = ROT47, then E⁻¹ = ROT47
// If D = XOR with key K, then D⁻¹ = XOR with key K (same)
// If C = ROT47, then C⁻¹ = ROT47
// If B = XOR with key M, then B⁻¹ = XOR with key M
// If A = ROT47, then A⁻¹ = ROT47

// So if the pattern is ROT47, XOR, ROT47, XOR, ROT47
// Then decoding is: ROT47, XOR, ROT47, XOR, ROT47 (same pattern!)

console.log("\n=== Trying pattern: ROT47, XOR, ROT47, XOR, ROT47 ===");
let current = decoded;
console.log("Starting with base64 decoded data");

// Step 1: ROT47
current = Buffer.from(rot47(current.toString('latin1')), 'latin1');
console.log("After step 1 (ROT47):", current.toString('utf8').substring(0, 50));

// Step 2: XOR with something
// Try various keys
for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ"]) {
    const step2 = xorBuffer(current, key);
    console.log(`  After XOR with "${key}":`, step2.toString('utf8').substring(0, 50));
    
    // Step 3: ROT47
    const step3 = Buffer.from(rot47(step2.toString('latin1')), 'latin1');
    console.log(`    After ROT47:`, step3.toString('utf8').substring(0, 50));
    
    // Step 4: XOR with same or different key
    for (const key2 of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began"]) {
        const step4 = xorBuffer(step3, key2);
        console.log(`      After XOR with "${key2}":`, step4.toString('utf8').substring(0, 50));
        
        // Step 5: ROT47
        const step5 = Buffer.from(rot47(step4.toString('latin1')), 'latin1');
        const resultStr = step5.toString('utf8');
        console.log(`        After ROT47:`, resultStr.substring(0, 60));
        
        // Check if it looks like text
        let printable = 0;
        for (let i = 0; i < step5.length; i++) {
            if (step5[i] >= 32 && step5[i] <= 126) {
                printable++;
            }
        }
        const ratio = printable / step5.length;
        if (ratio > 0.7) {
            console.log(`          -> ${Math.round(ratio*100)}% printable: "${resultStr}"`);
        }
    }
}
