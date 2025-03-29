import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { BottomWarning } from "../components/BottomWarning";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {toast} from 'react-toastify'

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setemail] = useState("");
  const navigate = useNavigate();

 const onClickHandler = async () => {
   try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/signup",
      { userName, firstName, lastName, password, email },
      { headers: { "Content-Type": "application/json" } }
    );
    
     //console.log(response.data.token);
     localStorage.setItem("token", response.data.token);
     navigate("/dashboard");
     toast.success("Sign-up successful");
     
   } catch (error) {
     console.error("Signup failed:", error.response?.data || error.message);
     toast.error(error.response?.data?.message || "Signup failed. Try again.");
   }
 };




  return (
    <div className="bg-slate-300 h-screen flex justify-center border-s-violet-950">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="xavier"
            label={"userName"}
          />

          <InputBox
            value={firstName}
            onChange={(e) => {
              setfirstName(e.target.value);
            }}
            placeholder="John"
            label={"firstName"}
          />

          <InputBox
            value={lastName}
            onChange={(e) => {
              setlastName(e.target.value);
            }}
            placeholder="Doe"
            label={"lastName"}
          />

          <InputBox
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            placeholder="harkirat@gmail.com"
            label={"email"}
          />

          <InputBox
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"password"}
          />

          <div className="pt-4">
            <Button onClick={onClickHandler} label={"Sign up"} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
