"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

const Edit = () => {
  const [nama_laporan, setNamaLaporan] = useState("");
  const [code, setCode] = useState("");
  const [deadline, setDeadline] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const token = Cookies.get("token");
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
  }, []);

  useEffect(() => {
    const id = params.id;
    if (id) {
      axios
        .get(`http://localhost:8000/api/penugasan/${id}`)
        .then((response) => {
          const penugasan = response.data.data;
          setNamaLaporan(penugasan.nama_laporan);
          setCode(penugasan.code);
          setDeadline(penugasan.deadline);
          setKeterangan(penugasan.keterangan);
            })
        .catch((error) => console.error("Error fetching penugasan:", error));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = params.id;
    if (id) {
      try {
        await axios.put(`http://localhost:8000/api/penugasan/${id}`, {
          nama_laporan,
          code,
          deadline,
          keterangan,
        });
        alert("update data berhasil");
        router.push("/penugasan");
      } catch (error) {
        console.error("Error updating penugasan:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Data Laporan
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="nama_laporan"
              >
                Nama Laporan
              </label>
              <input
                id="nama_laporan"
                type="text"
                value={nama_laporan}
                onChange={(e) => setNamaLaporan(e.target.value)}
                placeholder="Nama Laporan"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="Code"
              >
                Code Tugas
              </label>
              <input
                id="code"
                type="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code Tugas"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="deadline"
              >
                Deadline Penugasan
              </label>
              <input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Deadline Penugasan"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="keterangan"
              >
                Keterangan
              </label>
              <input
                id="keterangan"
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Keterangan"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;