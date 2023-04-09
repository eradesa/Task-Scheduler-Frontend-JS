const API_URL = 'http://127.0.0.1:8000';

const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');

let tasks = [];

function addTask(title, description) {
 
  const task = {
    title,
    description
    //completed: false
  };

  //-------
  // POST request using fetch with error handling
//const element = document.querySelector('#post-request-error-handling .article-id');
const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
};
console.log(task);
fetch(`${API_URL}/tasks`, requestOptions)
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();
        tasks.push(data);
        displayTasks();
        // check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
        //document.getElementById ("message").style.display="block"
        //document.getElementById ("message").innerHTML=`Task ${data.title} added successfully`
        //element.innerHTML = data.id;

        // Call the function with your custom message
        displayAlert(`Task:"${data.title}" added successfully`);

    })
    
    .catch(error => {
        document.getElementById ("message").innerHTML=`Error: ${error}`;
        //element.parentElement.innerHTML = `Error: ${error}`;
        console.error('There was an error!', error);
    });


  /*fetch(`${API_URL}/tasks`, requestOptions)
    .then(response => response.json())
    .then(data => {
      tasks.push(data);
      console.log (data.JSON);
      //displayTasks();
    }
    );*/


}


function displayTasks() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');

    //const taskDiv1 = document.createElement('div');
    const taskLabel = document.createElement('label');
    taskLabel.textContent = 'Task Complete: ';
    taskLabel.style.display = 'inline-block';

    const taskCheckbox = document.createElement('input');
    taskCheckbox.setAttribute('type', 'checkbox');
    taskCheckbox.checked = task.done;
    taskCheckbox.style.display = 'inline-block';
    taskCheckbox.addEventListener('change', () => {
      updateTask(task.id, {
        done: !task.done
      },"Status");
    });   

    // Add the label and checkbox elements to the container element
    const container = document.createElement('div');
    container.appendChild(taskLabel);
    container.appendChild(taskCheckbox);
    
    const taskTitle = document.createElement('h2');
    taskTitle.textContent = task.title;
    taskTitle.addEventListener('click', function() {
      container2.style.display = 'block';
    });
    taskTitle.style.overflowWrap = 'break-word';
  
//--------------------
    const taskDescription = document.createElement('p');
    taskDescription.textContent = task.description;
    const container2 = document.createElement('div');
    container2.classList.add('task-des');
    container2.appendChild(taskDescription);
    container2.style.display = 'none';
    container2.addEventListener('click', function() {
      container2.style.display = 'none';
    });
    taskDescription.style.overflowWrap = 'break-word';

  

//---------------
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    
    // Set styles for button
    //editButton.style.backgroundColor = 'blue'; // Set background color to blue
    //editButton.style.color = 'white'; // Set text color to white
    editButton.style.borderRadius = '5px'; // Set border radius to 5 pixels
    //editButton.style.padding = '5px 20px'; // Set padding to 10 pixels top/bottom and 20 pixels left/right
    editButton.setAttribute('id', 'btn-edit');
    editButton.addEventListener('click', () => {
      editTask(task);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('id', 'btn-danger');
    deleteButton.style.borderRadius = '5px'; // Set border radius to 5 pixels
    deleteButton.addEventListener('click', () => {
      deleteTask(task.id);
    });
    //taskItem.appendChild(taskLabel);
    //taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(container);
    taskItem.appendChild(taskTitle);
    //taskItem.appendChild(taskDescription);
    taskItem.appendChild(container2);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  });
}

function editTask(task) {
  const title = prompt('Enter task title', task.title);
  const description = prompt('Enter task description', task.description);

  if (title || description) {
    updateTask(task.id, {
      title: title || task.title,
      description: description || task.description
      //completed: task.completed
    }, "Edit");
  }
}

function deleteTask(id) {
  fetch(`${API_URL}/tasks/${id}`, {
    //mode: 'no-cors',
    method: 'DELETE'
  })
    .then(() => {
      tasks = tasks.filter(task => task.id !== id);
      displayTasks();
    });
}

function updateTask(id, data, resType) {
  console.log(data);
  if (resType=="Edit"){
    fetch(`${API_URL}/tasks/${id}`, {
      //mode: 'no-cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(updatedTask => {
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        tasks[index] = updatedTask;
        displayTasks();
      });
    }
  else if (resType=="Status"){
    fetch(`${API_URL}/tasks-com/${id}`, {
      //mode: 'no-cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(updatedTask => {
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        tasks[index] = updatedTask;
        displayTasks();
      });
  }
}

function getTasks() {
  fetch(`${API_URL}/tasks`
  //{mode: 'no-cors',}
  )
    .then(response => response.json())
    .then(data => {
      tasks = data;
      displayTasks();
    });
}


const textarea = document.getElementById('task-title');

textarea.addEventListener('input', function() {
  let words = textarea.value.split(' ');
  if (words.length > 15) {
    words = words.slice(0, 15);
    textarea.value = words.join(' ');
    alert('Maximum number of words reached.');
  }
});


taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = document.querySelector('#task-title').value.trim();
  const description = document.querySelector('#task-description').value.trim();

  if (title && description) {
    addTask(title, description);
    taskForm.reset();
  }
});

getTasks();


function displayAlert(message) {
  const alert = document.getElementById('msgcontainer');
  //alert.classList.add('custom-alert');
  alert.style.display = 'block';
  alert.textContent = message;

  //const targetElement = document.querySelector('#form-group');
 
  //document.body.insertBefore(alert, targetElement);

  setTimeout(function() {
    alert.textContent = '';
    alert.style.display = 'none';
  }, 3000);
}

