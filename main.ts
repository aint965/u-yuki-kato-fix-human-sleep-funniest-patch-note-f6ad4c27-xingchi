import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen patch-note line. Drafted from 6 candidates, then revised once:
// the first draft ("Fixed: humans no longer wake up at 3 a.m. ...") made the
// human the subject; the revision makes sleep itself the buggy feature doing
// the waking, which is the actual fix framing and reads like a real changelog.
const ENTRY_LINE =
  "Fixed: sleep no longer wakes users at 3 a.m. to replay every embarrassing thing they've ever said.";

// Validate the line before writing: 1-160 characters counting code points,
// a single line, and not only white space. Fail loudly otherwise.
const codePoints = [...ENTRY_LINE];
if (codePoints.length < 1 || codePoints.length > 160) {
  throw new Error(
    `entry line must be 1-160 characters, got ${codePoints.length}`,
  );
}
if (ENTRY_LINE.includes("\n") || ENTRY_LINE.includes("\r")) {
  throw new Error("entry line must be a single line");
}
if (ENTRY_LINE.trim().length === 0) {
  throw new Error("entry line must not be only white space");
}

const outputDir = process.env.OUTPUT_DIR ?? "/output";
// Never delete the output directory first: the server output is a mount.
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY_LINE, "utf8");
