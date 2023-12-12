const Discount = require("../models/Discount");
const DiscountSchema = require('../schemas/DiscountSchema');
const Product = require('../models/Product');

class DiscountController {
    static async index(req, res) {
        let page = req.query.page;
        if (isNaN(parseInt(page))) page = '1';

        const discounts = await Discount.findAll();
        return discounts.success ? res.send(discounts) : res.status(404).send(discounts);
    }

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id de desconto inválido!' })

        const discount = await Discount.findOne(id);
        return discount.success ? res.send(discount) : res.status(404).send(discount);
    }

    static async create(req, res) {
        const schema = DiscountSchema.createValidate();
        const { error } = schema.validate(req.body)

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { value, id_product } = req.body;

        const product = await Product.findOne(id_product);

        if (product.success && product.product.id_salesman !== req.locals.id_salesman && req.locals.type !== 'V')
            return res.status(403).send({ success: false, message: 'Você não tem autorização para acessar este desconto!' });

        if (product.success) {
            if (product.product.id_discount) {
                const result = await Discount.delete(product.product.id_discount);

                if (!result.success)
                    res.status(400).send({ success: false, message: 'Houve um erro ao deletar o desconto anterior associado!' });
            }

            if ((parseFloat(product.product.price) * 0.99) < value)
                return res.status(409).send({ success: false, message: "O Desconto não pode ser maior que 99% do valor do produto!" });

            const result = await Discount.create({ value }, id_product);
            return result.success ? res.status(201).send(result) : res.status(404).send(result);
        } else return res.status(404).send(product);
    }

    static async update(req, res) {
        const discountSchema = DiscountSchema.updateValidate();
        const { error } = discountSchema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { value, id } = req.body;
        let discountData = {};

        const discount = await Discount.findOne(id);
        const product = await Product.findByDiscount(id);

        if (product.success && product.product.id_salesman !== req.locals.id_salesman && req.locals.type !== 'V')
            return res.status(403).send({ success: false, message: 'Você não tem autorização para acessar esse produto!' });

        if (discount.success && discount.discount.id && !discount.discount.is_deleted && product.success) {
            if ((parseFloat(product.product.price) * 0.99) < value) 
                return res.status(409).send({ success: false, message: "O Desconto não pode ser maior que 99% do valor do produto!" });

            if (value && value !== discount.discount.value) discountData['value'] = value;

            const result = Object.keys(discountData).length ? await Discount.update(id, discountData) : discount;
            return result.success ? res.send(result) : res.status(404).send({ success: false, message: 'Desconto não atualizado!' });

        } else res.status(404).send({ success: false, message: 'Desconto inexistente!' });

    }

    static async delete(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id inválido!' })

        const discount = await Discount.findOne(id);
        const product = await Product.findByDiscount(id);

        if (product.success && product.product.id_salesman !== req.locals.id_salesman && req.locals.type !== 'A')
            return res.status(403).send({ success: false, message: 'Você não tem autorização para acessar esse produto!' });

        if (discount.success && discount.discount.is_deleted || !discount.success || !product.success)
            return res.status(400).send({ success: false, message: 'Desconto inexistente!' });

        const result = await Discount.delete(id);
        return result.success ? res.send(result) : res.status(404).send(result);
    }
};

module.exports = DiscountController;