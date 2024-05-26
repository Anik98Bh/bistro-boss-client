import { useForm } from "react-hook-form";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { FaUtensils } from "react-icons/fa";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
// const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const AddItems = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        const image = data.image[0];
        const binaryImg = new FormData();
        binaryImg.append("image", image);
        const res = await axiosPublic.post(
            `https://api.imgbb.com/1/upload?key=${image_hosting_key}`,
            binaryImg, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        if (res.data.success) {
            // now send the menu item data to the server with the image
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                image: res.data.data.display_url
            }
            //
            const menuRes = await axiosSecure.post('/menu', menuItem);
            console.log(menuRes.data)
            if (menuRes.data.insertedId) {
                // show success popup
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${data.name} is added to the menu`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
        console.log('with menu url', res.data);
    };


    // ----------------------------------
    // const onSubmit =  (data) => {
    //     console.log(data)
    //     // image upload to imgbb and then get an url
    //     const image = data.image[0];
    //     const formData = new FormData();
    //     formData.append('image', image);
    //     formData.append('upload_preset', "MyCloud");
    //     formData.append('cloud_name', "dacqdjure");
    //     fetch("https://api.cloudinary.com/v1_1/dacqdjure/image/upload", {
    //         method: 'POST',
    //         // headers: {
    //         //     'Content-Type': 'application/json'
    //         // },
    //         body: formData
    //     })
    //         .then(res => res.json()).then((res) => { console.log(res) })
    //     // const { data: result } = await axios.post(image_hosting_api, formData);
    //     // console.log(result)
    //     // const imageFile = { image: data.image[0] }
    //     // const res = await axiosPublic.post(image_hosting_api, imageFile, {
    //     //     headers: {
    //     //         'content-type': 'multipart/form-data'
    //     //     }
    //     // });
    //     // console.log(res.data)
    // }

    return (
        <div className="bg-gray-200">
            <SectionTitle subHeading="What's new?" heading="ADD AN ITEM"></SectionTitle>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full my-6">
                        <label className="label">
                            <span className="label-text">Recipe Name*</span>
                        </label>
                        <input
                            {...register("name", { required: true })}
                            type="text"
                            placeholder="Recipe Name"
                            className="input input-bordered w-full" />
                    </div>
                    <div className="flex gap-6">
                        {/* category */}
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select defaultValue="default" {...register("category", { required: true })}
                                className="select select-bordered w-full">
                                <option disabled value="default">Select a Category</option>
                                <option value="salad">salad</option>
                                <option value="pizza">pizza</option>
                                <option value="desert">desert</option>
                                <option value="soup">soup</option>
                                <option value="drinks">drinks</option>
                            </select>
                        </div>
                        {/* price */}
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Price*</span>
                            </label>
                            <input
                                {...register("price", { required: true })}
                                type="number"
                                placeholder="price"
                                className="input input-bordered w-full" />
                        </div>

                    </div>
                    {/* recipe details */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Recipe Details</span>
                        </label>
                        <textarea {...register("recipe")} className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
                    </div>
                    <div className="form-control w-full my-6">
                        <input {...register("image", { required: true })} type="file" className="file-input w-full max-w-xs" />
                    </div>
                    <button className="btn">
                        Add Items <FaUtensils className="ml-4"></FaUtensils> </button>
                </form>
            </div>
        </div>
    );
};

export default AddItems;