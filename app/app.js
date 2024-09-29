// タスク一覧を取得して表示する関数
async function fetchTasks() {
    try {
        const response = await fetch(`http://localhost:3000/todos`);
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // 現在のリストをクリア

        // タスクをリストに追加
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.textContent = `${task.id}: ${task.title} (Completed: ${task.completed})`;
            

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.addEventListener('click', async function() {
                try {
                    const response = await fetch(`http://localhost:3000/todos/${task._id}`, {
                        method: 'DELETE'
                    });
        
                    if (response.ok) {
                        taskList.removeChild(listItem);
                        document.getElementById('responseMessage').innerText = `Task deleted successfully: ${task.title}`;
                    } else {
                        const data = await response.json();
                        document.getElementById('responseMessage').innerText = `Error: ${data.message}`;
                    }
                } catch (error) {
                    document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
                }
            });
        
            // listItemに削除ボタンを追加
            listItem.appendChild(deleteButton);



            taskList.appendChild(listItem);
        });
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
}

// 新しいタスク追加用のフォーム送信処理
document.getElementById('addForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    const newTitle = document.getElementById('newTitle').value;

    // APIへのPOSTリクエスト
    try {
        const response = await fetch(`http://localhost:3000/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                completed: false // 新しいタスクは未完了として追加
            })
        });

        const data = await response.json();

        // レスポンスメッセージを表示
        if (response.ok) {
            document.getElementById('responseMessage').innerText = `Task added successfully: ${JSON.stringify(data)}`;
            addTaskToDOM(data); // タスクをDOMに追加
            fetchTasks(); // タスクを再取得して表示を更新
        } else {
            document.getElementById('responseMessage').innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
});

// タスクをDOMに追加する関数
function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');
    const listItem = document.createElement('li');
    listItem.textContent = task.title;

    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', async function() {
        try {
            const response = await fetch(`http://localhost:3000/todos/${task._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                taskList.removeChild(listItem);
                document.getElementById('responseMessage').innerText = `Task deleted successfully: ${task.title}`;
            } else {
                const data = await response.json();
                document.getElementById('responseMessage').innerText = `Error: ${data.message}`;
            }
        } catch (error) {
            document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
        }
    });

    // listItemに削除ボタンを追加
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

// タスク更新用のフォーム送信処理
document.getElementById('updateForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const completed = document.getElementById('completed').checked;

    // APIへのPUTリクエスト
    try {
        const response = await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                completed: completed
            })
        });

        const data = await response.json();

        // レスポンスメッセージを表示
        if (response.ok) {
            document.getElementById('responseMessage').innerText = `Task updated successfully: ${JSON.stringify(data)}`;
            fetchTasks(); // タスクを再取得して表示を更新
        } else {
            document.getElementById('responseMessage').innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
});

// Fetch Tasksボタンのクリックイベント
document.getElementById('fetchTasksButton').addEventListener('click', fetchTasks);

// ページ読み込み時にタスクを取得して表示
window.onload = fetchTasks;
