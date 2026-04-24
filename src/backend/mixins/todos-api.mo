import Debug "mo:core/Debug";
import List "mo:core/List";
import Types "../types/todos";
import TodoLib "../lib/todos";

mixin (
  todos : List.List<Types.Todo>,
  state : Types.State,
) {
  // ── Task CRUD ──────────────────────────────────────────────────────────────

  public func createTodo(input : Types.CreateTodoInput) : async Types.Todo {
    Debug.todo()
  };

  public query func getTodos() : async [Types.Todo] {
    Debug.todo()
  };

  public func updateTodo(input : Types.UpdateTodoInput) : async Bool {
    Debug.todo()
  };

  public func deleteTodo(id : Nat) : async Bool {
    Debug.todo()
  };

  // ── Subtask CRUD ───────────────────────────────────────────────────────────

  public func addSubtask(todoId : Nat, title : Text) : async Bool {
    Debug.todo()
  };

  public func toggleSubtask(todoId : Nat, subtaskId : Nat) : async Bool {
    Debug.todo()
  };

  public func deleteSubtask(todoId : Nat, subtaskId : Nat) : async Bool {
    Debug.todo()
  };

  // ── Bulk operations ────────────────────────────────────────────────────────

  public func deleteAllCompleted() : async Nat {
    Debug.todo()
  };

  public func markAllCompleted() : async () {
    Debug.todo()
  };

  // ── Categories ─────────────────────────────────────────────────────────────

  public query func getCategories() : async [Text] {
    Debug.todo()
  };

  // ── Reorder ────────────────────────────────────────────────────────────────

  public func reorderTodo(id : Nat, sortOrder : Nat) : async Bool {
    Debug.todo()
  };

  // ── Preferences ────────────────────────────────────────────────────────────

  public query func getPreferences() : async Types.UserPreferences {
    Debug.todo()
  };

  public func setDarkMode(enabled : Bool) : async () {
    Debug.todo()
  };
};
