import Debug "mo:core/Debug";
import List "mo:core/List";
import Types "../types/todos";

module {
  public type Todo = Types.Todo;
  public type Subtask = Types.Subtask;
  public type CreateTodoInput = Types.CreateTodoInput;
  public type UpdateTodoInput = Types.UpdateTodoInput;
  public type UserPreferences = Types.UserPreferences;

  /// Returns next available ID for a todo
  public func nextId(todos : List.List<Todo>) : Nat {
    Debug.todo()
  };

  /// Create a new Todo from input, assigning id and createdAt
  public func create(todos : List.List<Todo>, input : CreateTodoInput, id : Nat, createdAt : Int) : Todo {
    Debug.todo()
  };

  /// Get all todos as an immutable array
  public func getAll(todos : List.List<Todo>) : [Todo] {
    Debug.todo()
  };

  /// Find a todo by id
  public func findById(todos : List.List<Todo>, id : Nat) : ?Todo {
    Debug.todo()
  };

  /// Update a todo in the list; returns false if not found
  public func update(todos : List.List<Todo>, input : UpdateTodoInput) : Bool {
    Debug.todo()
  };

  /// Delete a todo by id; returns false if not found
  public func delete(todos : List.List<Todo>, id : Nat) : Bool {
    Debug.todo()
  };

  /// Delete all completed todos; returns count deleted
  public func deleteAllCompleted(todos : List.List<Todo>) : Nat {
    Debug.todo()
  };

  /// Mark all todos as completed
  public func markAllCompleted(todos : List.List<Todo>) : () {
    Debug.todo()
  };

  /// Get all unique categories across all todos
  public func getCategories(todos : List.List<Todo>) : [Text] {
    Debug.todo()
  };

  /// Update the sort order of a specific todo
  public func updateSortOrder(todos : List.List<Todo>, id : Nat, sortOrder : Nat) : Bool {
    Debug.todo()
  };

  /// Add a subtask to a todo; returns false if todo not found
  public func addSubtask(todos : List.List<Todo>, todoId : Nat, title : Text, subtaskId : Nat) : Bool {
    Debug.todo()
  };

  /// Toggle a subtask's completed status; returns false if not found
  public func toggleSubtask(todos : List.List<Todo>, todoId : Nat, subtaskId : Nat) : Bool {
    Debug.todo()
  };

  /// Delete a subtask from a todo; returns false if not found
  public func deleteSubtask(todos : List.List<Todo>, todoId : Nat, subtaskId : Nat) : Bool {
    Debug.todo()
  };
};
