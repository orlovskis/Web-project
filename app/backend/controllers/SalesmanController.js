const Salesman = require('../models/Salesman');
const SalesmanSchema = require('../schemas/SalesmanSchema');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT);
const CNPJ = require('cnpj');
const Product = require('../models/Product');
const OrderProduct = require('../models/OrderProduct');
class SalesmanController {
    static async index(req, res) {
        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const salesman = await Salesman.findAll(page);
        return salesman.success ? res.send(salesman) : res.status(404).send(salesman);
    };

    static async indexSalesmanProducts(req, res) {
        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';
        const id_salesman = req.params.id;

        const products = await Product.findSalesmanOwnProducts(id_salesman, page);
        return products.success ? res.send(products) : res.status(400).send(products);
    }

    static async show(req, res) {
        const id = req.params.id;
        if (isNaN(parseInt(id))) return res.status(400).send({ success: false, message: 'Id do vendedor inválido!' })

        const salesman = await Salesman.findOne(id);
        return salesman.success ? res.send(salesman) : res.status(404).send(salesman);
    };

    static async create(req, res) {
        const { name, surname, email, tel, password, business_name, cnpj, birthdate } = req.body;

        let user = {
            name,
            surname,
            email,
            password,
            tel,
            birthdate
        };

        const salesman = {
            business_name,
            cnpj
        };

        const userSchema = SalesmanSchema.createValidate();
        const { error } = userSchema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        if (!CNPJ.validate(cnpj))
            return res.status(400).send({ success: false, message: 'CNPJ deve ser válido!' });

        user.type = 'V';
        const existEmail = await User.findByEmail(email);
        if (existEmail.user && Object.keys(existEmail.user).length)
            return res.status(409).send({ success: false, message: 'Email já cadastrado!' });

        const existCnpj = await Salesman.findByCnpj(cnpj);
        if (existCnpj.salesman && Object.keys(existCnpj.salesman).length)
            return res.status(409).send({ success: false, message: 'CNPJ já cadastrado!' });

        const existTel = await User.findByTel(tel);
        if (existTel.user && Object.keys(existTel.user).length)
            return res.status(409).send({ success: false, message: 'Telefone já cadastrado!' });

        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(req.body.password, salt);

        const result = await Salesman.create(user, salesman);
        if (!result.success)
            return res.status(400).send(result);

        return res.status(201).send(result);
    };

    static async update(req, res) {
        const userSchema = await SalesmanSchema.updateValidate();
        const { error } = userSchema.validate(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        const { id, name, surname, email, tel } = req.body;

        let userData = {};

        const salesman = await Salesman.findOne(id);

        if (salesman.success && salesman.salesman.id_salesman && !salesman.salesman.id_deleted) {
            let salesmanData = {};

            const user_id = salesman.salesman.id_user;
            const salesman_id = salesman.salesman.id_salesman;

            if (name && name !== salesman.salesman.name) userData['name'] = name;

            if (surname && surname !== salesman.salesman.surname) userData['surname'] = surname;

            if (email && email !== salesman.salesman.email) {
                const existEmail = await User.findByEmail(email);
                if (existEmail.user && Object.keys(existEmail.user).length)
                    res.status(409).send({ success: false, message: 'Email já cadastrado!' });
                userData['email'] = email;
            }

            if (tel && tel !== salesman.salesman.tel) {
                const existTel = await User.findByTel(tel);
                if (existTel.user && Object.keys(existTel.user).length)
                    res.status(409).send({ success: false, message: 'Telefone já cadastrado!' });
                userData['tel'] = tel;
            }

            const result = await Salesman.update(user_id, salesman_id, userData, salesmanData);
            if (result.success) {
                const updatedSalesman = await Salesman.findOne(id);
                return updatedSalesman.success ? res.send(updatedSalesman) : res.status(400).send(updatedSalesman);
            } else return res.status(400).send(result);
        } else {
            return res.status(409).send({ success: false, message: 'Vendendor inexistente!' });
        }
    };

    static async delete(req, res) {
        const id = req.params.id;
        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id inválido!' });

        const salesman = await Salesman.findOne(id);
        if (!salesman.success ||
            (salesman.success && !Object.keys(salesman.salesman).length) ||
            (salesman.success && Object.keys(salesman.salesman).length && salesman.salesman.is_deleted))
            return res.status(404).send({ success: false, message: 'Usuário inexistente!' });


        const numSalesToBeReceived = OrderProduct.countSaleStatusBySalesman(id, 'R', false);
        if (numSalesToBeReceived.success) {
            if (numSalesToBeReceived.numSales > 0)
                return res.status(409).send({ success: false, message: 'A conta não pode ser deletada, pois ainda existem pedidos a serem recebidos pelos clientes!' });
        } else {
            return res.status(400).send(numSalesToBeReceived);
        }

        const result = await Salesman.delete(salesman.salesman.id_user, salesman.salesman.id_salesman);
        return result ? res.send(result) : res.status(400).send(result);
    };

    static async indexMessage(req, res) {
        const messages = await Salesman.findAllSalesmanMessage(req.locals.id_salesman);
        console.log(messages)
        return messages.success ? res.send(messages) : res.status(400).send(messages);
    }
};

module.exports = SalesmanController;