import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import { ErrorMessage, Formik } from "formik";
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import useApiReqs from "../../../hooks/useApiReqs";
import { toast } from "react-toastify";

function NewRole() {

  const navigate = useNavigate()

  const { state } = useLocation()
  const role_id = state?.role_id

  const { createRole, getRoleInfo, updateRole } = useApiReqs()

  const roles = useSelector(state => getUserDetailsState(state).roles)
  const allPermissions = useSelector(state => getUserDetailsState(state).allPermissions)

  const [selectedPermIds, setSelectedPermIds] = useState([])
  const [role, setRole] = useState(null)

  useEffect(() => {
    if (role_id) {
      getRoleInfo({
        callBack: ({ role, permIds }) => {
          if (!role || !permIds) return toast.info("Role not found. Mode set to create a new one!");

          setRole(role, setSelectedPermIds(permIds))
        },
        role_id
      })
    }
  }, [])

  return (
    <Formik
      enableReinitialize
      validationSchema={yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required"),
      })}
      initialValues={{
        name: role?.name || '',
        description: role?.description || '',
      }}
      onSubmit={values => {

        const { name } = values

        if (name?.toLowerCase().includes("super") || name?.toLowerCase().includes("admin")) return toast.info("Key-words super and admin are not allowed")

        if (role?.id) {          
          updateRole({
            callBack: ({ }) => {
              navigate('/admin/settings/roles')
            },
            name: values.name,
            description: values.description,
            permIds: selectedPermIds,
            role_id: role?.id
          })

          return;
        }

        createRole({
          callBack: ({ }) => {
            navigate('/admin/settings/roles')
          },
          name: values.name,
          description: values.description,
          permIds: selectedPermIds
        })
      }}
    >
      {({ values, handleBlur, handleSubmit, handleChange }) => (
        <div className="pt-6 mb-8">
          {/* add new role title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {
                role
                  ?
                  `Update role: ${role?.name}`
                  :
                  'Add New Role'
              }
            </h2>
          </div>

          <div className="bg-white rounded-xl p-2 md:p-6 w-full relative animate-fadeIn">
            <p className="text-base font-bold mb-4">Basic Information</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder="e.g. Support Manager"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <ErrorMessage name="name">
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Role Description
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder="Define the responsibilities for this role"
                  rows={5}
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                />
                <ErrorMessage name="description">
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                <label className="block text-xl font-semibold mb-4">
                  Permissions
                </label>
                <table className="w-full border border-gray-200 rounded-lg text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Permission</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allPermissions?.map((perm, idx) => {

                      const isSelected = selectedPermIds?.includes(perm?.id)

                      const handleSelect = () => {
                        if (isSelected) return setSelectedPermIds(selectedPermIds?.filter(pId => pId !== perm?.id));

                        setSelectedPermIds([...selectedPermIds, perm?.id])
                      }

                      return (
                        <tr key={idx} className="hover:bg-gray-50" onClick={handleSelect}>
                          <td className="px-4 py-3 font-medium text-gray-800">{perm?.key}</td>
                          <td className="px-4 py-3 text-gray-700">{perm?.description || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {
                              isSelected
                                ?
                                <IoCheckbox color="#703dcb" size={20} />
                                :
                                <MdCheckBoxOutlineBlank color="grey" size={20} />
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 justify-between mt-4">
                <Link to="/admin/settings/roles"
                  className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm"
                >
                  Back
                </Link>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default NewRole;
