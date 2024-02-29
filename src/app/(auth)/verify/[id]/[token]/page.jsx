"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyPage = ({ params }) => {
  const [validUrl, setValidUrl] = useState(false);
  const { id, token } = params;
  const router = useRouter()

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `/api/verify/${id}/${token}`;
        const fetchData = await fetch(url);
        const data = await fetchData.json();
        console.log(data);
        if (data.success) {
          setValidUrl(true);
          alert(data.success);
          router.push("/")
        }
      } catch (error) {  alert(data.success);}
    };
    verifyEmailUrl();
  }, [id, token]);
  return <div>{validUrl.toString()}</div>;
};

export default VerifyPage;
