import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
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

function Pharmacies() {
  const dispatch = useDispatch();
  const { fetchPharmacies, approvePharmacy } = useApiReqs();

  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedUser] = useState(null); // Keep naming consistent with template if needed, but 'selectedPharmacy' is better
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ visible: false, hide: null, data: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageListIndex, setPageListIndex] = useState(0);

  const loadPharmacies = () => {
    fetchPharmacies({
      callBack: ({ pharmacies }) => {
        setPharmacies(pharmacies || []);
      }
    });
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  useEffect(() => {
    isModalOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  const openPharmacyModal = (pharmacy) => {
    setSelectedUser(pharmacy);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleApproveToggle = (pharmacy) => {
    const isApproving = !pharmacy.is_approved;
    
    setConfirmModal({
      visible: true,
      hide: () => setConfirmModal({ visible: false, hide: null, data: null }),
      data: {
        title: isApproving ? 'Approve Pharmacy' : 'Revoke Approval',
        msg: `Are you sure you want to ${isApproving ? 'approve' : 'revoke approval for'} ${pharmacy.pharmacy_name}?`,
        yesFunc: () => {
          approvePharmacy({
            pharmacy_id: pharmacy.id,
            is_approved: isApproving,
            callBack: ({ pharmacy: updatedPharmacy }) => {
              setPharmacies(prev => prev.map(p => p.id === updatedPharmacy.id ? updatedPharmacy : p));
              if (selectedPharmacy && selectedPharmacy.id === updatedPharmacy.id) {
                setSelectedUser(updatedPharmacy);
              }
            }
          });
        }
      }
    });
  };

  const filteredPharmacies = pharmacies.filter((p) => {
    const name = p?.pharmacy_name || "";
    const email = p?.email || "";
    const address = p?.address || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredPharmacies,
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
          { text: 'Pharmacies' }
        ]}
      />

      <div className="bg-white px-[14px] md:px-[24px] pt-[20px] pb-[20px] rounded-[16px]">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-[24px] font-[800]">All Pharmacies</h2>
            <p className="text-sm text-gray-500 pb-4 md:pb-0">
              Manage and approve registered pharmacies
            </p>
          </div>

          <div className="flex gap-2 items-center">
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
                placeholder="Search pharmacies..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pharmacy Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.length > 0 ? (
                pageItems.map((pharmacy) => {
                  const logo = pharmacy?.profile_img ? getPublicImageUrl({ path: pharmacy?.profile_img, bucket_name: 'user_profiles' }) : null;
                  return (
                    <tr key={pharmacy.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openPharmacyModal(pharmacy)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProfileImg profile_img={logo} name={pharmacy.pharmacy_name} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pharmacy.pharmacy_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pharmacy.city}, {pharmacy.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isoToDateTime({ isoString: pharmacy.created_at })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pharmacy.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {pharmacy.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={(e) => { e.stopPropagation(); openPharmacyModal(pharmacy); }} className="text-purple-600 hover:text-purple-900 mr-4">View</button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleApproveToggle(pharmacy); }} 
                          className={`${pharmacy.is_approved ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {pharmacy.is_approved ? 'Revoke' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    <ZeroItems zeroText={'No pharmacies found'} />
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
        {selectedPharmacy && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ProfileImg 
                  profile_img={selectedPharmacy?.profile_img ? getPublicImageUrl({ path: selectedPharmacy?.profile_img, bucket_name: 'user_profiles' }) : null}
                  name={selectedPharmacy.pharmacy_name}
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-900">{selectedPharmacy.pharmacy_name}</h4>
                  <p className="text-sm text-gray-500">Pharmacy Partner</p>
                </div>
              </div>
              <Badge bg={selectedPharmacy.is_approved ? 'success' : 'warning'}>
                {selectedPharmacy.is_approved ? 'Approved' : 'Pending Approval'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-bottom pb-2">Contact Information</h5>
                <DetailItem label="Email" value={selectedPharmacy.email} />
                <DetailItem label="Phone" value={selectedPharmacy.phone} />
                <DetailItem label="Owner" value={selectedPharmacy.owner_name} />
              </div>
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-bottom pb-2">Business Details</h5>
                <DetailItem label="License" value={selectedPharmacy.license_number} />
                <DetailItem label="Address" value={selectedPharmacy.address} />
                <DetailItem label="City/State" value={`${selectedPharmacy.city}, ${selectedPharmacy.state}`} />
                <DetailItem label="Zip" value={selectedPharmacy.zip_code} />
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
                onClick={() => handleApproveToggle(selectedPharmacy)}
                className={`px-6 py-2 rounded-lg text-white transition-colors ${selectedPharmacy.is_approved ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {selectedPharmacy.is_approved ? 'Revoke Approval' : 'Approve Pharmacy'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal modalProps={confirmModal} />
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

export default Pharmacies;
