import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getReqById } from "../api/getReqById";
import { useNavigate, useSearchParams } from "react-router";

// Example data (replace with real data or props)

const statusColor = (status) => {
    switch (status) {
        case "Completed":
            return "bg-green-500";
        case "In Progress":
            return "bg-yellow-500";
        case "Pending":
            return "bg-gray-500";
        case "Rejected":
            return "bg-red-500";
        default:
            return "bg-blue-500";
    }
};

export default function TrackReq() {
    const [reqDetails, setReqDetails] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(false); // Add error state

    const [details, setDetails] = useState({})

    const [searchParams] = useSearchParams();
    const requestId = searchParams.get("requestId");

    const navigate = useNavigate();

    const getRepairDetailsById = async (id) => {
        setLoading(true);
        setError(false);
        const resp = await getReqById(id);
        if (resp.error || !resp.success) {
            console.error("Error fetching request details:", resp.error || resp.message);
            setLoading(false);
            setError(true);
            setReqDetails(null);
            return null;
        }
        setLoading(false);
        setReqDetails(resp.data.data);
        return resp.data;
    };

    useEffect(() => {
        if (requestId) {
            getRepairDetailsById(requestId);
        } else {
            setLoading(false);
            setError(true);
        }
    }, [requestId]);

    console.log(reqDetails)

    // Show loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-muted">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="p-6">
                        <div className="text-center">Loading...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show error/not found state
    if (error || reqDetails === null) {
        console.log("No request found for ID:", requestId);
        return (
            <div className="flex justify-center items-center min-h-screen bg-muted">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-red-500 text-center text-xl">Request Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground">
                            The requested repair could not be found.
                        </div>
                        <div className="mt-6 flex justify-center">
                            <Button variant="outline" onClick={() => navigate(-1)}>Back to Home</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted">
            <Card className="w-full max-w-xl shadow-lg">
                <CardHeader>
                    <CardTitle>Repair Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={reqDetails[6]}
                                alt="Product"
                                className="w-40 h-40 object-cover rounded-md border"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <Label>Request ID</Label>
                                <div className="font-mono text-sm">{reqDetails[1]}</div>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Badge className={statusColor(reqDetails[8])}>
                                    {reqDetails[8]}
                                </Badge>
                            </div>
                            <div>
                                <Label>Amount</Label>
                                <div className="font-semibold">₹{reqDetails[12] || 0}</div>
                            </div>
                            <div>
                                <Label>Product Model</Label>
                                <div>{reqDetails[3]}</div>
                            </div>
                            {
                                reqDetails[9] === 'TRUE' ? <div className="text-green-500"> Reviewed By Service Center</div> : <div className="text-red-500"> Not Reviewed Yet</div>
                            }
                        </div>
                    </div>
                    <Separator className="my-6" />
                    <div>
                        <Label>Details</Label>
                        <div className="text-muted-foreground">{reqDetails[4]}</div>
                    </div>
                    <div className="mt-4">
                        <Label>Fault Description</Label>
                        <div className="text-muted-foreground">{reqDetails[7]}</div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button variant="outline" onClick={() => navigate(-1)}>Back to Home</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}