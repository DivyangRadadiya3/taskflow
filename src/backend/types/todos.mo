module {
  public type Priority = { #low; #medium; #high };

  public type Subtask = {
    id : Nat;
    title : Text;
    completed : Bool;
  };

  public type Todo = {
    id : Nat;
    title : Text;
    description : Text;
    priority : Priority;
    dueDate : ?Int;
    category : ?Text;
    completed : Bool;
    createdAt : Int;
    sortOrder : Nat;
    subtasks : [Subtask];
  };

  public type CreateTodoInput = {
    title : Text;
    description : Text;
    priority : Priority;
    dueDate : ?Int;
    category : ?Text;
    sortOrder : Nat;
  };

  public type UpdateTodoInput = {
    id : Nat;
    title : Text;
    description : Text;
    priority : Priority;
    dueDate : ?Int;
    category : ?Text;
    completed : Bool;
    sortOrder : Nat;
  };

  public type UserPreferences = {
    darkMode : Bool;
  };

  public type State = {
    var nextTodoId : Nat;
    var nextSubtaskId : Nat;
    var preferences : UserPreferences;
  };
};
