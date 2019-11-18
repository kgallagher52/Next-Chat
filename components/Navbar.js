import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import ActiveLink from './ActiveLink';

const Navbar = ({ classes, router, pageProps: { auth } }) => {
	//Grab user
	const { user = {} } = auth || {};

	return (
		<AppBar className={classes.appBar} position={router.pathname === '/' ? 'fixed' : 'static'}>
			<Toolbar>
				<ActiveLink href="/">
					<ShareOutlined className={classes.icon} />
				</ActiveLink>
				<Typography variant="h5" component="h1" className={classes.toolbarTitle}>
					<ActiveLink href="/">Next Chat</ActiveLink>
				</Typography>
				{user._id ? (
					// Auth Navigation
					<div>
						<Button className={classes.button}>
							<ActiveLink href="/profile">Profile</ActiveLink>
						</Button>
						<Button className={classes.button} variant="outlined">
							Sign Out
						</Button>
					</div>
				) : (
					// unAuth Navigation
					<div>
						<Button className={classes.button}>
							<ActiveLink href="/signin">Sign In</ActiveLink>
						</Button>
						<Button className={classes.button}>
							<ActiveLink href="/signup">Sign Up</ActiveLink> 
						</Button>
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
};

const styles = (theme) => ({
	appBar: {
		// z-index 1 higher than the fixed drawer in home page to clip it under the navigation
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	toolbarTitle: {
		flex: 1,
		color: '#fff',
		fontWeight: 600
	},
	icon: {
		marginRight: theme.spacing.unit
	},
	button: {
		color: '#fff',
		fontWeight: 600
	}
});

export default withStyles(styles)(Navbar);
