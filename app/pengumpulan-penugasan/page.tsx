'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Penugasan {
    id: number;
    nama_laporan: string;
    code: number;
    deadline: string;
    keterangan: string;
    created_at: string;
    updated_at: string;
  };

enum StatusEnum {
  REVISI = "revisi",
  SELESAI = "selesai",
  BARU = "baru",
}

interface User  {
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


interface PengumpulanPenugasan {
  id: number;
  penugasan_id: string;
  link_google_drive: string;
  user_id: string;
  catatan: string;
  status: string;
  penugasan: Penugasan;
  user: User
}

const PengumpulanPenugasan = () => {
  const [catatan, setCatatan] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusEnum>(StatusEnum.BARU);
  const [pengumpulanPenugasan, setPengumpulanPenugasan] = useState<PengumpulanPenugasan[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup(!showPopup);
  const [link, setLink] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null); 
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const token = Cookies.get("token");
  const [penugasan, setPenugasan] = useState<Penugasan[]>([]);
  const params = useParams();

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
      
      axios.get("http://localhost:8000/api/pengumpulan-penugasan")
        .then(response => {
          setPengumpulanPenugasan(response.data.data); // Ambil data pengumpulan penugasan
        })
        .catch(error => console.error("Error fetching pengumpulan penugasan data:", error));
    }
  }, [token]);

  useEffect(() => {
    const id = params.id;
    if (id) {
      axios
        .get(`http://localhost:8000/api/pengumpulan-penugasan/${id}`)
        .then((response) => {
          const pengumpulanPenugasan = response.data.data;
          setLink(pengumpulanPenugasan.link_google_drive);
            })
        .catch((error) => console.error("Error fetching pengumpulan-penugasan:", error));
    }
  }, [params.id]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit form
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    try {
      await axios.post(`http://localhost:8000/api/pengumpulan-penugasan`, {
        link_google_drive: link,
        penugasan_id: selectedTaskId,
        user_id: userId,
        status: 'baru',
      });

      alert('Link berhasil disimpan!');
      togglePopup();
    } catch (error) {
      setError('Anda sudah mengerjakan tugas yang di berikan');
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
                      {pengumpulanPenugasan.map((pengumpulanItem) =>
                        pengumpulanItem.penugasan_id === penugasanItem.id ? (
                          <p key={pengumpulanItem.id} className="text-black">
                            Status: {pengumpulanItem.status}
                          </p>
                        ) : null
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {userRole === "karyawan" && pengumpulanPenugasan.some((pengumpulanItem) =>
                        parseInt(pengumpulanItem.penugasan_id) === penugasanItem.id
                      ) ? (
                        <button
                          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                          onClick={() => {
                            setSelectedTaskId(penugasanItem.id);
                            togglePopup();
                          }}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                          onClick={() => {
                            setSelectedTaskId(penugasanItem.id);
                            togglePopup();
                          }}
                        >
                          Kerjakan
                        </button>
                      )}

                      {userRole === "superVisor" && (
                        <button
                          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                          onClick={() => {
                            setSelectedTaskId(penugasanItem.id);
                            togglePopup();
                          }}
                        >
                          Edit
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
          </div>
        </div>
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl mb-4 text-center">
                {userRole === "karyawan" ? "Masukkan atau Edit Link Google Drive" : "Edit Tugas"}
              </h2>
              
              {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
              
              <form onSubmit={handleSubmit}>
                {/* Input untuk karyawan */}
                {userRole === "karyawan" && (
                  <input
                    type="url"
                    placeholder="Masukkan Link Google Drive"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="border p-2 w-full mb-4"
                    required
                  />
                )}

                {/* Input untuk superVisor */}
                {userRole === "superVisor" && (
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
                      className="mb-4 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="">Pilih Status</option>
                      {Object.values(StatusEnum).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

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
                      placeholder="Berikan Catatan jika diperlukan"
                      className="mb-4 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                )}
                
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
