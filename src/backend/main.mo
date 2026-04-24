import List "mo:core/List";
import Types "types/todos";
import TodosMixin "mixins/todos-api";

actor {
  let todos = List.empty<Types.Todo>();
  let state : Types.State = {
    var nextTodoId = 1;
    var nextSubtaskId = 1;
    var preferences = { darkMode = false };
  };

  include TodosMixin(todos, state);
};
