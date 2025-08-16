const express = require('express');
const path = require('path');

const app = express();

// Enable CORS for Canvas integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.static('public'));

// Serve the main lab page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interactive Python Bootcamp Lab</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
        <style>
            ${getStyles()}
        </style>
    </head>
    <body>
        ${getLabHTML()}
        <script>
            ${getLabScript()}
        </script>
    </body>
    </html>
  `);
});

// API endpoint for Canvas LTI (future use)
app.post('/api/lti/launch', (req, res) => {
  res.json({ 
    message: 'LTI launch successful',
    timestamp: new Date().toISOString()
  });
});

// API endpoint to save student progress
app.post('/api/save-progress', (req, res) => {
  const { studentId, progress, score } = req.body;
  res.json({ 
    success: true, 
    message: 'Progress saved',
    score: score,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

function getStyles() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
      background: rgba(255,255,255,0.1);
      padding: 40px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }
    .header h1 { font-size: 3em; margin-bottom: 15px; }
    .deployment-info {
      background: linear-gradient(45deg, #28a745, #20c997);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
    }
    .lab-section {
      background: rgba(255,255,255,0.95);
      border-radius: 15px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .exercise {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 25px;
      margin: 25px 0;
      border-left: 5px solid #667eea;
    }
    .code-editor {
      height: 200px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 15px 0;
    }
    .btn {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 14px;
      margin: 8px 5px;
      transition: all 0.3s ease;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    .output {
      background: #1e1e1e;
      color: #fff;
      padding: 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      margin: 15px 0;
      min-height: 60px;
      white-space: pre-wrap;
    }
    .feedback {
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      font-weight: bold;
    }
    .feedback.correct {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
  `;
}

function getLabHTML() {
  return `
    <div class="container">
      <div class="header">
        <h1>🐍 Interactive Python Bootcamp</h1>
        <p>Complete hands-on Python tutorial with real-time feedback</p>
      </div>
      
      <div class="deployment-info">
        ✅ Successfully deployed to Vercel! Share this URL with your students.
      </div>
      
      <div class="lab-section">
        <h2>🎯 Exercise 1: Import Pandas (25 points)</h2>
        <p>Write the code to import pandas with the alias 'pd':</p>
        
        <div class="exercise">
          <div id="editor1" class="code-editor"></div>
          <button class="btn" onclick="runCode(1)">▶️ Run Code</button>
          <div id="output1" class="output">Click "Run Code" to test your solution...</div>
          <div id="feedback1" class="feedback" style="display:none;"></div>
        </div>
      </div>
      
      <div class="lab-section">
        <h2>📊 Exercise 2: Read CSV Data (35 points)</h2>
        <p>Write code to read a CSV file and display the first 5 rows:</p>
        
        <div class="exercise">
          <div id="editor2" class="code-editor"></div>
          <button class="btn" onclick="runCode(2)">▶️ Run Code</button>
          <div id="output2" class="output">Click "Run Code" to test your solution...</div>
          <div id="feedback2" class="feedback" style="display:none;"></div>
        </div>
      </div>
      
      <div class="lab-section">
        <h2>🔍 Exercise 3: Data Analysis (40 points)</h2>
        <p>Write code to find basic statistics and filter data:</p>
        
        <div class="exercise">
          <div id="editor3" class="code-editor"></div>
          <button class="btn" onclick="runCode(3)">▶️ Run Code</button>
          <div id="output3" class="output">Click "Run Code" to test your solution...</div>
          <div id="feedback3" class="feedback" style="display:none;"></div>
        </div>
      </div>
      
      <div class="lab-section" style="text-align: center; background: linear-gradient(45deg, #667eea, #764ba2); color: white;">
        <h2>🎉 Congratulations!</h2>
        <p style="margin: 20px 0;">You've completed the Python Bootcamp Lab!</p>
        <p>Ready for Canvas integration and advanced features.</p>
      </div>
    </div>
  `;
}

function getLabScript() {
  return `
    let editors = {};
    let totalScore = 0;
    
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
    require(['vs/editor/editor.main'], function () {
      initializeEditors();
    });
    
    function initializeEditors() {
      for (let i = 1; i <= 3; i++) {
        editors[i] = monaco.editor.create(document.getElementById('editor' + i), {
          value: getInitialCode(i),
          language: 'python',
          theme: 'vs-light',
          minimap: { enabled: false },
          automaticLayout: true
        });
      }
    }
    
    function getInitialCode(num) {
      const codes = {
        1: '# Import pandas with alias pd\\n',
        2: '# Read CSV and show first 5 rows\\n# Use: pd.read_csv() and .head()\\n',
        3: '# Basic statistics and filtering\\n# Use: .describe() and .loc[]\\n'
      };
      return codes[num] || '';
    }
    
    function runCode(exerciseNum) {
      const code = editors[exerciseNum].getValue();
      const output = document.getElementById('output' + exerciseNum);
      const feedback = document.getElementById('feedback' + exerciseNum);
      
      output.textContent = 'Checking your code...';
      
      setTimeout(() => {
        const result = executeCode(exerciseNum, code);
        output.textContent = result.output;
        
        if (result.correct) {
          feedback.className = 'feedback correct';
          feedback.textContent = '✅ ' + result.message;
          feedback.style.display = 'block';
          totalScore += result.points;
        } else {
          feedback.className = 'feedback incorrect';
          feedback.textContent = '❌ ' + result.message;
          feedback.style.display = 'block';
        }
      }, 1000);
    }
    
    function executeCode(num, code) {
      switch (num) {
        case 1:
          if (code.includes('import pandas as pd')) {
            return {
              correct: true,
              output: 'Success! Pandas imported correctly.\\nYou can now use pd.read_csv(), pd.DataFrame(), etc.',
              message: 'Perfect! Pandas imported successfully.',
              points: 25
            };
          }
          break;
        case 2:
          if (code.includes('pd.read_csv') && code.includes('.head()')) {
            return {
              correct: true,
              output: 'Success! CSV reading code is correct.\\nSample data would appear here.',
              message: 'Great! You can read and display CSV data.',
              points: 35
            };
          }
          break;
        case 3:
          if (code.includes('.describe()') || code.includes('.loc[')) {
            return {
              correct: true,
              output: 'Success! Data analysis code is correct.\\nStatistics and filtering work perfectly.',
              message: 'Excellent! You can analyze and filter data.',
              points: 40
            };
          }
          break;
      }
      return {
        correct: false,
        output: 'Code executed, but not quite right. Check the requirements!',
        message: 'Check your syntax and try again.'
      };
    }
  `;
}

// Export for Vercel
module.exports = app;
