/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

enum StatusEnum {
    Revisi = "Revisi",
    Selesai = "Selesai",
    Baru = "Baru",
  }

const Create = () => {
  const [link_google_drive, setLinkGoogleDrive] = useState("");
  const [catatan, setCatatan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusEnum | "">("");
  const [daftarPenugasan, setDaftarPenugasan] = useState([]);
  const [selectedPenugasan, setSelectedPenugasan] = useState<
    number | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/penugasan`)
      .then((daftarPenugasan) =>
        setDaftarPenugasan(daftarPenugasan.data.data)
      )
      .catch((error) =>
        console.error("Error fetching Tugas items:", error)
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/pengumpulan-penugasan", {
        penugasan_id: selectedPenugasan,
        link_google_drive,
        catatan,
        status: selectedStatus,
      });
      router.push("/pengumpulan-penugasan");
    } catch (error) {
      console.error("Error creating buku:", error);
    }
  };

//   console.log('daftarPenugasan', daftarPenugasan);
//   console.log('daftarPenugasan lenght', daftarPenugasan.length);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Tambah Folder
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="link_google_drive"
              className="block text-gray-700 font-medium mb-1"
            >
              Link Google Drive
            </label>
            <input
              id="link_google_drive"
              type="text"
              value={link_google_drive}
              onChange={(e) => setLinkGoogleDrive(e.target.value)}
              placeholder="Link Google Drive"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="catatan"
              className="block text-gray-700 font-medium mb-1"
            >
              Catatan
            </label>
            <input
              id="catatan"
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-1"
            >
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as StatusEnum)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Pilih Status</option>
              {Object.values(StatusEnum).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
          <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-1"
            >
              Pilih Tugas
            </label>
            <select
              value={selectedPenugasan || ""}
              onChange={(e) =>
                setSelectedPenugasan(Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Pilih Nama Tugas</option>
              {daftarPenugasan.length > 0 ? (
                daftarPenugasan.map((penugasan: any) => {
                //   console.log("penugasan", penugasan);

                  return (
                    <option
                      key={penugasan.id}
                      value={penugasan.id}
                    >
                      {penugasan.nama_laporan}
                    </option>
                  );
                })
              ) : (
                <option value="">Tidak Ada Daftar Tugas</option>
              )}
            </select>
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