const knex = require('../database/knex');
const Message = require('../utils/Message');

class Product {

    static async countProducts(id_salesman = null) {
        try {
            let result;

            if (id_salesman) result = await knex('tb_product').count('id', { as: 'quantity' }).where({ is_deleted: false, is_active: true, id_salesman });
            else result = await knex('tb_product').count('id', { as: 'quantity' }).where({ is_deleted: false, is_active: true });

            return { success: true, numProducts: result[0].quantity };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a contagem de produtos!' }
        }
    }

    static async countVisualizations(id_salesman = null) {
        try {
            let result;

            if (id_salesman) result = await knex('tb_product').count('num_access', { as: 'access' }).where({ is_deleted: false, is_active: true, id_salesman });
            else result = await knex('tb_product').count('num_access', { as: 'access' }).where({ is_deleted: false, is_active: true });

            return { success: true, numAccess: result[0].access };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a contagem de visualizações do produtos!' }
        }
    }

    static async findAll(page) {
        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .join('tb_salesman', { 'tb_salesman.id': 'tb_product.id_salesman' })
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.price_total',
                    'tb_product.url_image',
                    'tb_product.key_image',
                    'tb_product.quality',
                    'tb_product.style',
                    'tb_material.name AS material',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_salesman.business_name',
                )
                .where({
                    'tb_product.is_deleted': false,
                    'tb_product.is_active': true
                })
                .orderBy('tb_product.created_at', 'DESC')
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            return product.data[0] ? { success: true, product } : { success: false, message: 'Não foi possível recuperar os produtos / Produtos inexistentes!' };

        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produtos!' };
        }
    }

    static async findOne(id, ignoreDeleted = false) {
        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .join('tb_salesman', 'tb_salesman.id', 'tb_product.id_salesman')
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.price_total',
                    'tb_product.description',
                    'tb_product.num_access',
                    'tb_product.quantity',
                    'tb_product.quality',
                    'tb_product.width',
                    'tb_product.style',
                    'tb_product.depth',
                    'tb_product.height',
                    'tb_product.is_active',
                    'tb_product.is_deleted',
                    'tb_material.name AS material',
                    'tb_material.id as id_material',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_product.id_salesman',
                    'tb_product.key_image',
                    'tb_product.url_image',
                    'tb_salesman.business_name',
                    'tb_salesman.id_user AS id_user_salesman'
                )
                .where(function () {
                    this.where({ 'tb_product.id': id });

                    if (!ignoreDeleted)
                        this.andWhere({ 'tb_product.is_deleted': false });
                });

            if (product.length) {
                const images = await knex.select(['key', 'url']).from('tb_product_image').where({ id_product: id });
                const totalSold = await knex.select(knex.raw('sum(quantity) as sold')).from('tb_order_product').where({ id_product: id });
                const countSatisfaction = await knex.select(knex.raw('COUNT(liked), liked as satisfaction')).from('tb_order_product_avaliation').where({ id_product: id }).groupBy('liked');

                product[0].images = images;
                product[0].total_sold = totalSold[0].sold;
                product[0].count_satisfaction = {};
                if (countSatisfaction.length) {
                    for (let avaliation of countSatisfaction) {
                        product[0].count_satisfaction[avaliation.satisfaction] = avaliation.count;
                    }
                }

                return { success: true, product: product[0] };
            }
            return { success: false, message: 'Não foi possível recuperar o produto / Produto inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produto!' };
        }
    }

    static async findSalesmanOwnProducts(id_salesman, page = 1) {
        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .join('tb_salesman', { 'tb_salesman.id': 'tb_product.id_salesman' })
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.price_total',
                    'tb_product.style',
                    'tb_product.url_image',
                    'tb_product.quantity',
                    'tb_product.quality',
                    'tb_product.key_image',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_product.is_active',
                    'tb_material.name AS material',
                    'tb_product_discount.value',
                    'tb_salesman.business_name'
                )
                .where({
                    'tb_product.is_deleted': false,
                    'tb_product.id_salesman': id_salesman
                })
                .orderBy('tb_product.created_at', 'DESC')
                .paginate({ perPage: 20, currentPage: page, isLengthAware: true });

            return product.data[0] ? { success: true, product } : { success: false, message: 'Não foi possível recuperar os produtos / Produtos inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produtos!' };
        }
    }

    static async findAllSalesmanProducts(id_salesman, page) {
        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .join('tb_salesman', { 'tb_salesman.id': 'tb_product.id_salesman' })
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.price_total',
                    'tb_product.style',
                    'tb_product.quality',
                    'tb_product.url_image',
                    'tb_product.quantity',
                    'tb_product.key_image',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_material.name AS material',
                    'tb_product_discount.value',
                    'tb_salesman.business_name'
                )
                .where({
                    'tb_product.is_deleted': false,
                    'tb_product.is_active': true,
                    'tb_product.id_salesman': id_salesman
                })
                .orderBy('tb_product.created_at', 'DESC')
                .paginate({ perPage: 20, currentPage: page, isLengthAware: true });

            return product.data[0] ? { success: true, product } : { success: false, message: 'Não foi possível recuperar os produtos / Produtos inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produtos!' };
        }
    }

    static async findByDiscount(id_discount) {
        try {
            const product = await knex.select('*').where({ id_discount, 'is_deleted': false }).from('tb_product');
            return product[0] ? { success: true, product: product[0] } : { success: false, message: 'Não foi possível recuperar o produto / Produto inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o produto!' };
        }
    }

    static async findByTitleAndSalesman(title, id_salesman) {
        try {
            const product = await knex.select('id').where({ title, id_salesman, "is_deleted": false }).from('tb_product');
            return product.data[0] ? { success: true, product: product } : { success: false, message: 'Não foi possível recuperar o produto / produto inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o produto!' };
        }
    }

    static async findMostDiscount(yesterday, today, page) {
        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .join('tb_salesman', { 'tb_salesman.id': 'tb_product.id_salesman' })
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.price_total',
                    'tb_product.style',
                    'tb_product.quality',
                    'tb_product.url_image',
                    'tb_product.quantity',
                    'tb_product.key_image',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_material.name AS material',
                    'tb_product_discount.value',
                    'tb_salesman.business_name'
                )
                .where({
                    'tb_product.is_deleted': false,
                    'tb_product.is_active': true,
                })
                .andWhereBetween('tb_product_discount.created_at', [yesterday, today])
                .orderBy('tb_product_discount.value', 'DESC')
                .paginate({ perPage: 20, currentPage: page, isLengthAware: true });
            return product.data[0] ? { success: true, product } : { success: false, message: 'Não foi possível recuperar os produtos / Produtos inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produtos!' };
        }
    }

    static async findByMaterial(id, page = '1') {
        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .join('tb_salesman', { 'tb_salesman.id': 'tb_product.id_salesman' })
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.price_total',
                    'tb_product.style',
                    'tb_product.quality',
                    'tb_product.url_image',
                    'tb_product.quantity',
                    'tb_product.key_image',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_material.name AS material',
                    'tb_product_discount.value',
                    'tb_salesman.business_name',
                    'tb_salesman.id AS id_salesman'
                )
                .where({
                    'tb_product.is_deleted': false,
                    'tb_product.is_active': true,
                    'tb_product.id_material': id
                })
                .paginate({ perPage: 20, currentPage: page, isLengthAware: true });
            return product.data[0] ? { success: true, product } : { success: false, message: 'Não foi possível recuperar os produtos / Produtos inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produtos!' };
        }
    }

    static async findRelationable(filter, page) {

        try {
            const product = await knex('tb_product')
                .join('tb_material', { 'tb_material.id': 'tb_product.id_material' })
                .leftJoin('tb_product_discount', { 'tb_product_discount.id': 'tb_product.id_discount' })
                .join('tb_salesman', { 'tb_salesman.id': 'tb_product.id_salesman' })
                .join('tb_address', 'tb_address.id_user', 'tb_salesman.id_user')
                .select(
                    'tb_product.id',
                    'tb_product.title',
                    'tb_product.price',
                    'tb_product.style',
                    'tb_product.url_image',
                    'tb_product.key_image',
                    'tb_product.quantity',
                    'tb_material.name as material',
                    'tb_product.quality',
                    'tb_product.id_salesman',
                    'tb_product_discount.value AS discount',
                    'tb_product_discount.id AS id_discount',
                    'tb_salesman.business_name',
                    'tb_product.created_at',
                    'tb_address.city',
                    'tb_address.state'
                )
                .where(function () {
                    this.whereRaw("unaccent(:productTitle:) ilike unaccent(:search) or " +
                        "unaccent(:materialName:) ilike unaccent(:search) or " +
                        "unaccent(:productDesc:) ilike unaccent(:search) or " +
                        "unaccent(:salesmanBusiness:) ilike unaccent(:search)",
                        {
                            productTitle: 'tb_product.title',
                            productDesc: 'tb_product.description',
                            materialName: 'tb_material.name',
                            salesmanBusiness: 'tb_salesman.business_name',
                            search: '%' + filter.search + '%'
                        })
                })
                .andWhere(function () {
                    if (filter.minPrice) this.andWhere('tb_product.price', '>=', filter.minPrice);

                    if (filter.maxPrice) this.andWhere('tb_product.price', '<=', filter.maxPrice);

                    if (filter.minQuality) {

                        switch (filter.minQuality) {
                            case 'A': filter.minQuality = '1'; break;
                            case 'B': filter.minQuality = '2'; break;
                            case 'C': filter.minQuality = '3'; break;
                            case 'E': filter.minQuality = '4'; break;
                            default: filter.minQuality = '1';
                        }

                        this.andWhere('tb_product.quality', '>=', filter.minQuality);
                    }

                    if (filter.maxQuality) {
                        switch (filter.maxQuality) {
                            case 'A': filter.maxQuality = '1'; break;
                            case 'B': filter.maxQuality = '2'; break;
                            case 'C': filter.maxQuality = '3'; break;
                            case 'E': filter.maxQuality = '4'; break;
                            default: filter.maxQuality = '4';
                        }

                        this.andWhere('tb_product.quality', '<=', filter.maxQuality);
                    }
                })
                .andWhere({
                    'tb_product.is_deleted': false,
                    'tb_product.is_active': true
                })
                .orderByRaw("tb_address.state = '" + filter.state + "' DESC")
                .paginate({ perPage: 20, currentPage: page, isLengthAware: true });

            return product.data[0] ? { success: true, product } : { success: false, message: 'Não foi possível recuperar os produtos da pesquisa / Não existem produtos!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os produtos da pesquisa!' };
        }
    }

    static async findAllImagesProduct(id_product) {
        try {
            const images = await knex.select('id', 'key')
                .from('tb_product_image')
                .where({ id_product });

            return images[0] ? { success: true, images } : { success: false, message: 'Falha ao recuperar as imagens do produto!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao acessar as imagens do produto!' }
        }
    }

    static async create(product, product_images) {
        try {
            return await knex.transaction(async trx => {
                let result = {}
                const prod = await trx('tb_product').insert(product, '*');
                result.id = prod[0].id;

                result.images = [];
                for (let p of product_images) {
                    p.id_product = result.id;
                    const img = await trx('tb_product_image').insert(p, ['key', 'url']);
                    result.images.push(img);
                }

                return { success: true, product: prod[0] };
            });
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao inserir produto!' };
        }
    }

    static async updateActivity(id, is_active) {
        try {
            const prod = await knex('tb_product').update({ is_active }).where({ id }).returning('*');
            return { success: true, product: prod[0] };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Produto não atualizado!' };
        }
    }

    static async update(id, data, product_images, delete_images, delete_cover) {
        try {
            return await knex.transaction(async trx => {
                let result = {}
                let prod = await trx('tb_product').update(data).where({ id }).returning('*');
                result.id = prod[0].id;

                result.images = [];
                for (let p of product_images) {
                    p.id_product = result.id;
                    const img = await trx('tb_product_image').insert(p, ['key', 'url']);
                    result.images.push(img);
                }

                if (delete_images && delete_images.length) {
                    for (let i of delete_images) await trx('tb_product_image').where('key', i.key).delete();
                }

                if (delete_cover) {
                    const images = await trx('tb_product_image')
                        .select('key', 'url')
                        .where({ id_product: id })
                        .orderBy('id')
                        .limit(1)
                    if (images.length) prod = await trx('tb_product').update({ key_image: images[0].key, url_image: images[0].url }).where({ id }).returning('*');
                    else await trx('tb_product').update({ key_image: product_images[0].key, url_image: product_images[0].url }).where({ id });
                }

                return { success: true, product: prod[0] };
            });
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Produto não atualizado!' };
        }
    }

    static async delete(id, id_image) {
        try {
            await knex.transaction(async trx => {
                await trx('tb_product_image').where({ id_product: id }).andWhere('id', '!=', id_image).delete();
                await trx('tb_product').update({ is_deleted: true, is_active: false }).where({ id });
            });

            return { success: true, message: 'Produto deletado!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Produto não deletado!' };
        }
    }

    static async increaseVisits(id) {
        try {
            await knex('tb_product').update({ 'num_access': knex.raw('num_access + 1') }).where({ id });
            return { success: true };
        } catch (error) {
            Message.warning(error);
            return { success: false };
        }
    }

    static async rollback(id, quantity) {
        console.log(id, quantity);
        try {
            await knex('tb_product').update({ 'quantity': knex.raw('quantity + ' + quantity), is_active: true }).where({ id });
            return { success: true };
        } catch (error) {
            Message.warning(error, 'roolback');
            return { success: false };
        }
    }
}

module.exports = Product;
