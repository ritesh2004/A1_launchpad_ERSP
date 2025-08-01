import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router";
import { login } from "../api/login";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Add your login logic here
        const res = await login(form);
        if (res.error) {
            console.error("Login failed:", res.error);
            setError(res.error?.message);
            setLoading(false);
            return;
        }
        console.log("Login successful:", res);
        // Redirect to home page or dashboard after successful login
        navigate("/");
        // Reset loading state after a short delay to show the success message
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label className="pb-2" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <Label className="pb-2" htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <Button type="submit" className="w-full mb-4" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                    <Separator/>
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account? <a onClick={() => navigate("/signup")} className="text-blue-600 hover:underline cursor-pointer">Register</a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}