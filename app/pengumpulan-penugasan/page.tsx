'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface penugasan {
  id: number;
  nama_laporan: string;
  code: number;
  deadline: string;
  keterangan: string;
}

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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [pengumpulanPenugasan, setPengumpulanPenugasan] = useState<pengumpulanPenugasan[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup(!showPopup);
  const [link, setLink] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null); 
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const token = Cookies.get("token");
  const [penugasan, setPenugasan] = useState<penugasan[]>([]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("http://localhost:8000/api/user")
        .then((response) => {
          setUserId(response.data.id);
        })
        .catch((error) => console.error("Error fetching user data:", error));
        
      axios
        .get("http://localhost:8000/api/penugasan")
        .then((response) => setPenugasan(response.data.data))
        .catch((error) => console.error("Error fetching pengumpulan penugasan items:", error));
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const token = Cookies.get("token");
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userResponse = await axios.get("http://localhost:8000/api/user");
            setUserRole(userResponse.data.role);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
  }, []);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get("http://localhost:8000/api/pengumpulan-penugasan")
      .then((response) => setPengumpulanPenugasan(response.data.data))
      .catch((error) => console.error("Error fetching paslon items:", error));
  }, []);

  // Submit form
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    try {
      await axios.post(`http://localhost:8000/api/pengumpulan-penugasan`, {
        link_google_drive: link,
        penugasan_id: selectedTaskId,
        user_id: userId,
        status: 'baru'
      });

      alert('Link berhasil disimpan!');
      togglePopup();
    } catch (error) {
      setError('Gagal menyimpan link, pastikan link valid.');
    }
  };

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
            {userRole == "superVisor" && (
              <Link href="/penugasan">
                <button className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Buat Tugas Baru
                </button>
              </Link>
            )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            {penugasan.length > 0 ? (
              <ul>
                {penugasan.map((penugasanItem) => (
                  <li
                    key={penugasanItem.id}
                    className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <p className="text-black">
                        Nama Tugas: {penugasanItem.nama_laporan}
                      </p>
                      <p className="text-black">
                        Code Tugas: {penugasanItem.code}
                      </p>
                      <p className="text-black">
                        Deadline: {penugasanItem.deadline}
                      </p>
                      <p className="text-black">
                        Keterangan: {penugasanItem.keterangan}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                    {userRole == "karyawan" && (
                    <button
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      onClick={() => {
                        setSelectedTaskId(penugasanItem.id); // Simpan penugasan_id
                        togglePopup();
                      }}
                    >
                      Kerjakan
                    </button>
                    )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-bold flex justify-center items-center">
                Daftar Tugas Kosong.
              </p>
            )}
              <div>
              {pengumpulanPenugasan.length > 0 ? (
                <ul>
                  {pengumpulanPenugasan.map((pengumpulanPenugasanItem) => (
                    <li
                      key={pengumpulanPenugasanItem.id}
                      className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between"
                    >
                      <div className="flex flex-col">
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
        {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Masukkan Link Google Drive</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="url"
                placeholder="Masukkan Link Google Drive"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="border p-2 w-full mb-4"
                required
              />
              {error && <p className="text-red-500">{error}</p>}

              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Simpan
              </button>

              <button
                type="button"
                onClick={togglePopup}
                className="bg-red-500 text-white px-4 py-2 rounded ml-4"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
  );
};

export default PengumpulanPenugasan;
