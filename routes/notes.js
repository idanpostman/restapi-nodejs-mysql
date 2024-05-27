var express = require("express")
var router = express.Router();

const Validator = require('fastest-validator');
const v = new Validator();
const { Notes } = require("../models") 

// router.get("/", function(req, res, next) {
//     res.send("Hello World");
// });

// router.get("/env", function(req, res, next) {
//     res.send(process.env.APP_NAME);
// });

// GET All data
router.get("/", async(req, res) => {
    const notes = await Notes.findAll();

    return res.json({
        status: 200,
        message: "Get All Data Succesfully!",
        data: notes
    });
});

// Get Data by id
router.get("/:id", async(req, res) => {
    const id = req.params.id;
    // mengecek id di table note
    let note = await Notes.findByPk(id);

    // Kalo gaada dia ngembaliin respon 404 dengan message sbb
    if(!note) {
        return res.status(404).json({
            status: 404,
            message: "Data not found!"
        });
    }else {
        return res.json({
            status: 200,
            message: "Get Data By Id Succesfully!",
            data: note
        });
    }
});

// POST
router.post("/", async(req, res) => {
    // validation
    const schema = {
        title: "string",
        description: "string|optional",
    }

    const validate = v.validate(req.body, schema);

    if(validate.length) {
        return res.status(400).json(validate);
    }

    //proses create
    const note = await Notes.create(req.body);
    
    res.json({
        status: 200,
        message: "Success create data",
        data: note,
    });
});

// PUT
router.put("/:id", async(req, res, next) => {
    const id = req.params.id;
    let note = await Notes.findByPk(id);

    // Kalo gaada
    if(!note) {
        return res.status(404).json({
            status: 404,
            message: "Data not found!"
        });
    }
    // Validation
    const schema = {
        title: "string|optional",
        description: "string|optional"
    };

    const validate = v.validate(req.body, schema);

    if(validate.length) {
        return res.status(400).json(validate);
    }

    // proses update
    note = await note.update(req.body);

    res.json({
        status: 200,
        message: "Update data successfully!",
        data: note
    });
});

// DELETE
router.delete("/:id", async(req, res) => {
    const id = req.params.id;
    // mengecek id di table note
    let note = await Notes.findByPk(id);

    // Kalo gaada dia ngembaliin respon 404 dengan message sbb
    if(!note) {
        return res.status(404).json({
            status: 404,
            message: "Data not found!"
        });
    }

    // Proses delete data

    await note.destroy();

    res.json( {
        status: 200,
        message: "Delete Notes Succesfully!"
    });
});

module.exports = router;