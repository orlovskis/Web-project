import { axios, apiURL } from './config.js';

class Discount {
    static async getAll(page = '1') {
        try {
            const response = await axios.get(`${apiURL}/discount/all?page=${page}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getDiscountById(id) {
        try {
            const response = await axios.get(`${apiURL}/discount/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/discount`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async update(id, data) {
        try {
            const response = await axios.put(`${apiURL}/discount/${id}`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id){
        try {
            const response = await axios.delete(`${apiURL}/discount/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

}

export default Discount