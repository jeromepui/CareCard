import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
function NavigationDrawer({ isOpen, onClose, onSignOut }) {
    const handleSignOut = () => {
        onSignOut()
        onClose()
    }
    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <List>
                <ListItem component={Link} to="/home" onClick={onClose}>
                    <ListItemIcon sx={{ cursor: 'pointer' }}>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText sx={{ cursor: 'pointer' }} primary="Home" />
                </ListItem>
                <Divider />
                <ListItem onClick={handleSignOut}>
                    <ListItemIcon sx={{ cursor: 'pointer' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText sx={{ cursor: 'pointer' }} primary="Sign Out" />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default NavigationDrawer
