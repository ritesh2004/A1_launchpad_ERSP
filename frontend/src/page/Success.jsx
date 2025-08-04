import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "react-router";

const Success = () => {
    const [searchParams] = useSearchParams();
    const requestId = searchParams.get("requestId");
    console.log("Request ID:", requestId);
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="flex flex-col items-center">
                    <CheckCircle2 className="text-green-500 w-16 h-16 mb-2" />
                    <CardTitle className="text-2xl font-bold text-center">
                        Request Submitted Successfully!
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p className="text-center text-muted-foreground">
                        Your request has been submitted. We have received your details and will process them soon.
                    </p>
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-muted-foreground mb-1">Request ID</span>
                        <Badge variant="outline" className="text-base px-4 py-2">
                            {requestId}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Success;