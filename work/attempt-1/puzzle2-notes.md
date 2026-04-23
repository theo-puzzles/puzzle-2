# Puzzle 2 - Work Documentation

## Puzzle Details
- Line 1 (puzzle): `/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=`
- Line 2 (hint): `(96C6 :E 2== 3682}0_>AIqd:'"`

## Understanding so far

### Line 2 Analysis (HINT)
- Line 2 decodes via ROT47 to: `Where it all begaN_0mpxB5iV`
- This is a YouTube video ID: `N_0mpxB5iVQ` (missing 'Q' maybe due to length)
- Video title: "iPhone 11 UltraWide Skate Footage Demo"
- Hint phrase from creator: "A drum break might shatter it!"

### Line 1 Analysis
- Step 1: Probably raw input (base64 string)
- Step 2: Apply ROT47 - we get `^C#@$2ADv_>*yE7|Izpb{:844u~J={Z+{fDEzgI`5<Zcb+aD;)9x}{ZB`qE(q$r"q7?py)#H*<q}vqI+J:?z'ZxKbG$A7#{2e<;l`

### What has been tried
The creator says ~5 steps, and most people stop at step 2 result. 
We need steps 3, 4, 5 to get the final answer.

## Attempts for steps 3-5
1. ROT47 twice gives original - not helpful
2. ROT13, XOR with various keys, base64, URL encoding
3. Interpreting as binary/hex and re-encoding
4. Position-based transformations (add/subtract index)
5. Column/grid reads
6. Combining with hint line via XOR, addition

## Notes
- Hint line confirms ROT47 is step 2
- "A drum break might shatter it" likely means additional decoding is needed
- The solution after step 2 likely requires 2-3 more transformations
- Not simple substitution - probably requires numeric conversion or similar