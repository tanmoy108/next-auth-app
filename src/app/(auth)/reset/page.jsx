'use client'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"


export default function ResetPage() {
const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()


  const onSubmit = async (data) => {
    try {
      const { email  } = data;
      const userData = {
        email,
      };

      console.log(userData)

      const fetchDb = await fetch(`/api/reset`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (fetchDb.ok) {
        const uploadData = await fetchDb.json();

        if (uploadData.success !== undefined) {
          if (uploadData.success) {
            const info = uploadData.result;
            alert(info);
            reset();
            setTimeout(()=>{
              router.push("/");
            },2000)
          } else {
            alert(uploadData.result);
          }
        } else {
          alert("Unexpected response from the server");
        }
      }
    } catch (error) {
      console.error("Error during Reset Password", error);
     alert("An error occurred. Please try again.");
    }
  };
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
<div className="flex flex-col w-[2/3] md:w-1/3 items-center gap-3 ">
<form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
      ></input>
      <button
        type="submit"
        className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Send Link
      </button>
      </form>
    </div>        
    </div>
  )
}
