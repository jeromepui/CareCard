import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import { 
    Divider, 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    ListItemButton 
} from '@mui/material'
import { Link } from 'react-router-dom'

function NavigationDrawer({ isOpen, onClose, onSignOut }) {
    const handleSignOut = () => {
        onSignOut()
        onClose()
    }

    const navigationItems = [
        {
            icon: <HomeIcon />,
            text: 'Home',
            to: '/home',
            onClick: onClose,
            divider: true
        },
        {
            icon: <LogoutIcon />,
            text: 'Sign Out',
            onClick: handleSignOut
        }
    ]

    return (
        <Drawer 
            anchor="right" 
            open={isOpen} 
            onClose={onClose}
            role="navigation"
            aria-label="Main navigation"
        >
            <List>
                {navigationItems.map(({ icon, text, to, onClick, divider }) => (
                    <div key={text}>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={to ? Link : 'button'}
                                to={to}
                                onClick={onClick}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                        {divider && <Divider />}
                    </div>
                ))}
            </List>
        </Drawer>
    )
}

export default NavigationDrawer
