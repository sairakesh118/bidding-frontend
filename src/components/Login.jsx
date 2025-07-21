import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { setCredentials } from "../redux/features/auth/authSlice";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function Login({changeMethod}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const handleRegister = () => {
    changeMethod("register");
  };

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      console.log(response)
      if (!response || !response.access_token) {
        throw new Error("Login failed: No access token received");
      }
      // Handle successful login
      dispatch(setCredentials({
        user: {
          id: String(response.user_id),
          username: response.full_name,
          email: response.email,
        },
        token: response.access_token,
        tokenType: response.token_type
      }));

      toast.success("Login successful!");
       
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Enter Name"
          icon={MdEmail}
          IconclassName={'text-black w-6 h-6'}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Enter Password"
          icon={RiLockPasswordFill}
          IconclassName={'text-black w-6 h-6'}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
      <span className="text-center">
        <p className="text-[14px] text-gray-500 p-2">Don't have an account? <a onClick={()=>handleRegister()} className="text-blue-500 cursor-pointer">Sign Up</a></p>
        </span>
    </form>
  );
}

export default Login;
