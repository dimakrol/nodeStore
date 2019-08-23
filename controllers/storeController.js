const mongoose = require('mongoose');
const Store = require('../models/Store');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'})
};

exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();

    res.redirect('/');
};
