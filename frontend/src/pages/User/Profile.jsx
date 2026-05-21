import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const InputField = ({ label, type, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
    />
  </div>
);

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-gray-500 text-sm mt-0.5">Update your account details</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
          <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-2xl font-bold text-pink-400 uppercase flex-shrink-0">
            {userInfo.username?.[0]}
          </div>
          <div>
            <p className="text-white font-semibold">{userInfo.username}</p>
            <p className="text-gray-500 text-sm">{userInfo.email}</p>
            {userInfo.isAdmin && (
              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-widest bg-pink-500/10 border border-pink-500/30 text-pink-400 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
          <InputField
            label="Username"
            type="text"
            placeholder="Enter name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="border-t border-gray-800 pt-4 flex flex-col gap-4">
            <InputField
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {loadingUpdateProfile && (
            <div className="flex justify-center py-2">
              <Loader />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loadingUpdateProfile}
              className="flex-1 group flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold rounded-full py-3 text-sm hover:shadow-lg hover:shadow-pink-900/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>

            <Link
              to="/user-orders"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-200 text-gray-300 hover:text-white font-semibold rounded-full py-3 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              My Orders
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;