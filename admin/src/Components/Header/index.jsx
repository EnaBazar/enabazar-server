import React, { useContext, useEffect } from 'react';
import { RiMenu2Line } from 'react-icons/ri';
import { FaRegBell, FaRegCommentDots } from 'react-icons/fa';
import { IoMdClose, IoMdLogOut } from 'react-icons/io';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Orders from '../../Pages/Orders/index.jsx';
import AdminChat from '../../Pages/Chat/AdminChat.jsx';
import io from 'socket.io-client'; // socket.io client

// Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styled Badge
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const context = useContext(MyContext);

  // --- Socket Setup ---
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
    });

    // Listen for new chat messages
    socket.on('new_chat_message', (msg) => {
      // যদি chat panel open না থাকে, unread increment করো
      if (context.isOpenFullScreenPanel.model !== 'Chat Panel') {
        context.setChatUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [context.isOpenFullScreenPanel.model]);

  // --- Fetch unread order count ---
  useEffect(() => {
    fetchDataFromApi("/order/unread-count").then(res => {
      if (!res.error) context.setOrderCount(res.unreadOrders);
    });
  }, []);

  // --- Account Menu ---
  const [anchorMyAcc, setAnchorMyAcc] = React.useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const handleClickMyAcc = (event) => setAnchorMyAcc(event.currentTarget);
  const handleCloseMyAcc = () => setAnchorMyAcc(null);

  // --- Logout ---
  const logout = async () => {
    await fetchDataFromApi("/auth/logout", { withCredentials: true });
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    context.setIsLogin(false);
    context.setUserData(null);
    window.location.href = "/login";
  };

  // --- Handle Bell Click ---
  const handleBellClick = async () => {
    if (context.orderCount === 0) return;
    await fetchDataFromApi("/order/mark-read", { method: "PUT" });
    context.setOrderCount(0);
    context.setIsOpenFullScreenPanel({ open: true, model: "Order List" });
  };

  // --- Handle Chat Click ---
  const handleChatClick = () => {
    context.setIsOpenFullScreenPanel({ open: true, model: "Chat Panel" });
    context.setChatUnreadCount(0); // Reset unread when opened
  };

  return (
    <>
      <header className={`w-full fixed h-[auto] pr-10 bg-[#fff] shadow-md
        flex items-center justify-between z-[50] transition-all duration-300
        ${context.isToggleSidebar ? "pl-5" : "pl-55"}`}>

        {/* Sidebar Toggle */}
        <div className='flex items-center'>
          <IconButton onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
            <RiMenu2Line className='text-[18px]' />
          </IconButton>
        </div>

        {/* Right Side */}
        <div className='flex items-center gap-4'>
          {/* Notification Bell */}
          <IconButton onClick={handleBellClick}>
            <StyledBadge badgeContent={context.orderCount} color="secondary">
              <FaRegBell />
            </StyledBadge>
          </IconButton>

          {/* Chat Icon */}
          <IconButton onClick={handleChatClick}>
            <StyledBadge badgeContent={context.chatUnreadCount} color="error">
              <FaRegCommentDots />
            </StyledBadge>
          </IconButton>

          {/* User Avatar */}
          {context.isLogin ? (
            <div className='relative'>
              <img
                src={context.userData?.avatar || "/user.png"}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/user.png"; }}
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={handleClickMyAcc}
              />
              <Menu anchorEl={anchorMyAcc} open={openMyAcc} onClose={handleCloseMyAcc} onClick={handleCloseMyAcc}>
                <MenuItem>{context.userData?.name}</MenuItem>
                <Divider />
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </Menu>
            </div>
          ) : (
            <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">Sign In</a>
          )}
        </div>
      </header>

      {/* FullScreen Panel */}
      <Dialog
        fullScreen
        open={context.isOpenFullScreenPanel.open}
        onClose={() => context.setIsOpenFullScreenPanel({ open: false })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => context.setIsOpenFullScreenPanel({ open: false })}>
              <IoMdClose />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {context.isOpenFullScreenPanel.model}
            </Typography>
          </Toolbar>
        </AppBar>

        {context.isOpenFullScreenPanel.model === "Order List" && <Orders />}
        {context.isOpenFullScreenPanel.model === "Chat Panel" && <AdminChat />}
      </Dialog>
    </>
  );
};

export default Header;