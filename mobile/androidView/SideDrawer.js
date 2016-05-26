import React, { Text, View,Alert, Component, PropTypes, StyleSheet, ListView, TouchableOpacity,Image } from 'react-native';
import Drawer from 'react-native-drawer';

import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActionCreator from 'common/actions/auth';
import * as drawerActionCreator from './actions/draweraction';
import {Actions} from 'react-native-router-flux';
import {DefaultRenderer} from 'react-native-router-flux';
var StorageMgr = require('common/imagecache/storageMgr.js');

// const stateList = config.USER_ROLE_MANAGER ? fieldTestManagerMenu : fieldTesterMenu;
const emptyList = [
];
const storageMgr = new StorageMgr();

class SideDrawerContent extends Component {

	static contextTypes = {
		drawer: PropTypes.object.isRequired,
	};
	constructor(props){
		super(props);
		this.stateData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {};
	}

	renderRow(rowData) {
		console.log("rowData"+rowData);
		var separatorHeight = 1;
		return (
			<TouchableOpacity key={rowData.id+''}
							  onPress={() => this.rowPressed(rowData)}
							  underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<View style={styles.textContainer}>
							<Text style={styles.menuTextStyle}>{ rowData.name }</Text>
						</View>

					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableOpacity>
		);
	}

	async openMenuAction(rowData) {
				switch (rowData.id) {
				case 1:   await Actions.MyTests();
				console.log("in MyTests");
					break;
				case 2:  await Actions.Samples();
				console.log("in Samples");

					break;
				case 3:  await Actions.Testers();
				console.log("in Testers");

					break;
				case 4: this.showConfirmationAlert();
					break;
				default:  await Actions.MyTests();
					break;
			}
	}

	async rowPressed(rowData) {
		console.log("rowdatarow"+JSON.stringify(rowData));
		await this.openMenuAction(rowData);
		const { drawer } = this.context;
	    drawer.close();
	}

	showConfirmationAlert() {
		Alert.alert( null, 'Are you sure you want to logout?',
		 [
			 {text: 'No'},
			{text: 'Yes', onPress: () => this.onLogout()}
		 ]
	  )
	}

  onLogout() {
		storageMgr.clear();
		Actions.Login();
		this.props.logout()
	}

	render() {
		var menuItems = this.props.menuList != null ? this.props.menuList : emptyList;
		return (
			<View style = {styles.container}>
				{config.USER_PROFILE != null ?
					<View style={styles.profileImageContainer}>
					<Image style={styles.roundImage} source={require('image!profileicon')} />
					<Text numberOfLines={2} style={[styles.stateLabel, {marginBottom: 20, textAlign: 'center'}]}>{config.USER_PROFILE.firstName + " " + config.USER_PROFILE.lastName}</Text>
					</View> :
					<View style={styles.profileImageContainer}></View>
				}
				<ListView style={{backgroundColor: '#7B7E7E'}}
						  dataSource={this.stateData.cloneWithRows(menuItems)}
						  renderRow={this.renderRow.bind(this)}
						  automaticallyAdjustContentInsets={false}
						  contentInset={{bottom:0}}
						  scrollEventThrottle={300}
						  onEndReachedThreshold={2}
						  directionalLockEnabled={true}
				/>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		backgroundColor: '#7B7E7E'
	},
	textContainer: {
		flex: 1
	},
	separator: {
		height: 1,
		backgroundColor: '#B0B5B5',
		marginLeft: 5
	},
	stateLabel: {
		fontSize: 16,
		color: 'white',
		fontFamily: 'Helvetica Neue',
		fontWeight: '500',
	},
	menuTextStyle: {
		fontSize: 14,
		color: 'white',
		fontFamily: 'Helvetica Neue',
		paddingTop:3,
		paddingLeft:4,

	},
	rowContainer: {
		flexDirection: 'row',
		padding: 8
	},
	profileImageContainer: {
    alignItems: 'center',
  },
  roundImage: {
    backgroundColor: "#F1F1EF",
    width: 80,
    height: 80,
    borderRadius:40,
    marginTop: 10,
    marginBottom: 20,
  },

});

class SideDrawer extends Component {
	componentWillReceiveProps(nextProps) {
      if (!nextProps.isAuthenticated) {
          Actions.Login();
      }else{
				if((nextProps.isRouteUpdated != this.props.isRouteUpdated) && this.props.openstate == true) {
					this.refs.drawer.close();
				} else if(nextProps.openstate != this.props.openstate){
					if(nextProps.openstate){
						this.refs.drawer.open();
					}else{
						this.refs.drawer.close();
					}
				}
			}
  }

	logout(){
    	this.props.authActions.logoutUser();
  }

  render() {
		const children = this.props.navigationState.children;
    return (

		<Drawer
				ref="drawer"
        type="static"
        content={<SideDrawerContent logout={this.logout.bind(this)} menuList={this.props.menuList}/>}
        tapToClose={true}
				acceptTap={false}
				acceptPan={true}
        openDrawerOffset={0.56}
        panCloseMask={0.7}
				panOpenMask={0.3}
        closedDrawerOffset={-3}
				negotiatePan={true}
				styles={drawerStyles}
				tweenHandler={Drawer.tweenPresets.parallax}
				tweenDuration={300}

      >
        <DefaultRenderer navigationState={children[0]} />
      </Drawer>
    )
  }

}

var drawerStyles = {
	drawer: { backgroundColor: '#ffffff' },
	main: { paddingLeft: 0}
};

const mapStateToProps = (state) => ({
	"isAuthenticated": state.auth.isAuthenticated,
	"openstate":state.drawer.open,
	'isRouteUpdated':state.route.isRouteUpdated,
	"menuList": state.auth.sideMenu
});

const mapDispatchToProps = (dispatch) => ({
	'authActions': bindActionCreators(authActionCreator, dispatch),
	'drawerAction': bindActionCreators(drawerActionCreator, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
