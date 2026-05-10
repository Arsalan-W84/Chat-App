
import axios from "axios";
import { useRef } from "react"

export function Landing () {
    const usernameRef = useRef<HTMLInputElement> (null);
    const PasswordRef = useRef<HTMLInputElement> (null);

    async function onSignup() {
        const username = usernameRef.current?.value.trim();
        const password = PasswordRef.current?.value.trim();
        
        if(username =="" || password=="" ){
            alert("Input fields cannot be empty");
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
            }
            
        }catch(e : any) {
            if(e.response){
                alert(e.response.data.message);
            }else{
                console.log("Something went wrong!");
            }
        }
    }

    async function onLogin() {
        console.log("Login");
        const username = usernameRef.current?.value.trim();
        const password = PasswordRef.current?.value.trim();

        if(username =="" || password=="" ){
            alert("Input fields cannot be empty");
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
                const token = response.data.token;
                localStorage.setItem("token" , token);
            }
            
        }catch(e : any) {
            if(e.response){
                alert(e.response.data.message);
            }else{
                console.log("Something went wrong!");
            }
        }
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
                    <button onClick={onLogin} className="p-2 w-full">Login</button>
                </div>

                <div className="pl-4">Don't have an acoount ? Sign up first</div>

                <div className="m-4 buttons bg-blue-700 rounded-2xl text-white">
                    <button onClick={onSignup} className="p-2 w-full">Signup</button>
                </div>
            </div>
        </div>
    ) 
    
}