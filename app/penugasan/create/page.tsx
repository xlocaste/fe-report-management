/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Create = () => {
  const [nama_laporan, setNamaLaporan] = useState("");
  const [code, setCode] = useState("");
  const [deadline, setDeadline] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const token = Cookies.get("token");
  const router = useRouter();

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/penugasan", {
        nama_laporan,
        code,
        deadline,
        keterangan,
      });
      router.push("/penugasan");
    } catch (error) {
      console.error("Error creating penugasan:", error);
    }
  };

  //   console.log('daftarPaslon', daftarPaslon);
  //   console.log('daftarPaslon lenght', daftarPaslon.length);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Tambah Tugas
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nama_laporan"
              className="block text-gray-700 font-medium mb-1"
            >
              Nama Laporan
            </label>
            <input
              id="nama_laporan"
              type="text"
              value={nama_laporan}
              onChange={(e) => setNamaLaporan(e.target.value)}
              placeholder="Nama Laporan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="code"
              className="block text-gray-700 font-medium mb-1"
            >
              Code Laporan
            </label>
            <input
              id="code"
              type="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code Laporan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-gray-700 font-medium mb-1"
            >
              Tenggat Akhir Pengumpulan
            </label>
            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Tenggat Akhir Pengumpulan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="keterangan"
              className="block text-gray-700 font-medium mb-1"
            >
              Keterangan
            </label>
            <input
              id="keterangan"
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Keterangan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;