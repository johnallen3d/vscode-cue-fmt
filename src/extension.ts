"use strict";

import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  languages,
  Position,
  Range,
  TextDocument,
  TextEdit,
  window,
} from "vscode";

import { spawnSync } from "child_process";
import { join, basename } from "path";
import { randomBytes } from "crypto";
import { tmpdir } from "os";
import { readFileSync, writeFileSync } from "fs";

let diagnosticCollection: DiagnosticCollection;

function provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
  const range = document.validateRange(new Range(0, 0, Infinity, Infinity));
  const dir = tmpdir();
  const random = randomBytes(16).toString("hex");
  const tmpfilePrefix = join(dir, `vscode-cue-fmt-${random}-`);
  const tmpfile = `${tmpfilePrefix}${basename(document.fileName)}`;

  // copy current contents to a temporary file
  writeFileSync(tmpfile, document.getText());

  // run `cue fmt` on temp file
  const fmt = spawnSync("cue", ["fmt", tmpfile], {});

  // run `cue vet` to return errors
  const vet = spawnSync("cue", ["vet", tmpfile], {});

  // refresh diagnostics/problems
  updateDiagnostics(document, vet.stderr.toString(), tmpfilePrefix);

  // read formatted file
  const formatted = readFileSync(tmpfile).toString();

  // write formatted CUE back to document
  return [new TextEdit(range, formatted)];
}

// show info in problem panel
//
// parsing errors from `cue fmt` formatted like this
// ---
// missing ',' before newline in list literal
//     ./foo.cue:221:4
// missing ',' in list literal:
//     ./foo.cue:222:8
function updateDiagnostics(
  document: TextDocument,
  errorMessage: string,
  tmpfilePrefix: string
): void {
  const problems: Diagnostic[] = [];
  const re = /^[\s\S]*?(\d+:\d+)(?=$)/gm;
  let match, message, line, column, position;

  diagnosticCollection.clear();

  while ((match = re.exec(errorMessage))) {
    // individual error message; scrub temp file path
    message = match[0].replace(tmpfilePrefix, "/");
    // location of problem
    [line, column] = match[1].split(":");
    position = [parseInt(line) - 1, parseInt(column)];

    const range = new Range(
      new Position(position[0], position[1]),
      new Position(position[0], position[1])
    );

    problems.push({
      message: message,
      range,
      severity: DiagnosticSeverity.Error,
    });
  }

  diagnosticCollection.set(document.uri, problems);
}

export async function activate(): Promise<void> {
  diagnosticCollection = languages.createDiagnosticCollection("cue-fmt");

  languages.registerDocumentFormattingEditProvider("cue", {
    provideDocumentFormattingEdits,
  });
}

