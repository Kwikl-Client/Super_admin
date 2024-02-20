// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon
};

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'navigation',
      title: 'Materially',
      caption: 'Dashboard',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      caption: 'Prebuild Pages',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'Users',
          title: 'Users',
          type: 'item',
          url: '/sample-page',
          icon: icons['ChromeReaderModeOutlinedIcon']
        },
        {
          id: 'edit',
          title: 'Content Edit',
          type: 'item',
          url: '/content-page',
          icon: icons['ChromeReaderModeOutlinedIcon']
        },
        {
          id: 'Sales',
          title: 'Sales Details',
          type: 'item',
          url: '/sales-page',
          icon: icons['ChromeReaderModeOutlinedIcon']
        },
        {
          id: 'login-1',
          title: 'LogOut',
          type: 'item',
          url: '/application/login',
          target: true
        }
        
      ]
    }
  ]
}  
  