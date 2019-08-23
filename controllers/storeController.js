const mongoose = require('mongoose');
const Store = require('../models/Store');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', {
        title: 'Stores',
        stores
    })
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'})
};

exports.editStore = async (req, res) => {
    //check permission
    const store = await Store.findOne({_id: req.params.id});

    res.render('editStore', {
        title: `Edit ${store.name}`,
        store
    })
};

exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/stores/${store.slug}`);
};
exports.updateStore = async (req, res) => {
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();
    console.log(store);
    req.flash('success', `Successfully Updated ${store.name}.`);
    res.redirect(`/stores/${store.slug}`);
};
