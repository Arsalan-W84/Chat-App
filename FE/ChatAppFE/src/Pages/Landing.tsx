
import axios from "axios";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";

export function Landing () {
    const SetUser = useUserStore((state) => state.SetUser);
    const usernameRef = useRef<HTMLInputElement> (null);
    const PasswordRef = useRef<HTMLInputElement> (null);
    const [Disable , setDisable] = useState(false);
    const navigate = useNavigate();

    async function onSignup() {
        setDisable(true);
        const username = usernameRef.current?.value.trim();
        const password = PasswordRef.current?.value.trim();
        
        if(username =="" || password=="" ){
            alert("Input fields cannot be empty");
            setDisable(false);
            return;
            
        }
        try{
            const response = await axios.post("http://localhost:3000/signup" , 
                {
                    username,
                    password
                }  
            );
            if(response.status === 200){
                alert("Succesfully signed up!!");
                setDisable(false);
            }
            
        }catch(e : any) {
            if(e.response){
                alert(e.response.data.message);
            }else{
                console.log("Something went wrong!");
            }
        }
        setDisable(false);
    }

    async function onLogin() {
        setDisable(true);
        const username = usernameRef.current?.value.trim();
        const password = PasswordRef.current?.value.trim();

        if(username =="" || password=="" ){
            alert("Input fields cannot be empty");
            setDisable(false);
            return;
           
        } 
        try{
            const response = await axios.post("http://localhost:3000/signin" , 
                {
                    username,
                    password
                }  
            );

            if(response.status === 200){
                const user = response.data.user;
                SetUser(user);
                const token = response.data.token;
                localStorage.setItem("token" , token);
                alert("Login Successful");
                navigate("/dashboard");

            }
            
        }catch(e : any) {
            if(e.response){
                alert(e.response.data.message);
            }else{
                alert("Something went wrong!");
            }
        }
        setDisable(false);
    }

    return (
        <div className="h-screen w-screen bg-gray-500 flex items-center justify-center">
            <div className="w-[30%]  bg-gray-600 rounded-2xl border border-gray-200">
                <div className="p-2 text-xl text-white">
                    <h1> Sign up or login </h1>
                </div>
                
                <div className="m-3 "> 
                    <div className="m-4 p-2 border border-gray-200 rounded-2xl">
                        <input ref={usernameRef} type="text" placeholder="username..."  className="w-full border-none text-white outline-none placeholder:text-gray-300" />
                    </div>

                    <div className="m-4 p-2 border border-gray-200 rounded-2xl">
                        <input ref={PasswordRef} type="text" placeholder="password..."  className="w-full border-none text-white outline-none placeholder:text-gray-300 " />
                    </div>

                </div>

                <div className="m-4 buttons bg-blue-700 rounded-2xl text-white">
                    <button onClick={onLogin} disabled={Disable} className="p-2 w-full">{(Disable)?'...' : 'Login'}</button>
                </div>

                <div className="pl-4 text-white">Don't have an acoount ? Sign up first</div>

                <div className="m-4 buttons bg-blue-700 rounded-2xl text-white">
                    <button onClick={onSignup} disabled={Disable} className="p-2 w-full">{(Disable)?'...' : 'Signup'}</button>
                </div>
            </div>
        </div>
    ) 
    
}