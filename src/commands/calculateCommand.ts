import * as vscode from 'vscode';
import calculate from '../handlers/calculate';


const calculateCommands = () => {

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
  const setActiveDecoration = (): void => {
    activeDecoration = decorationType;
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
    }
  };

  // subscribe to onDidChangeTextDocument event
  vscode.workspace.onDidChangeTextDocument(evnt => {

    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    const currentPosition = activeEditor.selection.active;
    const line = activeEditor.document.lineAt(currentPosition.line);
    const lineText = line.text;

    // Create range for create decoration
    const rangeStart = new vscode.Position(currentPosition.line, lineText.length - 1);
    const rangeEnd = new vscode.Position(currentPosition.line, lineText.length);
    const range = new vscode.Range(rangeStart, rangeEnd);

    if (!lineText.endsWith('=')) {
      setInActiveDecoration(activeEditor);
      return;
    }

    try {

      // Do calculate
      const expression = lineText.slice(0, -1);
      const result = calculate(expression);

      // Remove previous decoration
      setInActiveDecoration(activeEditor);

      // Set active decoration
      setActiveDecoration();

      // Apply decoration to range
      activeEditor.setDecorations(decorationType, [{
        range,
        renderOptions: {
          after: {
            contentText: `${result.toLocaleString()}`
          }
        }
      }]);

      // Apply value of result to line after click Enter
      if (evnt.contentChanges.some(change => change.text.includes('\n'))) {
        const editWorkspace = new vscode.WorkspaceEdit();
        const editRange = new vscode.Range(
          rangeStart.translate(0, 1),
          rangeEnd.translate(0, 1)
        );

        editWorkspace.insert(activeEditor.document.uri, editRange.start, `${result}`);
        vscode.workspace.applyEdit(editWorkspace);

        setInActiveDecoration(activeEditor);
      }

    } catch (error) {
      throw new Error("Unexpected func");
    }

  });
};

export default calculateCommands;