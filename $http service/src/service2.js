app.service('demoService', function () {
    "use strict";

    var privateAuthor = {              //私有变量
        name: 'jack',
        sex: 'male'
    }

    this.publicAuthor = {        //共有变量
        name: 'rose',
        sex: 'female'
    }

    this.getPriAuthor = function () {          //获取私有变量
        return publicAuthor;
    }
});