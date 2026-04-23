function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

const line2 = "(96C6 :E 2== 3682}0_>AIqd:'\"";
const decoded2 = rot47(line2);
console.log("Line 2:", line2);
console.log("ROT47 decoded:", decoded2);
console.log("Expected: Where it all begaN_0mpxB5iVQ");
console.log("Match:", decoded2 === "Where it all begaN_0mpxB5iVQ");
