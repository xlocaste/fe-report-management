'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface penugasan {
  id: number;
  nama_laporan: string;
  code: string;
  deadline: string;
  keterangan: string;
}

const Penugasan = () => {
  const router = useRouter();
  const token = Cookies.get("token");
  const [dataPenugasan, setDataPenugasan] = useState<penugasan[]>([]);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get("http://localhost:8000/api/penugasan")
      .then((response) => setDataPenugasan(response.data.data))
      .catch((error) => console.error("Error fetching paslon items:", error));
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

  const deletePenugasan = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/penugasan/${id}`)
      .then(() =>
        setDataPenugasan(dataPenugasan.filter((dataPenugasan) => dataPenugasan.id !== id))
      )
      .catch((error) => console.error("Error deleting penugasan:", error));
    alert("hapus data berhasil");
  };
  return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Data Penugasan
            </h1>
            <div className="mb-6">
              <Link href="penugasan/create">
                <button className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Tambah Tugas
                </button>
              </Link>
              <Link href="/pengumpulan-penugasan">
                <button className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Pengumpulan Tugas
                </button>
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>

            {dataPenugasan.length > 0 ? (
              <ul>
                {dataPenugasan.map((penugasanItem) => (
                  <li
                    key={penugasanItem.id}
                    className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <p className="text-black">
                        Nama Laporan: {penugasanItem.nama_laporan}
                      </p>
                      <p className="text-gray-600">
                        Code : {penugasanItem.code}
                      </p>
                      <p className="text-gray-600">
                        Deadline : {penugasanItem.deadline}
                      </p>
                      <p className="text-gray-600">
                        Keterangan : {penugasanItem.keterangan}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/penugasan/${penugasanItem.id}/edit`}>
                        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => deletePenugasan(penugasanItem.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Hapus dari Daftar
                      </button>
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
export default Penugasan;