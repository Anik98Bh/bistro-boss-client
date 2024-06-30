import axios from "axios";

const axiosPublic = axios.create({
    // baseURL: 'https://bistro-boss-server-cyan-five.vercel.app'
    baseURL: 'https://bistro-boss-server-cyan-five.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;