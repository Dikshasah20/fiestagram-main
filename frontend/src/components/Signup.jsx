import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";


const Signup = () => {
  const {user} = useSelector((store)=>store.auth);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onChangeHandler= (e)=>{
    setInput({...input, [e.target.name]:e.target.value});
  }

  useEffect(()=>{
    if(user) navigate("/");
  },[])

  const signupHandler = async (e)=>{
    e.preventDefault();
    setLoading(true);
    console.log(input);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`,
        input,
        {
          headers:{
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )
      if(res.data.success){
        navigate("/login");
        toast.success(res.data.message,{
          // description: `usename: ${input.username}`,
          // action: {
          //   label: "Undo",
          //   onClick: () => console.log("Undo"),
          // }
        });
        setInput({username: "", email:"", password:""});
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong"); 
      console.log("error happen")
      toast.error(error.response.data.message);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col p-8 gap-5   ">
        <div className="my-4">
          <h1 className="text-center text-xl font-bold">LOGO</h1>
          <p className="text-sm text-center">Signup to see photos & videos of your friends  </p>
        </div>

        <div>
          <Label className="text-md"> Username</Label>
          <Input className="focus-visible:ring-transparent border-gray-500" 
          type="text"
          name="username"
          value={input.username} 
          onChange={onChangeHandler}
          />

          <Label className="text-md"> Email</Label>
          <Input className="focus-visible:ring-transparent border-gray-500 "
          type="email"
          name="email"
          value={input.email}
          onChange={onChangeHandler}
          />
          <Label className="text-md"> Password</Label>
          <Input className="focus-visible:ring-transparent border-gray-500 "
          type="password"
          name="password"
          value={input.password}
          onChange={onChangeHandler}
          />
        </div>
        {
          loading? (
            <Button>
              <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
              Please wait
            </Button>
          ) : (
            <Button type="submit" variant="outline" className= "bg-black rounded-xl text-white">Signup</Button>
          )
        }
        <span className="text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600"> Login</Link>
        </span>
      </form>
    </div>
  )
}

export default Signup