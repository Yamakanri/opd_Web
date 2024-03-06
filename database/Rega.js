const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
