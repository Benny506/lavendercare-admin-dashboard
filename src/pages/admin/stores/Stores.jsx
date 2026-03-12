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

function Stores() {
  const dispatch = useDispatch();
  const { fetchStores, approveStore } = useApiReqs();

  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ visible: false, hide: null, data: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageListIndex, setPageListIndex] = useState(0);

  const loadStores = () => {
    fetchStores({
      callBack: ({ stores }) => {
        setStores(stores || []);
      }
    });
  };

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    isModalOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  const openStoreModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handleApproveToggle = (store) => {
    const isApproving = !store.is_approved;
    
    setConfirmModal({
      visible: true,
      hide: () => setConfirmModal({ visible: false, hide: null, data: null }),
      data: {
        title: isApproving ? 'Approve Store' : 'Revoke Approval',
        msg: `Are you sure you want to ${isApproving ? 'approve' : 'revoke approval for'} ${store.store_name}?`,
        yesFunc: () => {
          approveStore({
            store_id: store.id,
            is_approved: isApproving,
            callBack: ({ store: updatedStore }) => {
              setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
              if (selectedStore && selectedStore.id === updatedStore.id) {
                setSelectedStore(updatedStore);
              }
            }
          });
        }
      }
    });
  };

  const filteredStores = stores.filter((s) => {
    const name = s?.store_name || "";
    const owner = s?.owner_name || "";
    const city = s?.city || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredStores,
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
          { text: 'Stores' }
        ]}
      />

      <div className="bg-white px-[14px] md:px-[24px] pt-[20px] pb-[20px] rounded-[16px]">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-[24px] font-[800]">All Stores</h2>
            <p className="text-sm text-gray-500 pb-4 md:pb-0">
              Manage and approve registered product stores
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
                placeholder="Search stores..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.length > 0 ? (
                pageItems.map((store) => {
                  const logo = store?.profile_img ? getPublicImageUrl({ path: store?.profile_img, bucket_name: 'user_profiles' }) : null;
                  return (
                    <tr key={store.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openStoreModal(store)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProfileImg profile_img={logo} name={store.store_name} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {store.store_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.owner_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isoToDateTime({ isoString: store.created_at })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${store.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {store.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={(e) => { e.stopPropagation(); openStoreModal(store); }} className="text-purple-600 hover:text-purple-900 mr-4">View</button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleApproveToggle(store); }} 
                          className={`${store.is_approved ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {store.is_approved ? 'Revoke' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    <ZeroItems zeroText={'No stores found'} />
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
        {selectedStore && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ProfileImg 
                  profile_img={selectedStore?.profile_img ? getPublicImageUrl({ path: selectedStore?.profile_img, bucket_name: 'user_profiles' }) : null}
                  name={selectedStore.store_name}
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-900">{selectedStore.store_name}</h4>
                  <p className="text-sm text-gray-500">Product Store Partner</p>
                </div>
              </div>
              <Badge bg={selectedStore.is_approved ? 'success' : 'warning'}>
                {selectedStore.is_approved ? 'Approved' : 'Pending Approval'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-bottom pb-2">Owner Information</h5>
                <div className="flex items-center gap-3 mb-2">
                   <ProfileImg 
                      profile_img={selectedStore?.owner_profile_img ? getPublicImageUrl({ path: selectedStore?.owner_profile_img, bucket_name: 'user_profiles' }) : null}
                      name={selectedStore.owner_name}
                      size="w-12 h-12"
                    />
                    <DetailItem label="Owner Name" value={selectedStore.owner_name} />
                </div>
                <DetailItem label="Caption" value={selectedStore.caption} />
                <DetailItem label="Bio" value={selectedStore.bio} />
              </div>
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-bottom pb-2">Location Details</h5>
                <DetailItem label="Country" value={selectedStore.country} />
                <DetailItem label="State" value={selectedStore.state} />
                <DetailItem label="City" value={selectedStore.city} />
                <DetailItem label="Joined" value={isoToDateTime({ isoString: selectedStore.created_at })} />
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
                onClick={() => handleApproveToggle(selectedStore)}
                className={`px-6 py-2 rounded-lg text-white transition-colors ${selectedStore.is_approved ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {selectedStore.is_approved ? 'Revoke Approval' : 'Approve Store'}
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

export default Stores;
