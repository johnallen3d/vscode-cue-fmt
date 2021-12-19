'use strict';
import { languages, Range, TextDocument, TextEdit, window } from 'vscode';
import { spawnSync } from 'child_process';
import { join, basename } from 'path';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { readFileSync, writeFileSync } from 'fs';

function provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
  const dir = tmpdir();
  const random = randomBytes(16).toString('hex');
  const tmpfilePrefix = join(dir, `vscode-cue-fmt-${random}-`);
  const tmpfile = `${tmpfilePrefix}${basename(document.fileName)}`;

  // copy current contents to a tempfile
  writeFileSync(tmpfile, document.getText());

  // run `cue fmt` on temp file
  const fmt = spawnSync("cue", ["fmt", tmpfile], {});

  if (fmt.stdout) {
    const error = fmt.stderr.toString().replace(tmpfilePrefix, "");

    // TODO: can we include carraige return in error message?
    window.showErrorMessage(`Run \`cue fmt\` error: ${error}`);
  }

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