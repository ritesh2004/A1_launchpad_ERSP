import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format, set } from "date-fns";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { uploadFile } from "../api/fileUpload";
import { submitRequest } from "../api/submitReq";

export default function SubmitRequest() {
    const [form, setForm] = useState({
        name: "",
        serialno: "",
        product_model: "",
        product_details: "",
        image_url: null,
        fault_description: "",
        dop: "",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        // Upload the image
        if (form.image_url) {
            const fileUpload = async () => {
                uploadFile(form.image_url)
                    .then( async (response) => {
                        const resp = await submitRequest({
                            name: form.name,
                            serialno: form.serialno,
                            product_model: form.product_model,
                            product_details: form.product_details,
                            image_url: response.data.url,
                            fault_description: form.fault_description,
                            dop: form.dop,
                        });
                        if (resp.error) {
                            console.error(resp.error);
                            return;
                        }
                        // render success page or redirect
                        window.location.href = `/success?requestId=${resp.data.requestId}`;
                        setForm({
                            name: "",
                            serialno: "",
                            product_model: "",
                            product_details: "",
                            image_url: null,
                            fault_description: "",
                            dop: "",
                        });
                    })
                    .catch((error) => {
                        console.error("Image upload failed:", error);
                        alert("Image upload failed. Please try again.");
                    });
            };
            fileUpload();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Submit Service Request</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="pb-2" htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="serialno">Serial No</Label>
                            <Input
                                id="serialno"
                                name="serialno"
                                value={form.serialno}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="model">Product Model</Label>
                            <Input
                                id="model"
                                name="product_model"
                                value={form.product_model}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="details">Product Details</Label>
                            <Textarea
                                id="details"
                                name="product_details"
                                value={form.product_details}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="image">Image Upload</Label>
                            <Input
                                id="image"
                                name="image_url"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="fault">Fault Description</Label>
                            <Textarea
                                id="fault"
                                name="fault_description"
                                value={form.fault_description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="date">Date of Purchase</Label>
                            <Input
                                id="date"
                                name="dop"
                                type="date"
                                value={form.dop}
                                onChange={handleChange}
                                required
                                max={format(new Date(), "yyyy-MM-dd")}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="mt-4">
                        <Button type="submit" className="w-full">
                            Submit Request
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}