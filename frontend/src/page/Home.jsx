import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import AuthContext from "../context/Authcontext";

const HomePage = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Electronics Repair Portal</h1>
        <p className="text-lg md:text-xl max-w-xl mb-6">
          Submit service requests, track repair status, and get support for your electronic products.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button>Submit Request</Button>
          <Button variant="outline">Track Request</Button>
          {user ? (
            <Button variant="ghost"  className="flex items-center">
                @{user?.name}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate("/login")} className="flex items-center">
              Login <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="py-10 px-6 md:px-20 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
            <p>Submit repair requests in minutes with simple forms and image uploads.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
            <p>Stay informed with real-time updates on your repair status.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
            <p>All requests are secured and only accessible by verified personnel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
