const Usuario = require('../models/usuario');

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function(req, res) {

    let limite = Number(req.query.limite || 0);
    let desde = Number(req.query.desde || 0);
    Usuario.find({ estado: true })
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, usuarios });
            });
        });
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    console.log("\n\n---\nRecibí body--> ", body);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });
    console.log("\n\n---\nRecibí usuario--> ", usuario);
    usuario.save((err, usuarioBD) => {
        if (err) {
            res.status(400).json({ ok: false, error: err });
        } else {
            res.json({ usuarioBD: usuarioBD });
        }
    });

});

app.put('/usuario/:id', function(req, res) {
    // console.log("Recibí full--> ", body);
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'rol']);
    let id = req.params.id;
    // console.log("Recibí pick--> ", body);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: err });
        }
        res.json({ ok: true, usuarioBD: usuarioBD });
    })

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let modificarEstado = { estado: false };

    Usuario.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }
        res.json({ ok: true, usuarioBorrado });
    });

});


module.exports = app;