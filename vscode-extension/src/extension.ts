import * as vscode from 'vscode';
import { generateDocumentation } from '../../src/utils/documentationGenerator';

export function activate(context: vscode.ExtensionContext) {
    let currentPanel: vscode.WebviewPanel | undefined = undefined;

    let disposable = vscode.commands.registerCommand('ai-docs-generator.generateDocs', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const code = document.getText();

        // Create and show panel
        if (!currentPanel) {
            currentPanel = vscode.window.createWebviewPanel(
                'aiDocsGenerator',
                'AI Documentation',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, 'media')
                    ]
                }
            );

            currentPanel.onDidDispose(
                () => {
                    currentPanel = undefined;
                },
                null,
                context.subscriptions
            );
        }

        try {
            // Show loading state
            currentPanel.webview.html = getWebviewContent('Generating documentation...', context.extensionUri);

            // Get API key from VS Code settings
            const config = vscode.workspace.getConfiguration('aiDocsGenerator');
            const apiKey = config.get<string>('apiKey');
            
            if (!apiKey) {
                throw new Error('API key not configured. Please set it in VS Code settings.');
            }

            // Store API key in localStorage-like storage
            context.globalState.update('groq_api_key', apiKey);

            // Generate documentation
            const documentation = await generateDocumentation(code, 'groq', 'detailed');

            // Update webview content
            currentPanel.webview.html = getWebviewContent(documentation, context.extensionUri);
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Failed to generate documentation: ${error.message}`);
            }
            if (currentPanel) {
                currentPanel.webview.html = getWebviewContent('Failed to generate documentation. Please check your API configuration.', context.extensionUri);
            }
        }
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(content: string, extensionUri: vscode.Uri) {
    const tailwindCss = vscode.Uri.joinPath(extensionUri, 'media', 'tailwind.min.css');

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Documentation</title>
        <link href="${tailwindCss}" rel="stylesheet">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                padding: 20px;
                line-height: 1.6;
                color: var(--vscode-editor-foreground);
                background-color: var(--vscode-editor-background);
            }
            pre {
                background-color: var(--vscode-editor-inactiveSelectionBackground);
                padding: 15px;
                border-radius: 4px;
                overflow-x: auto;
            }
            code {
                font-family: var(--vscode-editor-font-family);
            }
            .documentation {
                max-width: 800px;
                margin: 0 auto;
            }
            h1, h2, h3 {
                color: var(--vscode-editor-foreground);
            }
        </style>
    </head>
    <body>
        <div class="documentation prose prose-invert max-w-none">
            ${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>
    </body>
    </html>`;
}

export function deactivate() {}