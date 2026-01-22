import api from "./api";

export const paymentService = {
    verifyCode: async (code)=>{
        const response = await api.post('/api/payment/decrypt-redirect', {data: code});
        return response.data;
    }
}