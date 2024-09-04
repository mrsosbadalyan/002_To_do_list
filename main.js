window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        const task_el = document.createElement('div');
        task_el.classList.add('task');
        task_el.setAttribute('draggable', 'true');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = task;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');
        
        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_done_el = document.createElement('button');
        task_done_el.classList.add('done');
        task_done_el.innerText = 'Done';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_done_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        // Insert new task at the beginning of the list
        list_el.insertBefore(task_el, list_el.firstChild);

        input.value = '';

        task_edit_el.addEventListener('click', (e) => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
            }
        });

        task_done_el.addEventListener('click', (e) => {
            task_el.classList.toggle('completed');
            moveTaskToBottom(task_el);
        });

        task_done_el.addEventListener('click', (e) => {
            if (task_done_el.innerText.toLowerCase() == "done") {
                task_el.classList.add('completed');
                task_done_el.innerText = "Undo";
                moveTaskToBottom(task_el);
            } else {
                task_el.classList.remove('completed');
                task_done_el.innerText = "Done";
                moveTaskToTop(task_el);
            }
        });

        task_delete_el.addEventListener('click', (e) => {
            list_el.removeChild(task_el);
        });

        // Drag and Drop Logic
        task_el.addEventListener('dragstart', () => {
            task_el.classList.add('dragging');
        });

        task_el.addEventListener('dragend', () => {
            task_el.classList.remove('dragging');
        });

        list_el.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(list_el, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (afterElement == null) {
                list_el.appendChild(dragging);
            } else {
                list_el.insertBefore(dragging, afterElement);
            }
        });

        // Helper function to determine the position to insert the dragging element
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        // Function to move completed tasks to the bottom of the list
        function moveTaskToBottom(task) {
            if (task.classList.contains('completed')) {
                list_el.removeChild(task);
                list_el.appendChild(task);
            }
        }

        // Function to move undod tasks that are no completed any mor to top of the list
        function moveTaskToTop(task) {
            if (!task.classList.contains('completed')) {
                list_el.removeChild(task);
                list_el.insertBefore(task, list_el.firstChild);
            }
        }
    });
});
