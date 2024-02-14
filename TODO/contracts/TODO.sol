// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract TodoContract {
    struct Todo {
        string title;
        string description;
        bool isDone;
    }

    Todo[] public todos;

    event TodoCreated(string title, string description);
    event TodoUpdated(string newTitle, string newDescription);
    event TodoDeleted();

    function createTODO(string memory _title, string memory _description) public {
        todos.push(Todo(_title, _description, false));
        

        emit TodoCreated(_title, _description);
    }

    function getTODO() public view returns (Todo[] memory) {
        return todos;
    }

    function toggleIsDone(uint _index) public {
        require(_index < todos.length, "invalid index");
        // check if the todo is marked as isDone
        require(todos[_index].isDone, "This item isn't done yet");
        // toggle the isDone status
        todos[_index].isDone = !todos[_index].isDone;
    }

    function updateTodo(uint _index, string memory newTitle, string memory newDescription) external {
        require(_index < todos.length, "invalid index");
        todos.push(Todo(newTitle, newDescription, true));
        todos[_index].title = newTitle;
        todos[_index].description = newDescription;
        emit TodoUpdated(newTitle, newDescription);
    }

    function deleteTodo(uint _index) external {
        require(_index < todos.length, "invalid index");
        emit TodoDeleted(_index);
        delete todos(_index);
    }
}