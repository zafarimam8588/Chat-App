import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Signup = () => {
  const [show, setShow] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmpassword, setConfirmpassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [pic, setPic] = useState<File | null>(null);
  // const [picLoading, setPicLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function submitHandler() {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        variant: "destructive",
      });
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log(name, email, password);
      const { data } = await axios.post(
        `${apiUrl}/api/user/signup`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(data);
      toast({
        title: "Registration Successful",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error while Signup",
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
            <Label htmlFor="name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              type="text"
              placeholder="Enter Name"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="Enter Email"
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
          <div className="relative">
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              id="confirmpassword"
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

          {/* <div className="space-y-1">
            <Label htmlFor="pic">Profile Pic</Label>
            <Input
              onChange={(e) =>
                setPic(e.target.files ? e.target.files[0] : null)
              }
              id="pic"
              type="file"
            />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button onClick={submitHandler}>
            {loading ? "Submitting" : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
