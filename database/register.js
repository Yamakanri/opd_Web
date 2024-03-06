import mysql from "mysql2"; // хуйня
// const bcrypt = require("bcrypt"); // хуйня
const saltRounds = 10;

function registerUser() {
    const name = document.querySelector('.name_form').value;
    const surname = document.querySelector('.surname_form').value;
    const login = document.querySelector('.login_form').value;
    const password = document.querySelector('.password_form').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            surname,
            login,
            password,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "opd_web"
});

function registration(connection, login, password, name, surname) {
    connection.connect(function (err) {
        if (err) throw err;

        // Проверяем, существует ли пользователь с таким логином
        connection.query("SELECT login FROM users WHERE login = ?", [login], function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                console.log("User already exists!");
            } else {
                // Если пользователя с таким логином нет, добавляем новую запись в базу данных
                connection.query("INSERT INTO users (login, password, name, surname, salt, hash, permission) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [login, password, name, surname, 'your_salt_value', 'your_hash_value', false],
                    function (err, result) {
                        if (err) throw err;
                        console.log("Registration success!");
                    });
            }
        });
    });
}



function generateSalt() {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                reject(err);
            } else {
                resolve(salt);
            }
        });
    });
}

function hashPassword(passw, salt) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(passw, salt, function (err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}