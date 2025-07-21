import { useState } from "react";
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

import axios from 'axios';
import { MdEmail } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { PiPasswordFill } from "react-icons/pi";
import { useRegisterMutation } from "../redux/features/auth/authApi";
import { setCredentials } from "../redux/features/auth/authSlice";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function Register({changeMethod}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const handleLogin = () => {
    changeMethod("login");
  };

  const onSubmit = async (data) => {
    try {
      const response = await register({
        full_name: data.name,
        email: data.email,
        password: data.password
      }).unwrap();
    
      dispatch(setCredentials({
        user: {
          id: response.user_id,
          name: response.full_name,
          email: response.email,
          token: response.access_token,
        },
        
        tokenType: response.token_type
      }));

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else if(error.data?.detail==='Email already registered'){
        toast.error(error.data?.detail||"Registration failed");
      }
      else{
        toast.error("Registration failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gap-2">
      <div className="space-y-1">
     
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          {...registerField("name")}
          placeholder="Enter Name"
          icon={RxAvatar}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...registerField("email")}
          placeholder="Enter email address"
          icon={MdEmail}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...registerField("password")}
          placeholder="Enter Password"
          icon={RiLockPasswordLine}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...registerField("confirmPassword")}
          placeholder="Conform Password"
          icon={PiPasswordFill}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
            Registering...
          </>
        ) : (
          "Register"
        )}
      </Button>
      <span className="text-center space-y-2">
        <p className="text-[14px] text-gray-500 p-2">are you already have an acccount ? <a onClick={()=>handleLogin()} className="text-blue-500 cursor-pointer">Login</a></p>
        
        </span>
    </form>
  );
}

export default Register;