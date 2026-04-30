import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPublicImageUrl } from "../../../lib/requestApi";
import Modal from "../components/ui/Modal";
import useApiReqs from "../../../hooks/useApiReqs";
import PathHeader from "../components/PathHeader";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import ProfileImg from "../components/ProfileImg";
import ZeroItems from "../components/ZeroItems";
import ConfirmModal from "../components/ConfirmModal";
import { isoToDateTime } from "../../../lib/utils";

function Hospitals() {
  const dispatch = useDispatch();
  const { fetchHospitals, updateHospitalVerification, onboardHospital } = useApiReqs();

  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ visible: false, hide: null, data: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageListIndex, setPageListIndex] = useState(0);

  const loadHospitals = () => {
    fetchHospitals({
      callBack: ({ hospitals }) => {
        setHospitals(hospitals || []);
      }
    });
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  useEffect(() => {
    isModalOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  const openHospitalModal = (hospital) => {
    setSelectedUser(hospital);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleVerifyToggle = (hospital) => {
    const isVerifying = !hospital.is_verified;
    
    setConfirmModal({
      visible: true,
      hide: () => setConfirmModal({ visible: false, hide: null, data: null }),
      data: {
        title: isVerifying ? 'Verify Hospital' : 'Revoke Verification',
        msg: `Are you sure you want to ${isVerifying ? 'verify' : 'revoke verification for'} ${hospital.hospital_name}?`,
        yesFunc: () => {
          updateHospitalVerification({
            hospital_id: hospital.id,
            is_verified: isVerifying,
            callBack: ({ hospital: updatedHospital }) => {
              // Update state locally
              setHospitals(prev => prev.map(h => h.id === updatedHospital.id ? { ...h, is_verified: updatedHospital.is_verified } : h));
              if (selectedHospital && selectedHospital.id === updatedHospital.id) {
                setSelectedUser(prev => ({ ...prev, is_verified: updatedHospital.is_verified }));
              }
            }
          });
        }
      }
    });
  };

  const filteredHospitals = hospitals.filter((h) => {
    const name = h?.hospital_name || "";
    const email = h?.official_email || "";
    const phone = h?.phone_number || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredHospitals,
    maxShow: 10,
    index: currentPage,
    maxPage: 5,
    pageListIndex
  });

  const incrementPageListIndex = () => {
    if (pageListIndex === totalPageListIndex) {
      setPageListIndex(0);
    } else {
      setPageListIndex(prev => prev + 1);
    }
  };

  const decrementPageListIndex = () => {
    if (pageListIndex === 0) {
      setPageListIndex(totalPageListIndex);
    } else {
      setPageListIndex(prev => prev - 1);
    }
  };

  return (
    <div className="pt-6 w-full pb-5">
      <PathHeader 
        paths={[
          { text: 'Management' },
          { text: 'Hospitals' }
        ]}
      />

      <div className="bg-white px-[14px] md:px-[24px] pt-[20px] pb-[20px] rounded-[16px]">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-[24px] font-[800]">All Hospitals</h2>
            <p className="text-sm text-gray-500 pb-4 md:pb-0">
              Manage and verify registered hospitals
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 h-[44px] rounded-sm text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4.16666V15.8333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16666 10H15.8333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add New Hospital
            </button>
            <div className="relative">
              <svg
                className="absolute top-[12px] left-[14px]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
                  fill="#020201"
                />
              </svg>

              <input
                type="text"
                placeholder="Search hospitals..."
                className="border py-[10px] h-[44px] focus:border-black md:w-[320px] w-full focus:outline-1 pr-[14px] pl-[40px] border-gray-300 rounded-sm text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.length > 0 ? (
                pageItems.map((hospital) => {
                  const logo = hospital?.logo_url ? hospital?.logo_url : null;
                  const mainLocation = hospital?.hospital_locations?.find(l => l.is_main) || hospital?.hospital_locations?.[0] || {};
                  
                  return (
                    <tr key={hospital.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openHospitalModal(hospital)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProfileImg profile_img={logo} name={hospital.hospital_name} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {hospital.hospital_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mainLocation.city || 'N/A'}, {mainLocation.state || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isoToDateTime({ isoString: hospital.created_at })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hospital.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {hospital.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={(e) => { e.stopPropagation(); openHospitalModal(hospital); }} className="text-purple-600 hover:text-purple-900 mr-4">View</button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleVerifyToggle(hospital); }} 
                          className={`${hospital.is_verified ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {hospital.is_verified ? 'Revoke' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    <ZeroItems zeroText={'No hospitals found'} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            pageItems={pageItems}
            pageListIndex={pageListIndex}
            pageList={pageList}
            totalPageListIndex={totalPageListIndex}
            decrementPageListIndex={decrementPageListIndex}
            incrementPageListIndex={incrementPageListIndex}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedHospital && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ProfileImg 
                  profile_img={selectedHospital?.logo_url ? selectedHospital?.logo_url : null}
                  name={selectedHospital.hospital_name}
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-900">{selectedHospital.hospital_name}</h4>
                  <p className="text-sm text-gray-500">Hospital Partner</p>
                </div>
              </div>
              <Badge bg={selectedHospital.is_verified ? 'success' : 'warning'}>
                {selectedHospital.is_verified ? 'Verified' : 'Pending Verification'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-bottom pb-2">Contact Information</h5>
                <DetailItem label="Official Email" value={selectedHospital.official_email} />
                <DetailItem label="Phone" value={selectedHospital.phone_number} />
                <DetailItem label="Website" value={selectedHospital.website_link} />
              </div>
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-bottom pb-2">Location Details</h5>
                {(() => {
                  const loc = selectedHospital?.hospital_locations?.find(l => l.is_main) || selectedHospital?.hospital_locations?.[0] || {};
                  return (
                    <>
                      <DetailItem label="Address" value={loc.address} />
                      <DetailItem label="City/State" value={loc.city && loc.state ? `${loc.city}, ${loc.state}` : (loc.city || loc.state)} />
                    </>
                  );
                })()}
                <DetailItem label="Status" value={selectedHospital.status} />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleVerifyToggle(selectedHospital)}
                className={`px-6 py-2 rounded-lg text-white transition-colors ${selectedHospital.is_verified ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {selectedHospital.is_verified ? 'Revoke Verification' : 'Verify Hospital'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal modalProps={confirmModal} />

      <AddHospitalModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={loadHospitals}
        onboardHospital={onboardHospital}
      />
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 uppercase font-medium">{label}</span>
    <span className="text-sm text-gray-900 font-semibold">{value || 'N/A'}</span>
  </div>
);

const Badge = ({ children, bg }) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[bg] || colors.warning}`}>
      {children}
    </span>
  );
};

export default Hospitals;

const AddHospitalModal = ({ isOpen, onClose, onSuccess, onboardHospital }) => {
  const [formData, setFormData] = useState({
    hospital_name: "",
    full_name: "",
    email: "",
    password: "",
    hospital_phone: "",
    address: "",
    website_link: "",
    official_email: "",
    slug: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "hospital_name") {
        newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardHospital({
      values: formData,
      callBack: () => {
        onSuccess();
        onClose();
        setFormData({
          hospital_name: "",
          full_name: "",
          email: "",
          password: "",
          hospital_phone: "",
          address: "",
          website_link: "",
          official_email: "",
          slug: ""
        });
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Register New Hospital</h3>
        <p className="text-sm text-gray-500 mb-6">Create a new hospital entity and its primary administrator account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Hospital Name</label>
              <input 
                required
                name="hospital_name"
                value={formData.hospital_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="City General Hospital"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Hospital Slug (URL)</label>
              <input 
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 outline-none"
                placeholder="city-general-hospital"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Admin Full Name</label>
              <input 
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Dr. John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Admin Email</label>
              <input 
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="admin@hospital.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Temporary Password</label>
              <input 
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Hospital Phone</label>
              <input 
                required
                name="hospital_phone"
                value={formData.hospital_phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="+234..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Official Address</label>
            <textarea 
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none h-20"
              placeholder="123 Hospital Way, Health City"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Official Email (Optional)</label>
              <input 
                type="email"
                name="official_email"
                value={formData.official_email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="contact@hospital.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Website (Optional)</label>
              <input 
                name="website_link"
                value={formData.website_link}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="https://hospital.com"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Create Hospital
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
