const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // pathモジュールを追加

const app = express();
const PORT = 3000;

// JSONボディを解析するためのミドルウェア
app.use(bodyParser.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// TODOタスクのサンプルデータ
let todos = [];

// TODOタスクを取得
app.get('/todos', (req, res) => {
    res.json(todos);
});

// TODOタスクの作成
app.post('/todos', (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        title: req.body.title,
        completed: req.body.completed || false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// TODOタスクの更新
app.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Task not found.');

    todo.title = req.body.title;
    todo.completed = req.body.completed;
    res.json(todo);
});

// TODOタスクの削除
app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) return res.status(404).send('Task not found.');

    todos.splice(todoIndex, 1);
    res.status(204).send();
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
