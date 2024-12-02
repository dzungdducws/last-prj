"use client";

import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import { useRouter } from "next/navigation";
  
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu đang ở client, vì localStorage chỉ có trên client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        router.replace("/dashboard");
        return;
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Đang xử lý
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });
      console.log(response);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.access_token);
      }

      router.replace("/dashboard");
    } catch (err) {
      setError("Đăng nhập thất bại. Kiểm tra lại thông tin.");
    } finally {
      setLoading(false); // Kết thúc xử lý
    }
  };

  const handleToSignup = () => {
    router.replace("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="login-container p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Đăng nhập
          </h1>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Thông báo lỗi */}
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg"
              disabled={loading} // Vô hiệu hóa nút khi đang xử lý
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          <button
            onClick={() => handleToSignup()}
            className="w-full py-2 px-4 bg-blue-300 text-white rounded-lg"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
