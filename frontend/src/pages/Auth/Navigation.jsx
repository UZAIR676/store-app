import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { FiSettings, FiLogOut, FiUser, FiGrid, FiX, FiMenu } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

/* ─── Desktop sidebar nav link ─── */
const SideNavLink = ({ to, icon: Icon, label, badge }) => (
  <Link
    to={to}
    className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 transition-all duration-200"
  >
    <div className="relative flex-shrink-0">
      <Icon size={20} />
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full px-0.5">
          {badge}
        </span>
      )}
    </div>
    <span className="text-sm font-medium whitespace-nowrap overflow-hidden w-0 group-hover:w-24 opacity-0 group-hover:opacity-100 transition-all duration-300">
      {label}
    </span>
  </Link>
);

/* ─── Mobile bottom tab ─── */
const BottomTab = ({ to, icon: Icon, label, badge }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors duration-200 ${
        active ? "text-pink-400" : "text-gray-500"
      }`}
    >
      <div className="relative">
        <Icon size={22} />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] flex items-center justify-center bg-pink-500 text-white text-[9px] font-bold rounded-full px-0.5">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
};

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP SIDEBAR (lg and above)
      ══════════════════════════════════ */}
      <div
        style={{ zIndex: 9999 }}
        className="hidden lg:flex flex-col justify-between py-6 px-3 bg-gray-950 border-r border-gray-800/60 w-16 hover:w-52 h-screen fixed top-0 left-0 transition-all duration-300 group/nav overflow-hidden"
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white text-sm">
              S
            </div>
            <span className="text-white font-bold text-base whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all duration-300">
              Store
            </span>
          </div>

          <nav className="flex flex-col gap-1">
            <SideNavLink to="/"         icon={AiOutlineHome}         label="Home" />
            <SideNavLink to="/shop"     icon={AiOutlineShopping}     label="Shop" />
            <SideNavLink to="/cart"     icon={AiOutlineShoppingCart} label="Cart"      badge={cartCount} />
            <SideNavLink to="/favorite" icon={FaHeart}               label="Favorites" badge={0} />
          </nav>
        </div>

        {/* Bottom user */}
        <div className="flex flex-col gap-1">
          {userInfo ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all duration-200 w-full text-left"
              >
                <div className="w-5 h-5 flex-shrink-0 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <span className="text-pink-400 text-[10px] font-bold uppercase">
                    {userInfo.username?.[0]}
                  </span>
                </div>
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 truncate">
                  {userInfo.username}
                </span>
              </button>

              {dropdownOpen && (
                <div className="flex flex-col gap-0.5 border-t border-gray-800 pt-2 mt-1">
                  {userInfo.isAdmin && (
                    <>
                      <Link to="/admin/dashboard"    className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 text-sm transition-all"><FiGrid size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Dashboard</span></Link>
                      <Link to="/admin/productlist"  className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 text-sm transition-all"><AiOutlineShopping size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Products</span></Link>
                      <Link to="/admin/categorylist" className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 text-sm transition-all"><FiSettings size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Category</span></Link>
                      <Link to="/admin/orderlist"    className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 text-sm transition-all"><AiOutlineShoppingCart size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Orders</span></Link>
                      <Link to="/admin/userlist"     className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 text-sm transition-all"><FiUser size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Users</span></Link>
                    </>
                  )}
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/70 text-sm transition-all"><FiUser size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Profile</span></Link>
                  <button onClick={logoutHandler} className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all w-full text-left"><FiLogOut size={16} className="flex-shrink-0" /><span className="whitespace-nowrap overflow-hidden w-0 group-hover/nav:w-24 opacity-0 group-hover/nav:opacity-100 transition-all">Logout</span></button>
                </div>
              )}
            </>
          ) : (
            <>
              <SideNavLink to="/login"    icon={AiOutlineLogin}   label="Login" />
              <SideNavLink to="/register" icon={AiOutlineUserAdd} label="Register" />
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE TOP BAR (below lg)
      ══════════════════════════════════ */}
      <div
        style={{ zIndex: 9999 }}
        className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gray-950 border-b border-gray-800/60 flex items-center justify-between px-4"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white text-sm">
            S
          </div>
          <span className="text-white font-bold text-base">Store</span>
        </Link>

        {/* Right side: cart + menu */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <AiOutlineShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-pink-500 text-white text-[9px] font-bold rounded-full px-0.5">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE SLIDE-IN DRAWER
      ══════════════════════════════════ */}
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          style={{ zIndex: 10000 }}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        style={{ zIndex: 10001 }}
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-gray-950 border-l border-gray-800 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white text-sm">S</div>
            <span className="text-white font-bold">Store</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {[
            { to: "/",         icon: AiOutlineHome,         label: "Home" },
            { to: "/shop",     icon: AiOutlineShopping,     label: "Shop" },
            { to: "/cart",     icon: AiOutlineShoppingCart, label: "Cart", badge: cartCount },
            { to: "/favorite", icon: FaHeart,               label: "Favorites" },
          ].map(({ to, icon: Icon, label, badge }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"
            >
              <div className="relative">
                <Icon size={20} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] flex items-center justify-center bg-pink-500 text-white text-[9px] font-bold rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-800 my-2" />

          {userInfo ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 mb-1">
                <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <span className="text-pink-400 text-sm font-bold uppercase">{userInfo.username?.[0]}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{userInfo.username}</p>
                  <p className="text-gray-500 text-xs">{userInfo.email}</p>
                </div>
              </div>

              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium">
                <FiUser size={18} /> Profile
              </Link>

              {userInfo.isAdmin && (
                <>
                  <div className="px-4 py-1.5">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Admin</p>
                  </div>
                  <Link to="/admin/dashboard"    onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><FiGrid size={18} /> Dashboard</Link>
                  <Link to="/admin/productlist"  onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><AiOutlineShopping size={18} /> Products</Link>
                  <Link to="/admin/categorylist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><FiSettings size={18} /> Categories</Link>
                  <Link to="/admin/orderlist"    onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><AiOutlineShoppingCart size={18} /> Orders</Link>
                  <Link to="/admin/userlist"     onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><FiUser size={18} /> Users</Link>
                </>
              )}

              <div className="border-t border-gray-800 my-2" />
              <button
                onClick={logoutHandler}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium w-full text-left"
              >
                <FiLogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><AiOutlineLogin size={20} /> Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all text-sm font-medium"><AiOutlineUserAdd size={20} /> Register</Link>
            </>
          )}
        </nav>
      </div>

      {/* ══════════════════════════════════
          MOBILE BOTTOM TAB BAR
      ══════════════════════════════════ */}
      <div
        style={{ zIndex: 9999 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-gray-950 border-t border-gray-800/60 flex items-stretch"
      >
        <BottomTab to="/"         icon={AiOutlineHome}         label="Home" />
        <BottomTab to="/shop"     icon={AiOutlineShopping}     label="Shop" />
        <BottomTab to="/cart"     icon={AiOutlineShoppingCart} label="Cart"  badge={cartCount} />
        <BottomTab to="/favorite" icon={FaHeart}               label="Saved" />
        {userInfo ? (
          <Link
            to="/profile"
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-gray-500"
          >
            <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
              <span className="text-pink-400 text-[9px] font-bold uppercase">{userInfo.username?.[0]}</span>
            </div>
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        ) : (
          <BottomTab to="/login" icon={AiOutlineLogin} label="Login" />
        )}
      </div>
    </>
  );
};

export default Navigation;