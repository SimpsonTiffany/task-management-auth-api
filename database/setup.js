const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

// ---------------------------------------------------
// Ensure "database" folder exists
// ---------------------------------------------------
if (!fs.existsSync('database')) {
    fs.mkdirSync('database');
}

// ---------------------------------------------------
// Initialize Sequelize (safe DB fallback)
// ---------------------------------------------------
const dbName = process.env.DB_NAME || 'task_management.db';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: `database/${dbName}`,
    logging: false, // turn off logging for cleaner console
});

// ---------------------------------------------------
// USER MODEL
// ---------------------------------------------------
const User = db.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true }
);

// ---------------------------------------------------
// PROJECT MODEL
// ---------------------------------------------------
const Project = db.define(
    'Project',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active',
        },
        dueDate: {
            type: DataTypes.DATE,
        },
    },
    { timestamps: true }
);

// ---------------------------------------------------
// TASK MODEL
// ---------------------------------------------------
const Task = db.define(
    'Task',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { timestamps: true }
);

// ---------------------------------------------------
// MODEL RELATIONSHIPS
// ---------------------------------------------------

// User → Projects (1:M)
User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId' });

// Project → Tasks (1:M)
Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

// ---------------------------------------------------
// EXPORT MODELS + DB
// ---------------------------------------------------
// ---------------------------------------------------
// SYNC DATABASE (CREATE TABLES IF THEY DO NOT EXIST)
// ---------------------------------------------------
async function syncDB() {
    try {
        await db.sync({ alter: true });
        console.log("Database synced successfully.");
    } catch (err) {
        console.error("Database sync error:", err);
    }
}

syncDB();

module.exports = { db, User, Project, Task };

