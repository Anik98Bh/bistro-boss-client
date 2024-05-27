import { useLoaderData } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const UpdateItem = () => {
    const { name, category, recipe, price, _id } = useLoaderData();
    const { register, handleSubmit, } = useForm();
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
            const menuRes = await axiosSecure.patch(`/menu/${_id}`, menuItem);
            console.log(menuRes.data)
            if (menuRes.data.modifiedCount > 0) {
                // show success popup
                // reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${data.name} is updated to the menu`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
        console.log('with menu url', res.data);
    };

    return (
        <div>
            <SectionTitle subHeading="info" heading="Update Item"></SectionTitle>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full my-6">
                        <label className="label">
                            <span className="label-text">Recipe Name*</span>
                        </label>
                        <input
                            defaultValue={name}
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
                            <select defaultValue={category} {...register("category", { required: true })}
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
                                defaultValue={price}
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
                        <textarea {...register("recipe")}
                            defaultValue={recipe}
                            className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
                    </div>
                    <div className="form-control w-full my-6">
                        <input {...register("image", { required: true })} type="file" className="file-input w-full max-w-xs" />
                    </div>
                    <button className="btn">
                        Update Menu Item </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateItem;