import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Account created successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const fields = [
    { label: "Name", type: "text", placeholder: "Enter your name", value: username, onChange: (e) => setName(e.target.value) },
    { label: "Email Address", type: "email", placeholder: "Enter email", value: email, onChange: (e) => setEmail(e.target.value) },
    { label: "Password", type: "password", placeholder: "Enter password", value: password, onChange: (e) => setPassword(e.target.value) },
    { label: "Confirm Password", type: "password", placeholder: "Confirm password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-gray-500 text-sm mt-0.5">Join us today</p>
          </div>
        </div>

        <form onSubmit={submitHandler} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">{f.label}</label>
              <input
                type={f.type}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                placeholder={f.placeholder}
                value={f.value}
                onChange={f.onChange}
              />
            </div>
          ))}

          {isLoading && <div className="flex justify-center py-1"><Loader /></div>}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold rounded-full py-3 text-sm mt-2 hover:shadow-lg hover:shadow-pink-900/40"
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;