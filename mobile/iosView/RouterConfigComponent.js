/**
 * Created by synerzip on 11/02/16.
 */
import React, {AppRegistry, Navigator, StyleSheet, Text, View, AsyncStorage, Platform, NetInfo, AppState} from 'react-native'
import {Route, Scene, Animations, TabBar,Router, Reducer, Modal, Actions} from 'react-native-router-flux'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {requireMaskComponent} from './MaskWrapComponent';

import SideDrawer from './SideDrawer';
import LoginView from './userViews/LoginView';

// My Tests views
import MyTestsView from './testsViews/MyTestsView';
import AddComment from './testsViews/AddCommentView';
import MyTestDetailView from './testsViews/MyTestDetailView';

// Samples views
import SamplesListView from './sampleViews/SamplesListView';
import CreateSampleView from './sampleViews/AddSampleView';
import SampleDetailsView from './sampleViews/SampleDetailsView';
import SelectTester from './sampleViews/SelectTester';

// Testers views
import TestersView from './testerViews/TestersView';
import InviteTester from './testerViews/InviteTester';
import TesterDetailView from './testerViews/TesterDetailView';
import TesterEditView from './testerViews/TesterEditView';

import config from 'common/config';
import * as authActionCreator from 'common/actions/auth';
import * as drawerActionCreator from './actions/draweraction';
import * as trialActionCreator from '/common/actions/trials';
import * as appActionCreator from '/common/actions/app';
var AppStyles = require('./styles.ios');
import NavbarButton from './NavbarButton';
import ReactNativeRouter from 'react-native-router-flux';
import AppNavBar from './AppNavBar';

const hideNavBar = Platform.OS === 'android'
const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

class RouterConfigComponent extends React.Component{
// Used for to pass the drawer to the all children
    // static childContextTypes = {
    //     drawer: React.PropTypes.object,
    // };

    constructor (props) {
        super(props);
        this.state = {
            isNetworkConnected: null,
        };
    }

    getNetworkConnectivityStatus() {
      NetInfo.isConnected.fetch().done(
            (isConnected) => {
              console.log("Connected network" + isConnected);
              config.NETWORK_STATUS = isConnected;
              this.setState({isNetworkConnected : isConnected});
              this.props.appActions.initialNetworkStatusUpdate(isConnected);
              return isConnected;
            }
        );
    }

