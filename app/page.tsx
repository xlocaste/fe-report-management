"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [massage, setMassage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      Cookies.set("token", response.data.token);
      const user = response.data.data;
      const role = user.role;
   
      setMassage('Login successful');
      if (role === 'superVisor') {
        router.push("/penugasan"); // Supervisor masuk ke form penugasan
      } else if (role === 'karyawan') {
        router.push("/pengumpulan-penugasan"); // Karyawan masuk ke pengumpulan penugasan
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMassage(
          "login Gagal: " +
            (error.response?.data.massage || "Mungkin Ada Kesalahan")
        );
      } else {
        setMassage("Username atau password salah");
      }
    }
  };
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
          Selamat Datang
        </h1>

        <form
          action="#"
          onSubmit={handleLogin}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
          {massage && <p className="text-center">{massage}</p>}
          <p className="text-center text-lg font-medium">Masukan Akun Anda</p>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Masukan email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Masukan password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-500">
            belum punya akun?
            <a className="underline" href="register">
              Daftar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;