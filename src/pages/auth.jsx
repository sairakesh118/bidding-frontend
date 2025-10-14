import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import Login from "../components/Login";
import Register from "../components/Register";
import { TypeAnimation } from 'react-type-animation';
import Lottie from "lottie-react"
import loginanimation from "./loginanimation.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdPrivacyTip } from "react-icons/md";
import { IoDocumentTextSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { invitationStorage } from '../utils/invitationStorage';

function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [method, setMethod] = useState("Register");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const changeMethod = (value) => {
    setMethod(value);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const pendingInvitation = invitationStorage.getToken();
      if (pendingInvitation && location.state?.returnTo === '/accept-invitation') {
        navigate('/accept-invitation?token=' + pendingInvitation);
      } else {
        navigate('/bidding-items');
      }
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-start ">
      <div className="flex items-center justify-center w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="backdrop-blur-lg bg-white/95 shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-center font-heading flex flex-col items-center">
            <img src="./home.jpeg" alt="Logo" className="w-24 h-26 flex items-center" />
              Welcome to EliteAuctions
             
            </CardTitle>
            <CardDescription className="text-center font-medium">
              best platform for bidding items online  
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="">
              
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
             
               {
                method=="login"?<Login changeMethod={changeMethod}/>: <Register changeMethod={changeMethod}/>
               }
                  
               
              </Tabs>
              
              
            </div>
            {location.state?.message && (
              <div className="text-center text-purple-600 mb-4">
                {location.state.message}
              </div>
            )}
          </CardContent>
         
        </Card>
      </motion.div>
      </div>  
      <div className=" w-full flex items-center justify-start h-full">
      <div className="md:w-1/2 w-full">
          <Lottie
            loop
            animationData={loginanimation}
            autoplay
            style={{ width: "500px",height:'600px'}}
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;
