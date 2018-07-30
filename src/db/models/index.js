const ObjectId = require('mongodb').ObjectId;
const dbService = require('../mongo');

let db;
const initModels = () => {
    db = dbService.db;
    botModel.init();
    messageModel.init();
    userModel.init();
};

const botModel = {
    init: () => {
        try {
            this.collection = db.collection('bots');
        } catch (err) {
            throw err;
        }
    },
    save: async (data) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.save(data);
    },
    getOneById: async (_id) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.findOne({ _id: ObjectId(_id) });
    },
    getOneByName: async (name) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.findOne({ name });
    },
};

const messageModel = {
    init: () => {
        try {
            this.collection = db.collection('messages');
        } catch (err) {
            throw err;
        }

    },
    save: async (data) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.save(data);
    },
    getOneById: async (_id) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.findOne({ _id: ObjectId(_id) });
    },
    getOneByName: async (name) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.findOne({ name });
    },
};

const userModel = {
    init: () => {
        try {
            this.collection = db.collection('users');
        } catch (err) {
            throw err;
        }
    },
    save: async (data) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.save(data);
    },
    getOneById: async (_id) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.findOne({ _id: ObjectId(_id) });
    },
    getOneByName: async (_id) => {
        if (!this.collection)
            throw Error("Collection not initialize");

        return this.collection.findOne({ name });
    },
};

module.exports = {
    botModel,
    messageModel,
    userModel,
    initModels,
};
