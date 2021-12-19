import { languages, Range, TextDocument, TextEdit } from 'vscode';
import { spawnSync } from 'child_process';
import { join, basename } from 'path';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { readFileSync, writeFileSync } from 'fs';

function provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
  const dir = tmpdir();
  const currentFileName = basename(document.fileName);
  const random = randomBytes(16).toString('hex');
  const tmpfileName = `vscode-cue-fmt-${random}-${currentFileName}`;
  const tmpfile = join(dir, tmpfileName);

  // copy current contents to a tempfile
  writeFileSync(tmpfile, document.getText());

  // run `cue fmt` on temp file
  // TODO: handle errror/stderr, report to user
  const fmt = spawnSync("cue", ["fmt", tmpfile], {});

  // read formatted file
  const formatted = readFileSync(tmpfile).toString();

  // create range representing the whole document to be replaced
  const range = document.validateRange(new Range(0, 0, Infinity, Infinity));

  // write formatted CUE back to document
  return [new TextEdit(range, formatted)];
}

export async function activate(): Promise<void> {
  languages.registerDocumentFormattingEditProvider('cue', {
    provideDocumentFormattingEdits,
  });
}