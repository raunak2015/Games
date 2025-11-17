// //DOM elements


var todoList = []
var comdoList = [];
var remList = [];
var addButton = document.getElementById("add-button")
var todoInput = document.getElementById("todo-input")
var deleteAllButton = document.getElementById("delete-all")
var allTodos = document.getElementById("all-todos");
var deleteSButton = document.getElementById("delete-selected")

function updateList(){
    var complete = todoList.filter((data)=>{
        if(data.complete == true){
            return data;
        }
    })

    remList = todoList.filter((data)=>{
        if(data.complete == false){
            return data;
        }
    })

    document.querySelector('#c-count').textContent = comdoList.length;
}


//event listners for add and delete
function addTask(){
    var task = todoInput.value;

    if(task == " "){
        alert("Content is compulsary and no empty content is allowed");
    }
    // each task -> resce........
    todoList.push({
        content : task,
        id : Date.now().toString(),
        complete : false
    });

    todoList.forEach((data)=>{
        console.log(data);
    });

    document.querySelector('#r-count').textContent = todoList.length;

    updateList(); // 
}

addButton.addEventListener('click', addTask);

todoInput.addEventListener('keypress', (event)=>{
    if(event.key === 'Enter'){
        addTask();
    }
})