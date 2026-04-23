const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

// Verify: line2 = ROT47(hint)
const hint = "Where it all begaN_0mpxB5iVQ";
console.log("Verify: ROT47(hint) = line2");
console.log("hint:", hint);
console.log("ROT47(hint):", rot47(hint));
console.log("line2:", line2);
console.log("Match:", rot47(hint) === line2);

// Confirms line2 decoding is ROT47
const answer = rot47(line1);
console.log("\n=== Final Answer ===");
console.log(answer);