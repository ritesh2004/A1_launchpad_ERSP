import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { signup } from "../api/signup";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await signup(form);
        if (res.error) {
            console.error("Signup failed:", res.error);
            return;
        }
        // Redirect to login page after successful signup
        console.log("Signup successful:", res);

        navigate("/login");
    };

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label className="pb-2" htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Sign Up
                        </Button>
                    </form>
                    <Separator className="my-4" />
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Already have an account? <a onClick={() => navigate("/login")} className="text-blue-600 hover:underline cursor-pointer">Login</a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}