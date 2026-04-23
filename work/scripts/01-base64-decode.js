const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Base64 decode
const decoded = Buffer.from(line1, 'base64');
console.log("Decoded bytes:", decoded);
console.log("Decoded length:", decoded.length);
console.log("As hex:", decoded.toString('hex'));
console.log("As utf8:", decoded.toString('utf8'));
