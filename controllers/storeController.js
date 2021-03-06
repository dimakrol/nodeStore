const mongoose = require('mongoose');
const Store = require('../models/Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype is not allowed!'}, false);
        }
    }
};

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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next(); //go to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //start resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // keep going!!!
    next()
};

exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};
exports.updateStore = async (req, res) => {
    // set the location data to be a point
    req.body.location.type = 'Point';
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();

    req.flash('success', `Successfully Updated ${store.name}.`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug })
    if (!store) return next();

    res.render('store', {store, title: store.name});
};

exports.getStoresByTag = async (req, res, next) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

    res.render('tags', { tags, title: 'Tags', tag, stores })
};
