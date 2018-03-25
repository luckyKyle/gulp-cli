import { getWord, Person } from "./util";

(function(scope) {
  getWord("ccc");

  let person = new Person("aaa", 12);

  console.log(person.toString());
})();
