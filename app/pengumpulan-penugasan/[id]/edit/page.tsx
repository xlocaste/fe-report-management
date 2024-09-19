"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

enum StatusEnum {
    REVISI = "revisi",
    SELESAI = "selesai",
    BARU = "baru",
  }

const Edit = () => {
  const [link_google_drive, setLinkGoogleDrive] = useState("");
  const [catatan, setCatatan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusEnum>(StatusEnum.BARU);
  const [penugasanId, setPenugasanId] = useState<string | null>(null); 
  const [userRole, setUserRole] = useState<string | null>(null);
  const token = Cookies.get("token");
  const params = useParams();
  const router = useRouter();
  // const [pengumpualnPenugasan, setPengumpulanPenugasan] = useState({  })

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
    const id = params.id;
    if (id) {
      axios
        .get(`http://localhost:8000/api/pengumpulan-penugasan/${id}`)
        .then((response) => {
          const pengumpulanPenugasan = response.data.data;
          setLinkGoogleDrive(pengumpulanPenugasan.link_google_drive);
          setCatatan(pengumpulanPenugasan.catatan);
          setPenugasanId(pengumpulanPenugasan.penugasan_id);
            })
        .catch((error) => console.error("Error fetching pengumpulan-penugasan:", error));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = params.id;
    if (id) {
      try {
        await axios.put(`http://localhost:8000/api/pengumpulan-penugasan/${id}`, {
          penugasan_id: penugasanId,
          link_google_drive,
          catatan,
          status: selectedStatus,
        });
        alert("update data berhasil");
        router.push("/pengumpulan-penugasan");
      } catch (error) {
        console.error("Error updating pengumpulan-penugasan:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Data Tugas
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="link_google_drive"
              >
                Link Google Drive
              </label>
             
              <input
                id="link_google_drive"
                type="text"
                value={link_google_drive}
                onChange={(e) => setLinkGoogleDrive(e.target.value)}
                placeholder="Link Google Drive"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
          
            </div>
                {userRole == "superVisor" && (
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
                )}
                {userRole == "superVisor" && (
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
                )}
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