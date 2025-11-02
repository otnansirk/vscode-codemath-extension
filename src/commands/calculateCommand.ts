import * as vscode from 'vscode';
import calculate from '../handlers/calculate';


const calculateCommands = (context: vscode.ExtensionContext) => {

  let activeDecoration: vscode.TextEditorDecorationType | undefined = undefined;

  // Set decoration type
  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      color: '#707070',
      margin: '0 0 0 20px'
    }
  });


  /**
   * Set decoration with decoration type
   */
  const setActiveDecoration = (activeEditor: vscode.TextEditor, range: vscode.Range, result: number | null): void => {
    activeDecoration = decorationType;
    activeEditor.setDecorations(decorationType, [{
      range,
      renderOptions: {
        after: {
          contentText: `${result?.toLocaleString() ?? ""}`
        }
      }
    }]);
    vscode.commands.executeCommand('setContext', 'codemath.previewActive', true);
  };

  /**
   * Remove decoration and set activeDecoration to undefined
   *
   * @param activeEditor
   */
  const setInActiveDecoration = (activeEditor: vscode.TextEditor): void => {
    if (activeDecoration) {
      activeEditor.setDecorations(activeDecoration, []);
      activeDecoration = undefined;
      vscode.commands.executeCommand('setContext', 'codemath.previewActive', false);
    }
  };
  let result: string | number | null = null;

  // subscribe to onDidChangeTextDocument event
  const disposable = vscode.workspace.onDidChangeTextDocument(evnt => {

    try {

      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return;
      }

      const currentPosition = activeEditor.selection.active;
      const lineText = activeEditor.document.lineAt(currentPosition.line).text;

      if (lineText.length === 0 || !lineText.endsWith('=')) {
        setInActiveDecoration(activeEditor);
        return;
      }

      // Do calculate
      const expression = lineText.slice(0, -1);
      result = calculate(expression);

      // Remove previous decoration
      setInActiveDecoration(activeEditor);


      // Create range for create decoration
      const rangeStart = new vscode.Position(currentPosition.line, lineText.length - 1);
      const rangeEnd = new vscode.Position(currentPosition.line, lineText.length);
      const range = new vscode.Range(rangeStart, rangeEnd);

      // Set active decoration
      // Apply decoration to range
      setActiveDecoration(activeEditor, range, result);

      // Apply value of result to line after click Enter
      if ((evnt.contentChanges.some(change => change.text.includes('\n') || change.text.includes('\r'))) && result !== null) {
        const editor = activeEditor;
        const lineNum = editor.selection.active.line;
        const lineText = editor.document.lineAt(lineNum).text;

        const insertPos = new vscode.Position(lineNum, lineText.length);
        editor.edit(editBuilder => {
          editBuilder.insert(insertPos, `${result} `);
        }).then(() => {
          setInActiveDecoration(editor);
        });
      }

    } catch (error) {
      console.log("Unexpected func");
    }
  });

  const disposableTab = vscode.commands.registerCommand('codemath.applyResult', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !result) return;

    const pos = editor.selection.active;
    editor.edit(editBuilder => {
      editBuilder.insert(pos, `${result} `);
    }).then(() => {
      setInActiveDecoration(editor);
    });
  });

  const disposableCursor = vscode.window.onDidChangeTextEditorSelection(ev => {
    const editor = ev.textEditor;
    const pos = editor.selection.active;
    const lineText = editor.document.lineAt(pos.line).text;

    if (lineText.length === 0 || !lineText.endsWith('=')) {
      setInActiveDecoration(editor);
      return;
    }
    try {
      const lineNum = editor.selection.active.line;
      const rangeStart = new vscode.Position(lineNum, 0);
      const rangeEnd = new vscode.Position(lineNum, lineText.length);
      const range = new vscode.Range(rangeStart, rangeEnd);
      const expression = lineText.slice(0, -1);
      result = calculate(expression);

      if (lineText.endsWith('=') && result !== null) {
        setActiveDecoration(editor, range, result as number);
      } else {
        setInActiveDecoration(editor);
      }

    } catch (error) {
      console.log("Unexpected func");
    }
  });

  context.subscriptions.push(disposable, disposableTab, disposableCursor);
};

export default calculateCommands;