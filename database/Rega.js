require(['mysql2'], function(mysql) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "mysql",
        database: "opd_web"
    });
    connection.connect(function(err){
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        else{
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    });
    connection.end(function(err) {
        if (err) {
            return console.log("Ошибка: " + err.message);
        }
        console.log("Подключение закрыто");
    });
}); // хуйня

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "mysql",
//     database: "opd_web"
// });
// connection.connect(function(err){
//     if (err) {
//         return console.error("Ошибка: " + err.message);
//     }
//     else{
//         console.log("Подключение к серверу MySQL успешно установлено");
//     }
// });
// connection.end(function(err) {
//     if (err) {
//         return console.log("Ошибка: " + err.message);
//     }
//     console.log("Подключение закрыто");
// });