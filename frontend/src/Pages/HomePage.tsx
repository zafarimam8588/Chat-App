import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "@/components/Authentication/Login";
import Signup from "@/components/Authentication/Signup";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      JSON.parse(userInfo);
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center mt-24 min-h-screen">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 mb-4 font-bold px-2 py-3 bg-slate-100 ">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
