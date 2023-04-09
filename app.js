//const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://era-task-scheduler.onrender.com'
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');

let tasks = [];

async function addTask(title, description) {
    const task = { title, description };
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('Failed to add task');
        const data = await response.json();
        tasks.push(data);
        displayAlert(`Task: "${data.title}" added successfully`, 'success-msg');
        displayTasks();
    } catch (error) {
        displayAlert(`Error: ${error.message}`, 'error-msg');
    }
}

function displayTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task');
        const taskTitle = document.createElement('h2');
        taskTitle.textContent = task.title;
        taskTitle.addEventListener('click', () => {
            container2.style.display = 'block';
        });
        taskTitle.style.overflowWrap = 'break-word';
        if (task.done == true) {
          taskTitle.style.textDecoration = 'line-through';
        }
    

        
        const viewDetails = document.createElement('div');
        viewDetails.textContent = 'View Details';
        viewDetails.style.color="red"
        viewDetails.classList.add('my-link')
        viewDetails.style.display = 'block';
        viewDetails.addEventListener('click', function() {
          if (container2.style.display == 'none'){
            container2.style.display = 'block';
            viewDetails.textContent = 'Hide Details';
            viewDetails.style.color="green"
          }else if  (container2.style.display !== 'none'){
            container2.style.display = 'none'
            viewDetails.textContent = 'View Details';
            viewDetails.style.color="red"
          }          
        });        

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;
        const container2 = document.createElement('div');
        container2.classList.add('task-des');
        container2.appendChild(taskDescription);
        container2.style.display = 'none';
        
        taskDescription.style.overflowWrap = 'break-word';
        const taskCheckbox = document.createElement('input');
        taskCheckbox.setAttribute('type', 'checkbox');
        taskCheckbox.checked = task.done;
        taskCheckbox.style.display = 'inline-block';
        taskCheckbox.addEventListener('change', () => {
            updateTask(task.id, { done: !task.done }, 'Status');
            if (taskCheckbox.checked==true){
              //alert("ok")
              //taskTitle.style.textDecoration = 'line-through';
            }
        });

        



        const taskLabel = document.createElement('label');
        taskLabel.textContent = 'Task Complete: ';
        taskLabel.style.display = 'inline-block';
        const container = document.createElement('div');
        container.appendChild(taskLabel);
        container.appendChild(taskCheckbox);
        const editButton = createButton('Edit', 'btn-edit', () => editTask(task));
        const deleteButton = createButton('Delete', 'btn-danger', () => deleteTask(task.id));
        taskItem.appendChild(container);
        taskItem.appendChild(taskTitle);        
        taskItem.appendChild(viewDetails);
        taskItem.appendChild(container2);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });
}

function createButton(text, id, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('id', id);
    button.style.borderRadius = '5px';
    button.addEventListener('click', onClick);
    return button;
}

async function editTask(task) {
    const title = prompt('Enter task title', task.title);
    const description = prompt('Enter task description', task.description);
    if (title || description) {
        try {
            await updateTask(task.id, { title: title || task.title, description: description || task.description }, 'Edit');
            displayAlert('Task updated successfully','success-msg');
        } catch (error) {
            displayAlert(`Error: ${error.message}`,'error-msg');
        }
    }
}

const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      tasks = tasks.filter((task) => task.id !== id);
      displayTasks();
    } catch (error) {
      console.error(error);
    }
  };

async function updateTask(id, data, resType) {
  if (resType === 'Edit') {
   await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response =>  response.json())
      .then(updatedTask => {
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        tasks[index] = updatedTask;
        displayTasks();
      })
      .catch(error => {
        console.error(error);
        displayAlert('Failed to update task.','error-msg');
      });
  } else if (resType === 'Status') {
    fetch(`${API_URL}/tasks-com/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response =>  response.json())
      .then(updatedTask => {
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        tasks[index] = updatedTask;
        displayTasks();
      })
      .catch(error => {
        //console.error(error);
        displayAlert('Failed to update task status.','error-msg');
      });
  }
}

const getTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      tasks = data;
      displayTasks();
    } catch (error) {
      console.error(error);
    }
  };


taskForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.querySelector('#task-title').value.trim();
    const description = document.querySelector('#task-description').value.trim();
  
    if (title && description) {
      addTask(title, description);
      taskForm.reset();
    }
  });
  
 
const textarea = document.getElementById('task-title');
textarea.addEventListener('input', function() {
    let words = textarea.value.split(' ');
    if (words.length > 25) {
      words = words.slice(0, 25);
      textarea.value = words.join(' ');
      alert('Maximum number of words reached.');
    }
  });

function displayAlert(message,msgType) {
  const alert = document.getElementById('msgcontainer');
  if (msgType=='success-msg'){
    alert.classList.add('custom-alert-green');
  }else if (msgType=='error-msg'){
    alert.classList.add('custom-alert-red');
  }
  
  alert.textContent = message;
  //alert.style.display = 'block';
  alert.style.display = 'inline-block';
  setTimeout(() => {
    alert.textContent = '';
    alert.style.display = 'none';
  }, 3000);
}
getTasks() 



//const validateTextarea = ()
