import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/Context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Login = () => {
  const [show, setShow] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { setUser } = ChatState();
  const { toast } = useToast();

  async function submitHandler() {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const { data } = await axios.post(
        `${apiUrl}/api/user/login`,
        { email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(data);
      toast({
        title: "Login Successful",
        variant: "default",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error while Login",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
      }

      setLoading(false);
    }
  }

  return (
    <div>
      <Card>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter Your Email Address"
            />
          </div>
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-2 top-8 text-sm text-gray-500"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button onClick={submitHandler}>
            {loading ? "Submitting" : "Login"}
          </Button>
          <Button
            onClick={() => {
              setEmail("zimam8588@gmail.com");
              setPassword("12345");
            }}
          >
            Login as Guest
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
