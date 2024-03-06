import mysql from "mysql2"; // хуйня
const bcrypt = require("bcrypt"); // хуйня
const saltRounds = 10;

function registerUser() {
    // Получаем данные из полей ввода
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

function registration(connection, name, surname, login, passw) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT login FROM users WHERE login = ?", [login], async function (err, rows) {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length > 0) {
                console.log("Пользователь уже существует.");
                reject("Пользователь уже существует.");
                return;
            }

            try {
                const salt = await generateSalt();
                const hashedPassword = await hashPassword(passw, salt);

                connection.query(
                    "INSERT INTO users (name, surname, login, passw, salt, hashed) VALUES (?, ?, ?, ?, ?, ?)",
                    [name, surname, login, passw, salt, hashedPassword],
                    function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        console.log("Рега завершена!");
                        resolve(result);
                    }
                );
            } catch (error) {
                reject(error);
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