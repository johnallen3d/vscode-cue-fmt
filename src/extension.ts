import { languages, Range, TextDocument, TextEdit } from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

function provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
  let tempfile = cp.spawnSync("mktemp").stdout.toString().trim();
  tempfile = `${tempfile}.cue`;

  const copy = cp.execSync(`cat ${document.fileName} > ${tempfile}`)
  const fmt = cp.spawnSync("cue", ["fmt", tempfile], {});
  const formatted = cp.spawnSync("cat", [tempfile]).stdout.toString().trim();
  const range = document.validateRange(new Range(0, 0, Infinity, Infinity));

  return [new TextEdit(range, formatted)];
}

export async function activate(): Promise<void> {
  languages.registerDocumentFormattingEditProvider('cue', {
    provideDocumentFormattingEdits,
  });
}