    componentWillMount(){
        this.getNetworkConnectivityStatus();
        this.props.appActions.setNetworkConnectivityObserver();
        AppState.addEventListener('change', this.handleAppStateChange);

        AsyncStorage.getItem('REFRESH_TOKEN').then((value) => {
            config.REFRESH_TOKEN = value;
        }).done();

        AsyncStorage.getItem('USER_PROFILE').then((value) => {
            config.USER_PROFILE = JSON.parse(value);
        }).done();

        AsyncStorage.getItem('DEFAULT_FIELD_TEST').then((value) => {
            config.DEFAULT_FIELD_TEST = JSON.parse(value);
        }).done();

        AsyncStorage.getItem('DEFAULT_SURVEY_FORM').then((value) => {
            config.DEFAULT_SURVEY_FORM = JSON.parse(value);
        }).done();

        AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
            this.props.authActions.onTokenReceive(value);
        }).done();

        AsyncStorage.getItem('ORGANIZATION_ID').then((value) => {
            config.ORGANIZATION_ID = value;
        }).done();

        AsyncStorage.getItem('USER_ROLE').then((value) => {
            if(value === "Manager"){
              this.props.authActions.onUserRoleReceive(true);
              config.USER_ROLE_MANAGER = true;
            }else if(value === "Tester"){
              this.props.authActions.onUserRoleReceive(false);
              config.USER_ROLE_MANAGER = false;
            }
        }).done();

        this.props.trialActions.isSyncingRequired()
    }

    handleAppStateChange = (appState) => {
        console.log("AppState" + appState);
        console.log(this);
        this.getNetworkConnectivityStatus();
    };

    closeControlPanel = () => {
        const { drawer } = this.context;
        drawer.close()
    };

    openAddSamples = () => {
        Actions.CreateSample.call();
    };

    openInviteTester = () => {
        Actions.InviteTester.call();
    };

    dismiss = () => {
        Actions.pop();
    };

    startSyncProcess = () => {
        this.props.trialActions.offlineCommentSyncing();
    };

    //Navigation bar left right button with image.
    addSampleButton = () => {
        return (<NavbarButton style = {styles.addButtonStyle}
            image={require('common/images/add.png')}
            onPress={this.openAddSamples} />);
    };

    addInviteTesterButton = () => {
        return (<NavbarButton style = {styles.addButtonStyle}
                              image={require('common/images/add.png')}
                              onPress={this.openInviteTester} />);
    };

    addSyncButton = () => {
      if(this.props.isSyncRequired == true && this.props.isNetworkStatus == true) {
        return (<NavbarButton style = {styles.syncButtonStyle}
            image={require('common/images/button_sync.png')}
            onPress={this.startSyncProcess}  />);
      }else{
        return(<View/>);
      }

    };

    render(){
        const { drawer } = this.context;

        if(this.props.checkedAuthentication && (!isAuthenticated || this.props.checkedRole) && this.state.isNetworkConnected != null){
            var isAuthenticated = this.props.isAuthenticated;
            var initialLogin = true;
            var initialDrawer = false
            if(isAuthenticated){
              initialLogin = false;
               initialDrawer = true;
            }else{
              initialDrawer = false;
               initialLogin = true;
            }

            return (
              <Router createReducer={reducerCreate}>
                <Scene key="modal" hideNavBar={true}>
                <Scene key="root" hideNavBar={true}>
                  <Scene key='Login' component={requireMaskComponent(LoginView)} initial={initialLogin} hideNavBar={true}/>
                  <Scene key='InviteTester' component={requireMaskComponent(InviteTester)} type="push" hideNavBar={true}/>
                  <Scene key='TesterDetailView' component={requireMaskComponent(TesterDetailView)} type="push" hideNavBar={true}/>
                  <Scene key='CreateSample' component={requireMaskComponent(CreateSampleView)} hideNavBar={true} title='CREATE SAMPLE' type="push"/>
                  <Scene key='SelectTester' component={requireMaskComponent(SelectTester)} hideNavBar={true} title='SELECT TESTER' type="push" />
                  <Scene key='AddComment' component={requireMaskComponent(AddComment)} hideNavBar={true} title='ADD COMMENT' type='push'/>
                  <Scene key='SampleDetails' component={requireMaskComponent(SampleDetailsView)} hideNavBar={true} title='CREATE SAMPLE' type="push"/>
                  <Scene key='TrialDetail' component={requireMaskComponent(MyTestDetailView)} hideNavBar={true} title='TRIAL DETAIL' type="push"/>
                  <Scene key='TesterEditView' component={requireMaskComponent(TesterEditView)} hideNavBar={true} title='EDIT TESTER' type="push"/>
                  <Scene key='Drawer' hideNavBar={true} component={SideDrawer} initial={initialDrawer}>
                        <Scene key='main'
                              sceneStyle={styles.routerScene}
                              navigationBarStyle={AppStyles.navbar}
                              titleStyle={[AppStyles.navBarTitle, {top:20}]} navBar={AppNavBar}>

                              <Scene key='MyTests' sceneStyle={styles.routerScene} component={requireMaskComponent(MyTestsView)} title='MY TESTS' type="replace"
                              renderRightButton = {this.addSyncButton} />

                              <Scene key='Samples' sceneStyle={styles.routerScene}  component={requireMaskComponent(SamplesListView)} title='SAMPLES' type="replace"
                              renderRightButton = {this.addSampleButton}/>

                              <Scene key='Testers' sceneStyle={styles.routerScene} component={requireMaskComponent(TestersView)} title='TESTERS' type="replace"
                              renderRightButton = {this.addInviteTesterButton}/>

                       </Scene>

                  </Scene>
                  </Scene>
                </Scene>
              </Router>

            );
        } else {
            return (
              <View />
            );
        }
    }
}

RouterConfigComponent.contextTypes = {
  drawer: React.PropTypes.object
}

const styles = StyleSheet.create({
    navBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    navTitle: {
        color: 'white',
    },
    syncButtonStyle: {
      marginRight:15,
      top: 15,
      right: 15,
      position: 'absolute'
    },
    humbergerButtonStyle: {
      top: 35,
      marginLeft:15,
      left : 0,
    },
    addButtonStyle: {
      marginRight:10,
      top: 14,
      right: 15,
      position: 'absolute'
    },
    routerScene: {
        paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight, // some navbar padding to avoid content overlap
    },
})

const mapStateToProps = (state) => ({
    'isAuthenticated':state.auth.isAuthenticated,
    'checkedAuthentication':state.auth.checkedAuthentication,
    'checkedRole':state.auth.checkedRole,
    'isSyncRequired': state.trial.isSyncRequired,
    'isNetworkStatus': state.app.isNetworkStatus
});

const mapDispatchToProps = (dispatch) => ({
  'authActions': bindActionCreators(authActionCreator, dispatch),
  'drawerAction':bindActionCreators(drawerActionCreator,dispatch),
  'trialActions':bindActionCreators(trialActionCreator, dispatch),
  'appActions':bindActionCreators(appActionCreator, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RouterConfigComponent);
