document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const stats = document.getElementById('total-todos');

    function updateStats() {
        const total = list.children.length;
        const completed = list.querySelectorAll('li.completed').length;
        stats.textContent = `${completed}/${total}件のタスク完了`;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const todoText = input.value.trim();
        if (todoText === '') return;

        const li = document.createElement('li');

        // チェックボックス作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed', checkbox.checked);
            updateStats();
        });

        // タスクテキスト
        const span = document.createElement('span');
        span.textContent = todoText;

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            li.remove();
            updateStats();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);

        input.value = '';
        updateStats();
    });

    updateStats();
});