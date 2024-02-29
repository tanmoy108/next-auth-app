"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const ResetPassword = ({ params }) => {
  const router = useRouter();
  const [validUrl, setValidUrl] = useState(false);
  const { id, token } = params;
  console.log("reset/id/token/page : " +id+" "+token)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `/api/reset/${id}/${token}`;
        const fetchData = await fetch (url)
        const data = await fetchData.json() 
        console.log(data)
        if (data.success == true) {
          setValidUrl(true);
          alert(data.result);
          //   router.push("/features/signin");
        }
        else alert(data.result)
      } catch (error) {
        console.log("reset/id/token/page: ",error)
        toast.error(data.result);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [id, token, router]);

  const onSubmit = async (data) => {
    try {
      const { password } = data;
      const userData = {
        password,
      };

      const fetchDb = await fetch(
        `/api/reset/${id}/${token}`,
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (fetchDb.ok) {
        const uploadData = await fetchDb.json();

        if (uploadData.success !== undefined) {
          if (uploadData.success) {
            const info = uploadData.result;
            alert(info);
            reset();
            setTimeout(() => {
              router.push("/");
            }, 2000);
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
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {validUrl ? (
          <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Reset Password
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      type="password"
                      placeholder="Password"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF6701] sm:text-sm sm:leading-6 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#FF6701] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#a84705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6701]"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <h1>Wait for a minute . if its too long then retry login</h1>
        )}
      </div>
    </>
  );
};

export default ResetPassword;