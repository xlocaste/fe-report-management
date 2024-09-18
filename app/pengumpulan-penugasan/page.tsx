'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface pengumpulanPenugasan {
  id: number;
  penugasan_id: string;
  link_google_drive: string;
  user_id: string;
  catatan: string;
  status: string;
  penugasan: {
    id: number;
    nama_laporan: string;
    code: number;
    deadline: string;
    keterangan: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    password: string;
    remember_token: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

const PengumpulanPenugasan = () => {
  const router = useRouter();
  const token = Cookies.get("token");
  const [dataPengumpulanPenugasan, setDataPengumpulanPenugasan] = useState<pengumpulanPenugasan[]>([]);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get("http://localhost:8000/api/pengumpulan-penugasan")
      .then((response) => setDataPengumpulanPenugasan(response.data.data))
      .catch((error) => console.error("Error fetching pengumpulan penugasan items:", error));
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Cookies.remove("token");

      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Data Pengumpulan Penugasan
            </h1>
            <div className="mb-6">
              <Link href="pengumpulan-penugasan/create">
                <button className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  + Tambah Atau Buat
                </button>
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            {dataPengumpulanPenugasan.length > 0 ? (
              <ul>
                {dataPengumpulanPenugasan.map((pengumpulanPenugasanItem) => (
                  <li
                    key={pengumpulanPenugasanItem.id}
                    className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <p className="text-black">
                        Nama Tugas: {pengumpulanPenugasanItem.penugasan.nama_laporan}
                      </p>
                      <p className="text-black">
                        Code Tugas: {pengumpulanPenugasanItem.penugasan.code}
                      </p>
                      <p className="text-black">
                        Deadline: {pengumpulanPenugasanItem.penugasan.deadline}
                      </p>
                      <p className="text-black">
                        Keterangan: {pengumpulanPenugasanItem.penugasan.keterangan}
                      </p>
                      <p className="text-gray-600">
                        Link Google Drive : {pengumpulanPenugasanItem.link_google_drive}
                      </p>
                      <p className="text-gray-600">
                        User : {pengumpulanPenugasanItem.user.name}
                      </p>
                      <p className="text-gray-600">
                        Catatan : {pengumpulanPenugasanItem.catatan}
                      </p>
                      <p className="text-gray-600">
                        Status : {pengumpulanPenugasanItem.status}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/pengumpulan-penugasan/${pengumpulanPenugasanItem.id}/edit`}>
                        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-bold flex justify-center items-center">
                Daftar Tugas Kosong.
              </p>
            )}
          </div>
        </div>
      </div>
  );
};
export default PengumpulanPenugasan;