import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Candidate lines drafted for this entry (judged on: real patch-note voice,
// single-read laugh, terse changelog phrasing, specific surprise):
// 1. "Fixed: sleep no longer wakes users at 3 a.m. to replay every embarrassing thing they've ever said."
// 2. "Fixed: humans can now fall asleep without first negotiating with every regret from 2011."
// 3. "Fixed: sleep no longer crashes at 3 a.m. and restores the 'that thing you said in 2019' tab."
// 4. "Fixed: REM sleep no longer pauses to let your brain re-read that email you sent in 2017."
// 5. "Fixed: sleep now ships with an off switch for the 3 a.m. meeting with your past self."
// 6. "Fixed: users no longer wake at 3 a.m. convinced they left the oven on in 2009."
// Picked #1: the strongest single-read joke — sleep itself is the buggy
// feature doing the waking, the 3 a.m. cringe replay is universal, and the
// "Fixed:" prefix plus terse phrasing reads like a genuine changelog line.
const ENTRY_LINE =
  "Fixed: sleep no longer wakes users at 3 a.m. to replay every embarrassing thing they've ever said.";

// Validate the line before writing: 1-160 characters counting code points,
// a single line, no leading/trailing padding, and not only white space.
// Fail loudly otherwise. Extracted into a function so the gate logic is
// testable in isolation and the write path stays a straight line.
function validateEntryLine(line: string): void {
  const codePoints = [...line];
  if (codePoints.length < 1 || codePoints.length > 160) {
    throw new Error(
      `entry line must be 1-160 characters, got ${codePoints.length}`,
    );
  }
  // \n, \r, and the Unicode line/paragraph separators (U+2028, U+2029).
  const lineBreaks = [
    "\n",
    "\r",
    String.fromCharCode(0x2028),
    String.fromCharCode(0x2029),
  ];
  if (lineBreaks.some((b) => line.includes(b))) {
    throw new Error("entry line must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry line must not have leading or trailing whitespace");
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only white space");
  }
}

validateEntryLine(ENTRY_LINE);

const outputDir = process.env.OUTPUT_DIR ?? "/output";
// Never delete the output directory first: the server output is a mount.
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY_LINE, "utf8");
