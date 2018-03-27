export let getWord = function(val) {
    console.log(val + "我被调用了")
};

export class Person {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toString() {
        return (this.x + "的年龄是" + this.y + "岁")
    }
}