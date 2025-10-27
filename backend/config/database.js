import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'navi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

async function getConnection() {
    return pool.getConnection()
}

//Função para ler todos os registros
async function readAll(table, where = null) {
    const connection = await getConnection()
    try {
        let sql = `select *from ${table}`
        if (where) {
            sql += ` where ${where}`
        }

        const [rows] = await connection.execute(sql)
        return rows
    } catch (err) {
        console.error('Não foi possível ler os registros: ', err)
        throw err
    } finally {
        connection.release()
    }

}

//Função para ler um registro especifico
async function read(table, where) {
    const connection = await getConnection()
    try {
        let sql = `select *from ${table}`
        if (where) {
            sql += ` where ${where}`
        }

        const [rows] = await connection.execute(sql)
        return rows[0] || null
    } catch (err) {
        console.error('Não foi possível ler os registros: ', err)
        throw err
    } finally {
        connection.release()
    }
}

//Funcao para inserir dados
async function create(table, data) {
    const connection = await getConnection();
    try {
        const columns = Object.keys(data).join(', ')

        const placeholders = Array(Object.keys(data).length).fill('?').join(', ')

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`

        const values = Object.values(data)

        const [result] = await connection.execute(sql, values)

        return result.insertId
    } catch (err) {
        console.error('Não foi possível ler os registros: ', err)
        throw err
    } finally {
        connection.release()
    }
}

//Função para atualizar um registro
async function update(table, data, where) {
    const connection = await getConnection()
    try {
        const set = Object.keys(data).map(column => `${column} = ?`).join(', ')

        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`

        const values = Object.values(data)
        const [result] = await connection.execute(sql, [...values])

        return result.affectedRows
    } catch (err) {
        console.error('Não foi possível ler os registros: ', err)
        throw err
    } finally {
        connection.release()
    }
}

//Função para excluir um registro
async function deleteRecord(table, where) {
    const connection = await getConnection()

    try {
        const sql = `DELETE FROM ${table} WHERE ${where}`
        const [result] = await connection.execute(sql)
        if (result.affectedRows === 0) {
            throw new Error('Registro não encontrado')
        }
        return result.affectedRows
    } catch (err) {
        console.error('Não foi possível ler os registros: ', err)
        throw err
    } finally {
        connection.release()
    }
}

// Compare a senha com o hash usando bcrypt
async function compare(senha, hash) {
    try {
        return await bcrypt.compare(senha, hash);
    } catch (error) {
        console.error('Erro ao comparar a senha com o hash:', error);
        return false; 
    }
}

export { create, readAll, read, update, deleteRecord, compare };