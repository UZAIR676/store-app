import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => { refetch(); }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({ userId: id, username: editableUserName, email: editableUserEmail });
      setEditableUserId(null);
      refetch();
      toast.success("User updated");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminMenu />
      <div className="xl:ml-16 px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            <p className="text-gray-500 text-sm mt-0.5">{users?.length || 0} total users</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-4 text-left text-[11px] uppercase tracking-widest text-gray-500 font-bold">ID</th>
                  <th className="px-5 py-4 text-left text-[11px] uppercase tracking-widest text-gray-500 font-bold">Name</th>
                  <th className="px-5 py-4 text-left text-[11px] uppercase tracking-widest text-gray-500 font-bold">Email</th>
                  <th className="px-5 py-4 text-left text-[11px] uppercase tracking-widest text-gray-500 font-bold">Admin</th>
                  <th className="px-5 py-4 text-left text-[11px] uppercase tracking-widest text-gray-500 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-500 font-mono">{user._id.slice(-8)}...</td>

                    <td className="px-5 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-pink-500 w-32"
                          />
                          <button onClick={() => updateHandler(user._id)} className="bg-pink-600 hover:bg-pink-500 text-white p-1.5 rounded-lg transition-colors">
                            <FaCheck size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 text-xs font-bold uppercase flex-shrink-0">
                            {user.username?.[0]}
                          </div>
                          <span className="text-sm text-white font-medium">{user.username}</span>
                          <button onClick={() => toggleEdit(user._id, user.username, user.email)} className="text-gray-600 hover:text-pink-400 transition-colors ml-1">
                            <FaEdit size={13} />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-pink-500 w-40"
                          />
                          <button onClick={() => updateHandler(user._id)} className="bg-pink-600 hover:bg-pink-500 text-white p-1.5 rounded-lg transition-colors">
                            <FaCheck size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <a href={`mailto:${user.email}`} className="text-sm text-gray-400 hover:text-pink-400 transition-colors">{user.email}</a>
                          <button onClick={() => toggleEdit(user._id, user.username, user.email)} className="text-gray-600 hover:text-pink-400 transition-colors">
                            <FaEdit size={13} />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/30 text-green-400 px-2.5 py-1 rounded-full">
                          <FaCheck size={9} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-gray-800 border border-gray-700 text-gray-500 px-2.5 py-1 rounded-full">
                          <FaTimes size={9} /> User
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-200"
                        >
                          <FaTrash size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;