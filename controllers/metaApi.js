const MetaModel = require('./../models/metaModel');

exports.findAll = (req, res) => {
    let data = {};

    MetaModel.find({status: 1}).exec((err, metas) => {
        if (err) {
            return res.status(500).json({error: err});
        }

        data.metas = metas;
        return res.status(200).json(data);
    });
};


exports.findOne = (req, res) => {
    let meta_id = req.params.meta_id;

    MetaModel.findById(meta_id).exec((err, meta) => {
        if (err) {
            return res.status(500).json({error: err});
        }

        return res.status(200).json({meta: meta});
    });
};


