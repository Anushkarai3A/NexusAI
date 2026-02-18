import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, setCode, language = 'javascript' }) {
    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
        <div className="h-full w-full overflow-hidden flex flex-col">
            <Editor
                height="100%"
                width="100%"
                language={language}
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                    padding: { top: 20, bottom: 20 },
                    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                    backgroundColor: '#1a1a1a'
                }}
            />
        </div>
    );
}
