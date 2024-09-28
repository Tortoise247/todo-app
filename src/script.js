document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('task-list');

    // ローカルストレージからタスクを読み込む
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });

    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault(); // デフォルトのフォーム送信を防ぐ

        const input = document.getElementById('input');
        const task = input.value;

        if (task) {
            addTaskToDOM(task, false);
            saveTaskToLocalStorage(task, false);
            input.value = ''; // 入力フィールドをクリア
        }
    });

    function addTaskToDOM(taskText, completed) {
        const listItem = document.createElement('li');

        // チェックボックスを作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                listItem.style.textDecoration = 'line-through'; // タスクを完了としてマーク
            } else {
                listItem.style.textDecoration = 'none'; // タスクの完了マークを解除
            }
            updateTaskInLocalStorage(taskText, checkbox.checked);
        });

        // タスクテキストを追加
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = taskText;

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(listItem);
            removeTaskFromLocalStorage(taskText);
        });

        // listItemにチェックボックス、タスクテキスト、削除ボタンを追加
        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextElement);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);

        // 初期状態のスタイルを設定
        if (completed) {
            listItem.style.textDecoration = 'line-through';
        }
    }

    function saveTaskToLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, completed: completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.text === taskText);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromLocalStorage(taskText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});